from datetime import datetime
import attributes
import country_flag_unicode as countries

knownTypes = {"Cache In Trash Out Event", "Community Celebration Event",
              "Earthcache", "Event Cache", "Groundspeak HQ",
              "Geocaching HQ Block Party", "Geocaching HQ Celebration",
              "Giga-Event Cache", "GPS Adventures Exhibit",
              "Letterbox Hybrid", "Locationless (Reverse) Cache",
              "Mega-Event Cache", "Multi-cache", "Project APE Cache",
              "Traditional Cache", "Unknown Cache", "Virtual Cache",
              "Webcam Cache", "Wherigo Cache"}

eventTypes = {"Cache In Trash Out Event", "Community Celebration Event",
              "Event Cache", "Geocaching HQ Block Party",
              "Geocaching HQ Celebration", "Giga-Event Cache", 
              "Mega-Event Cache"}

knownDts = {"1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"}

knownSizes = {"Large", "Micro", "Not chosen", "Other", "Regular",
              "Small", "Virtual"}

# Project-GC excluded caches from boomark list BMAFMJR which contains things 
# like prior traveling caches and antipode caches from country statistics.
excludedCaches = {'GC990D', 'GC3906', 'GCG7ED', 'GC78F3', 'GCWZR3', 'GCA7AD',
                  'GCCCB4', 'GCV3CA', 'GCDB80', 'GC384E', 'GCE6FE', 'GC4084',
                  'GC3TMG7', 'GC8689', 'GC3853', 'GCGWVP', 'GCF8F2', 'GCQG54',
                  'GC8E10', 'GC7C01', 'GC6YNCE', 'GC1MC5R', 'GCCFD9', 'GCGY2Z',
                  'GC55A5', 'GCF55A', 'GCX1BA', 'GCCF79', 'GC43F3', 'GC7375',
                  'GCCF6F', 'GC59EF', 'GC5YQ8R', 'GC2CE0', 'GC4241', 'GCED59',
                  'GCCDDE', 'GCGWME', 'GCD1C3', 'GCD39C', 'GC2EBD', 'GCG2BA',
                  'GCAE60', 'GC4D97', 'GCD079', 'GCE99F', 'GCD870', 'GCD6F3',
                  'GC67D8', 'GCQZ4M', 'GCHKD7', 'GC8D77', 'GCDFC2', 'GC84K2E',
                  'GCE862', 'GC678F', 'GCD3D3', 'GC4602', 'GC81C4', 'GC3470',
                  'GC62E', 'GCDB76', 'GCD5C', 'GC21PRM', 'GCA0D6', 'GCD33F',
                  'GC8551', 'GC55D9', 'GC384F', 'GC44C8', 'GCD007', 'GCKTK0',
                  'GC96EC', 'GCHRFA', 'GC77DE', 'GC4FD3', 'GCB598', 'GC6Z31Q',
                  'GCE8FF', 'GC9253', 'GC382C', 'GCE99E', 'GC4C35', 'GC3866',
                  'GC19GK9', 'GCCCC7', 'GC386A', 'GC3878', 'GC9D2E', 'GC4FD5',
                  'GC22FE', 'GC3867', 'GC4FD4', 'GC7031', 'GCD4AB', 'GCD4AE',
                  'GCC5EE', 'GCF29D', 'GC45C9', 'GC47BE', 'GC82D0', 'GC1965',
                  'GCD6ED', 'GCD118', 'GCD07A', 'GC68FE', 'GC105D', 'GCE8D4',
                  'GC24C1', 'GC46AA', 'GCC8CB', 'GCCFC9', 'GCDF4B', 'GCCC5E',
                  'GCE0BC', 'GC9660', 'GCEA59', 'GC1E22', 'GCP172', 'GC2179',
                  'GCD8C8', 'GCC859', 'GCB652', 'GC4DWYY', 'GC1A74', 'GCD4AD',
                  'GC3861', 'GC1CGC2', 'GC7361', 'GC10511', 'GC3507', 'GC36F3',
                  'GC1D0F', 'GCCCD2', 'GC3C85', 'GC3895', 'GC95BF', 'GCGWX1',
                  'GC350A', 'GCF2A3', 'GC9F2E', 'GC5416', 'GCB92C', 'GCC6B',
                  'GCBBD3', 'GCD360', 'GC3241', 'GCCD54', 'GCDB8A', 'GC7572',
                  'GCE042', 'GC8D14', 'GC3JH2C', 'GCE152', 'GC73B7', 'GCHB5X',
                  'GCA87C', 'GCDA84', 'GC45CC', 'GC1683', 'GC8E37', 'GC5566',
                  'GC4411', 'GC6ADF', 'GC384D', 'GCB6CC', 'GC2PPNP', 'GCGPA6',
                  'GCD34D', 'GC853BD', 'GC137F', 'GC4Q81D', 'GCD0FE', 'GC778E',
                  'GC1E1F', 'GC7628', 'GC7D6E', 'GC3B4D'}

