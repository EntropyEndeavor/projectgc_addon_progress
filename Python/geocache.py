from datetime import date
import attributes

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

class CacheParseException(Exception):
    pass

class Geocache:
    foundDates = set()
    isFtf = False
    attributes = set()
    hostedEvent = False

    def __init__(self, wptNode, profileName, namespaces):
        self._set_gccode(wptNode, namespaces)
        self._set_name(wptNode, namespaces)
        self._set_type(wptNode, profileName, namespaces)
        self._set_size(wptNode, namespaces)
        self._set_dt(wptNode, namespaces)
        self._set_attributes(wptNode, namespaces)
        self._set_dates_found(wptNode, namespaces)
        self._set_date_hidden(wptNode, namespaces)
        self._set_ftf_status(wptNode, namespaces)

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
            raise CacheParseException("A geocache has an unrecognized type: " + self.type)

        if self.type in eventTypes:
            ownerNode = wptNode.find("./GN:cache/GN:owner", namespaces)
            if ownerNode is None:
                raise CacheParseException("A Geocache doesn't have an owner.")

            if ownerNode.text == profileName:
                hostedEvent = True

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

    def _set_dates_found(self, wptNode, namespaces):
        for foundDateNode in wptNode.findall("./GN:cache/GN:logs/GN:log[GN:type='Found it']/GN:date", namespaces):
            try:
                self.foundDates.add(date.fromisoformat(foundDateNode.text[:10]))
            except ValueError as e:
                raise CacheParseException(str(e))

        if len(self.foundDates) == 0:
            raise CacheParseException("A Geocache has no found logs.")

    def _set_date_hidden(self, wptNode, namespaces):
        hiddenDateNode = wptNode.find("./TN:time", namespaces)
        if hiddenDateNode is None:
            raise CacheParseException("A geocache doesn't have a hidden date.")

        try:
            self.hiddenDate = date.fromisoformat(hiddenDateNode.text[:10])
        except ValueError as e:
            raise CacheParseException(str(e))

    def _set_ftf_status(self, wptNode, namespaces):
        for foundLogNode in wptNode.findall("./GN:cache/GN:logs/GN:log[GN:type='Found it']/GN:text", namespaces):
            if "{*FTF*}" in foundLogNode.text or "{FTF}" in foundLogNode.text or "[FTF]" in foundLogNode.text:
                self.isFtf = True
    


    def is_challenge(self):
        return attributes.CHALLENGE in self.attributes and "Unknown Cache" == self.type

    def is_old_virtual(self):
        return "Virtual Cache" == self.type and self.hiddenDate.year <= 2005

    def is_t5_boat(self):
        return attributes.BOAT in self.attributes and self.terrain == "5.0"

    def is_t5_climb(self):
        return attributes.CLIMB in self.attrributes and self.terrain == "5.0"

    def is_d5_field_puzzle(self):
        return attributes.FIELD_PUZZLE in self.attributes and self.difficulty == "5.0"
    
