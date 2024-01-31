import tempfile
import webbrowser
import time
import os
import sys
import tkinter as TK
import tkinter.messagebox as TKMB
import tkinter.filedialog as TKFD
from PIL import Image, ImageTk
from io import BytesIO
import zipfile
import base64
from pathlib import Path
import xml.etree.ElementTree as ET
from geocache import Geocache, CacheParseException
from result_aggregator import ResultAggregator
import html_builder as HTML

class GpxParser:
    _namespaces = {'TN': "http://www.topografix.com/GPX/1/0",
                   'GN': "http://www.groundspeak.com/cache/1/0/1"}
    profileName = ""

    # Keep track of errors encountered while parsing the caches.
    # Each type of error is only recorded once. Cap at 20 errors total.
    cacheParseErrors = set()

    def __init__(self, file):
        self.tree = ET.parse(file)
        self.root = self.tree.getroot()

        # Quick check that this is indeed a 'My Finds' GPX
        # file as opposed to some other Geocaching GPX file.
        nameNode = self.root.find("./TN:name", self._namespaces)
        if nameNode is None or nameNode.text != "My Finds Pocket Query":
            raise ET.ParseError('File is not a "My Finds" GPX file.') 

        finderNode = self.root.find("./TN:wpt/GN:cache/GN:logs/GN:log/GN:finder", self._namespaces)
        if finderNode is None:
            raise ET.ParseError("Not able to find any logs in GPX file.")

        self.profileName = finderNode.text
        self.ftfList = set()

    def setup_ftf_bookmark_list(self, ftf_file):
        try:
            tree = ET.parse(ftf_file)
            root = tree.getroot()

            for node in root.findall("./TN:wpt[TN:sym='Geocache']/TN:name", self._namespaces):
                self.ftfList.add(node.text)
        except Exception as e:
            self.cacheParseErrors.add("Error parsing FTF list " + str(e))
    
    def iterate_caches(self):
        for wptNode in self.root.findall("./TN:wpt", self._namespaces):
            try:
                yield Geocache(wptNode, self.profileName, self._namespaces, self.ftfList)
            except CacheParseException as e:
                if len(self.cacheParseErrors) < 20:
                    self.cacheParseErrors.add(str(e))