class CacheParseException(Exception):
    pass

class Geocache:
    def __init__(self, wptNode, profileName, namespaces, ftfList):
        self.foundDates = []
        self.isFtf = False
        self.attributes = set()
        self.hostedEvent = False
        
        self._set_gccode(wptNode, namespaces)
        self._set_name(wptNode, namespaces)
        self._set_type(wptNode, profileName, namespaces)
        self._set_size(wptNode, namespaces)
        self._set_dt(wptNode, namespaces)
        self._set_attributes(wptNode, namespaces)
        self._set_dates_found(wptNode, namespaces)
        self._set_date_hidden(wptNode, namespaces)
        self._set_ftf_status(wptNode, namespaces, ftfList)
        self._set_country(wptNode, namespaces)

    def _set_gccode(self, wptNode, namespaces):
        codeNode = wptNode.find("./TN:name", namespaces)
        if codeNode is None:
            raise CacheParseException("A Geocache doesn't have a GC code.")
        self.gcCode = codeNode.text

    def _set_name(self, wptNode, namespaces):
        nameNode = wptNode.find("./GN:cache/GN:name", namespaces)
        if nameNode is None:
            raise CacheParseException("A Geocache doesn't have a name.")
        self.name = nameNode.text

    def _set_type(self, wptNode, profileName, namespaces):
        typeNode = wptNode.find("./GN:cache/GN:type", namespaces)
        if typeNode is None:
            raise CacheParseException("A Geocache doesn't have a type.")

        self.type = typeNode.text
        if self.type not in knownTypes:
            raise CacheParseException("A Geocache has an unrecognized type: " + self.type)

        if self.type in eventTypes:
            ownerNode = wptNode.find("./GN:cache/GN:owner", namespaces)
            if ownerNode is None:
                raise CacheParseException("A Geocache doesn't have an owner.")

            if ownerNode.text == profileName:
                self.hostedEvent = True

    def _set_size(self, wptNode, namespaces):
        sizeNode = wptNode.find("./GN:cache/GN:container", namespaces)
        if sizeNode is None:
            raise CacheParseException("A Geocache doesn't have a size.")

        self.size = sizeNode.text
        if self.size not in knownSizes:
            raise CacheParseException("A Geocache has an unrecognized size: " + self.size)

    def _set_dt(self, wptNode, namespaces):
        difficultyNode = wptNode.find("./GN:cache/GN:difficulty", namespaces)
        if difficultyNode is None:
            raise CacheParseException("A Geocache has no difficulty.")

        self.difficulty = difficultyNode.text
        if self.difficulty not in knownDts:
            raise CacheParseException("A Geocache has an unrecognized difficulty: " + self.difficulty)

        terrainNode = wptNode.find("./GN:cache/GN:terrain", namespaces)
        if terrainNode is None:
            raise CacheParseException("A Geocache has no terrain.")

        self.terrain = terrainNode.text
        if self.terrain not in knownDts:
            raise CacheParseException("A Geocache has an unrecognized terrain: " + self.terrain)

    def _set_attributes(self, wptNode, namespaces):
        for attributeNode in wptNode.findall("./GN:cache/GN:attributes/GN:attribute", namespaces):
            try:
                attribute = int(attributeNode.get("id", "0"))
            except ValueError as e:
                raise CacheParseException(str(e))
            
            if "0" == attributeNode.get("inc", "1"):
                attribute *= -1

            if attribute not in attributes.knownAttributes:
                raise CacheParseException("A Geocache has an unrecognized attribute: " + str(attribute) + " - " + attributeNode.text)

            self.attributes.add(attribute)

    def _set_dates_found_from_log(self, foundNode, namespaces):
        foundDateNode = foundNode.find("./GN:date", namespaces)
        if foundDateNode is None:
            raise CacheParseException("A Geocache does not have a found date.")
        
        try:
            foundDate = datetime.fromisoformat(foundDateNode.text).astimezone().date()
        except ValueError as e:
            raise CacheParseException(str(e))

        lid = foundNode.get("id", None)
        if lid is None:
            raise CacheParseException("A Geocache does not have a log id.")

        self.foundDates.append((foundDate, lid))

    def _set_dates_found(self, wptNode, namespaces):
        # TDOD: How does Project-GC actually handle multiple found logs on a cache?
        for foundNode in wptNode.findall("./GN:cache/GN:logs/GN:log[GN:type='Found it']", namespaces):
            self._set_dates_found_from_log(foundNode, namespaces)

        for foundNode in wptNode.findall("./GN:cache/GN:logs/GN:log[GN:type='Attended']", namespaces):
            self._set_dates_found_from_log(foundNode, namespaces)

        for foundNode in wptNode.findall("./GN:cache/GN:logs/GN:log[GN:type='Webcam Photo Taken']", namespaces):
            self._set_dates_found_from_log(foundNode, namespaces)

        if len(self.foundDates) == 0:
            raise CacheParseException("A Geocache has no found logs.")

    def _set_date_hidden(self, wptNode, namespaces):
        hiddenDateNode = wptNode.find("./TN:time", namespaces)
        if hiddenDateNode is None:
            raise CacheParseException("A Geocache doesn't have a hidden date.")

        try:
            self.hiddenYear = int(hiddenDateNode.text[:4])
        except ValueError as e:
            raise CacheParseException(str(e))

    def _set_ftf_status(self, wptNode, namespaces, ftfList):
        if self.gcCode in ftfList:
            self.isFtf = True
            return
        
        for foundLogNode in wptNode.findall("./GN:cache/GN:logs/GN:log[GN:type='Found it']/GN:text", namespaces):
            if "{*FTF*}" in foundLogNode.text or "{FTF}" in foundLogNode.text or "[FTF]" in foundLogNode.text:
                self.isFtf = True
                return

        for foundLogNode in wptNode.findall("./GN:cache/GN:logs/GN:log[GN:type='Attended']/GN:text", namespaces):
            if "{*FTF*}" in foundLogNode.text or "{FTF}" in foundLogNode.text or "[FTF]" in foundLogNode.text:
                self.isFtf = True
                return

        for foundLogNode in wptNode.findall("./GN:cache/GN:logs/GN:log[GN:type='Webcam Photo Taken']/GN:text", namespaces):
            if "{*FTF*}" in foundLogNode.text or "{FTF}" in foundLogNode.text or "[FTF]" in foundLogNode.text:
                self.isFtf = True
                return

    def _set_country(self, wptNode, namespaces):
        countryNode = wptNode.find("./GN:cache/GN:country", namespaces)
        if countryNode is None:
            raise CacheParseException("A Geocache doesn't have a country.")

        self.country = countryNode.text
        if self.country not in countries.flagsUnicode:
            raise CacheParseException("A Geocache has an unrecognized country: " + self.country)

        # Project-GC does not include the following in country statistics.
        if "Locationless (Reverse) Cache" == self.type or self.gcCode in excludedCaches:
            self.country = None
    


    def is_challenge(self):
        return attributes.CHALLENGE in self.attributes

    def is_old_virtual(self):
        return "Virtual Cache" == self.type and self.hiddenYear <= 2005

    def is_boat(self):
        return attributes.BOAT in self.attributes

    def is_climb(self):
        return attributes.CLIMB in self.attributes

    def is_field_puzzle(self):
        return attributes.FIELD_PUZZLE in self.attributes

    def has_leapday_find(self):
        for date, _ in self.foundDates:
            if date.month == 2 and date.day == 29:
                return True

        return False
    
