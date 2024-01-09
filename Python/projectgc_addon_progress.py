import xml.etree.ElementTree as ET
from geocache import Geocache, CacheParseException

class GpxParser:
    _namespaces = {'TN': "http://www.topografix.com/GPX/1/0",
                   'GN': "http://www.groundspeak.com/cache/1/0/1"}
    profileName = ""

    # Keep track of errors encountered while parsing the caches.
    # Each type of error is only recorded once. Cap at 20 errors total.
    cacheParseErrors = {}

    def __init__(self, file):
        self.tree = ET.parse(file)
        self.root = self.tree.getroot()

        # Quick check that this is indeed a 'My Finds' GPX
        # file as opposed to some other Geocaching GPX file.
        nameNode = self.root.find("./TN:name", self._namespaces)
        if nameNode is None or nameNode.text != "My Finds Pocket Query":
            raise Exception('File is not a "My Finds" GPX file.') 

        finderNode = self.root.find("./TN:wpt/GN:cache/GN:logs/GN:log/GN:finder", self._namespaces)
        if finderNode is None:
            raise Exception("Not able to find any logs in GPX file.")

        self.profileName = finderNode.text

    
    def iterate_caches(self):
        for wptNode in self.root.findall("./TN:wpt", self._namespaces):
            try:
                yield Geocache(wptNode, self.profileName, self._namespaces)
            except CacheParseException as e:
                if len(cacheParseErrors) < 20:
                    cacheParseErrors.add(str(e))
        
        