class GUI:
    def __init__(self):

        self.myFinds = None
        self.ftfFile = None

        self.root = TK.Tk()
        self.root.title("Project-GC Addon Progress")
        self.root.resizable(False, False)
        self.root.geometry("530x180")
        self.root.configure(background='lightgoldenrodyellow')

        label1 = TK.Label(self.root, text='"My Finds" GPX file:', bg='lightgoldenrodyellow')
        label1.grid(row=0,column=0,padx=10, pady=10)
        label2 = TK.Label(self.root, text='FTF GPX file (optional):', bg='lightgoldenrodyellow')
        label2.grid(row=1,column=0,padx=10, pady=10)


        
        self.myFindsButton = TK.Button(self.root, text="Browse", command=lambda:self.select_gpx_file(True))
        self.myFindsButton.grid(row=0,column=1,padx=10, pady=10)


        self.ftfFileButton = TK.Button(self.root, text="Browse",command=lambda:self.select_gpx_file(False))
        self.ftfFileButton.grid(row=1,column=1,padx=10, pady=10)

        
        self.myFindsLabel = TK.Label(self.root, width=34, font="TkFixedFont")
        self.myFindsLabel.grid(row=0,column=2,padx=10, pady=10)
        self.ftfLabel = TK.Label(self.root, width=34, font="TkFixedFont")
        self.ftfLabel.grid(row=1,column=2,padx=10, pady=10)

        self.combineCal = TK.BooleanVar()
        combine = TK.Checkbutton(self.root, text="Combine Calendars?", bg='lightgoldenrodyellow',
                                 variable=self.combineCal, offvalue=False, onvalue=True)
        combine.grid(row=2,column=0,padx=10, pady=10)
        go = TK.Button(self.root, text="Go!", width=6, command=lambda:self.compute_page())
        go.grid(row=2, column=2,padx=10, pady=10, sticky=TK.E)
        
        self.limitationsLabel = TK.Label(self.root, text="\u25B2 Limitations",bg='lightgoldenrodyellow')
        self.limitationsLabel.bind("<Button-1>", lambda e: self.swap_limitations())
        self.limitationsLabel.grid(row=3, column=0, padx=10, pady=10, sticky = TK.W)
        self.limitationsShowing = False

        self.workingLabel = TK.Label(self.root, bg='lightgoldenrodyellow')
        self.workingLabel.grid(row=3, column=2, padx=10, pady=10)

        self.limitationsText = TK.Text(self.root, bg='lightgoldenrodyellow', bd=0, font="TkTextFont 8", wrap=TK.WORD)
        self.limitationsText.tag_configure("bold", font="TkTextFont 8 bold")
        self.limitationsText.place(x=10, y=190, width = 510, height= 450)



        self.limitationsText.insert('end', '\u2022 Lab caches are completely absent from the "My Finds" GPX file. ')
        self.limitationsText.insert('end', 'All addons for the ')
        self.limitationsText.insert('end', 'Lab Cacher', 'bold')
        self.limitationsText.insert('end', ' Badge are therefore excluded. This can also cause the value for the ')
        self.limitationsText.insert('end', 'Busy Cacher', 'bold')
        self.limitationsText.insert('end', ' Badge and ')
        self.limitationsText.insert('end', 'Diverse Cacher', 'bold')
        self.limitationsText.insert('end', ' Badge addon to be one type short.\n\n\u2022 The addons for the ')
        self.limitationsText.insert('end', 'Achiever', 'bold')
        self.limitationsText.insert('end', ' Badge may be slightly incorrect as Project-GC maintains a list of ')
        self.limitationsText.insert('end', 'exceptions for classifying a cache as a challenge cache.\n\n\u2022 ')
        self.limitationsText.insert('end', 'The addons for the ')
        self.limitationsText.insert('end', 'All Around Cacher', 'bold')
        self.limitationsText.insert('end', ' Badge are excluded for three reasons: (1) If you take advantage ')
        self.limitationsText.insert('end', 'of the solved coordinate feature, then the original coordinates will ')
        self.limitationsText.insert('end', 'not be listed in the "My Finds" GPX file, and it is the original ')
        self.limitationsText.insert('end', 'coordinates that are used by Project-GC for this computation. (2) ')
        self.limitationsText.insert('end', 'Your home location is not listed in your "My Finds" GPX file and would ')
        self.limitationsText.insert('end', 'have to be entered separately. (3) Project-GC itself recognizes that ')
        self.limitationsText.insert('end', 'small differences in how the angle is computed could result in different ')
        self.limitationsText.insert('end', 'outcomes in other tools for caches near the boundaries.\n\n\u2022 ')
        self.limitationsText.insert('end', 'You will only earn credit for a hosted event if you also logged that ')
        self.limitationsText.insert('end', 'you attended.\n\n\u2022 The addons for the ')
        self.limitationsText.insert('end', 'High Altitude Cacher', 'bold')
        self.limitationsText.insert('end', ' Badge and ')
        self.limitationsText.insert('end', 'Low Altitude Cacher', 'bold')
        self.limitationsText.insert('end', ' Badge are excluded as elevation information is not present in the ')
        self.limitationsText.insert('end', '"My Finds" GPX file.\n\n\u2022 The addons for the ')
        self.limitationsText.insert('end', 'Long-Distance Cacher', 'bold')
        self.limitationsText.insert('end', ' Badge are excluded as the home coordinates are not present in the ')
        self.limitationsText.insert('end', '"My Finds" GPX file. Since there are either completed or not (i.e. ')
        self.limitationsText.insert('end', "you can't make partial progress on them), I don't deem it important ")
        self.limitationsText.insert('end', 'enough to allow the home coordinates entered separately.\n\n\u2022 The ')
        self.limitationsText.insert('end', 'All counties', 'bold')
        self.limitationsText.insert('end', ' addon is excluded from the Country Badges as this information is not ')
        self.limitationsText.insert('end', 'included in the "My Finds" GPX file.\n\n\u2022 I do not know if I ')
        self.limitationsText.insert('end', 'correctly handled cases where there are more than one found log on a ')
        self.limitationsText.insert('end', 'cache.\n\n\u2022 Grid loops are not reported in the "Way to 81" table.')
        
        self.limitationsText.config(state=TK.DISABLED)


        icoData = base64.b64decode(HTML.favicon.split(',')[-1])
        favicon = ImageTk.PhotoImage(Image.open(BytesIO(icoData)))
        self.root.wm_iconphoto(True, favicon)


        self.root.mainloop()

    def select_gpx_file(self, myFinds):
        title = 'Select "My Finds" GPX file' if myFinds else "Select FTF GPX file"

        if myFinds:
            filetypes = (('GPX file', '*.gpx'), ('Compressed GPX', '*.zip'))
        else:
            filetypes = (('GPX file', '*.gpx'),)

        filename = TKFD.askopenfilename(title=title, initialdir=Path.home(), filetypes=filetypes)

        displayFilename = filename if len(filename) <= 34 else "..." + filename[-31:]

        if myFinds:
            self.myFinds = filename
            self.myFindsLabel["text"] = displayFilename
        else:
            self.ftfFile = filename
            self.ftfLabel["text"] = displayFilename

    def swap_limitations(self):
        if self.limitationsShowing:
            self.root.geometry("530x180")
            self.limitationsShowing = False
            self.limitationsLabel["text"] = "\u25B2 Limitations"
        else:   
            self.root.geometry("530x650")
            self.limitationsShowing = True
            self.limitationsLabel["text"] = "\u25BC Limitations"

    def compute_page(self):
        if self.myFinds is None:
            TKMB.showwarning(title="Select a file!", message='You must select a "My Finds" GPX file.')
            return

        self.workingLabel["text"] = "Working... Please be patient!"
        self.root.update()
        
        try:
            if self.myFinds.endswith(".zip"):
                z = zipfile.ZipFile(self.myFinds)
                for f in z.namelist():
                    if f.endswith(".gpx"):
                        self.myFinds = z.open(f)
                        break
                else:
                    raise zipfile.BadZipFile("Zip file doesn't contain a GPX file")
            
            myFindsFile = GpxParser(self.myFinds)
        except (ET.ParseError, zipfile.BadZipFile) as e:
            TKMB.showwarning(title="Parse Error", message = str(e))
            self.myFinds = None
            self.myFindsLabel["text"] = ""
            self.workingLabel["text"] = ""
            return


        if self.ftfFile is not None:
            myFindsFile.setup_ftf_bookmark_list(self.ftfFile)
            
        results = ResultAggregator()
        for cache in myFindsFile.iterate_caches():
            results.update(cache)

        with tempfile.NamedTemporaryFile('wb', suffix = '.html', delete=False) as f:
            tree = results.create_html(self.combineCal.get(), myFindsFile.cacheParseErrors)
            ET.indent(tree)
            f.write(b"<!DOCTYPE html>\n")
            tree.write(f, method="html")
            f.flush()
            os.fsync(f.fileno())
        webbrowser.open("file://" + os.path.realpath(f.name))
        self.root.destroy()


    
if __name__ == '__main__':
    g = GUI()
    sys.exit(0)
