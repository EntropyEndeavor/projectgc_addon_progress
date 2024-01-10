from collections import defaultdict
import attributes

class GenericResults:
    def __init__(self):
        self.calendar = set()
        self.dtGrid = {}
        self.ftf = False

    def update(self, cache):
        if cache.isFtf:
            self.ftf = True

        for date in cache.foundDates:
            self.calendar.add((date.month, date.day))

        dt = (cache.difficulty, cache.terrain)
        firstFind = min(cache.foundDates)

        if dt not in self.dtGrid or firstFind < self.dtGrid[dt][0]:
            self.dtGrid[dt] = (firstFind, cache.gcCode, cache.name, cache.type)

class AdventurousCacherResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)
        self.boats = 0
        self.field_puzzles = 0
        self.climbs = 0

    def update(self, cache):
        GenericResults.update(self, cache)

        if cache.is_boat():
            self.boats += 1

        if cache.is_field_puzzle():
            self.field_puzzles += 1

        if cache.is_climb():
            self.climbs += 1

class AttributeCacherResults:
    def __init__(self):
        self.lost_and_found = False
        self.partnership = False
        self.leapdayAttributes = set()

    def update(self, cache):
        if attributes.LOST_AND_FOUND in cache.attributes:
            self.lost_and_found = True

        if attributes.PARTNERSHIP in cache.attributes:
            self.partnership = True

        if cache.has_leapday_find():
            self.leapdayAttributes.update(cache.attributes)

class BrainiacResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)
        self.field_puzzles = 0

    def update(self, cache):
        GenericResults.update(self, cache)

        if cache.is_field_puzzle():
            self.field_puzzles += 1

class BusyCacherResults:
    def __init__(self):
        self.leapdayCounts = defaultdict(int)

    def update(self, cache):
        for date in cache.foundDates:
            if date.month == 2 and date.day == 29:
                self.leapdayCounts[date] += 1

class DiverseCacherResults:
    def __init__(self):
        self.leapdayTypes = defaultdict(set)

    def update(self, cache):
        for date in cache.foundDates:
            if date.month == 2 and date.day == 29:
                self.leapdayTypes[date].add(cache.type)

class EventHostResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)
        self.mega = False
        self.giga = False
        self.cito = False
        self.community = False

    def update(self, cache):
        GenericResults.update(self, cache)

        if "Mega-Event Cache" == cache.type:
            self.mega = True

        if "Giga-Event Cache" == cache.type:
            self.giga = True

        if "Cache In Trash Out Event" == cache.type:
            self.cito = True

        if "Community Celebration Event" == cache.type:
            self.community = True

class GeocacherResults:
    def __init__(self):
        self.community = False
        self.ape = False
        self.hq = False
        self.hq_celebration = False
        self.blockparty = False
        self.locationless = False

    def update(self, cache):
        if "Community Celebration Event" == cache.type:
            self.community = True

        if "Project APE Cache" == cache.type:
            self.ape = True

        if "Groundspeak HQ" == cache.type:
            self.hq = True

        if "Geocaching HQ Celebration" == cache.type:
            self.hq_celebration = True

        if "Geocaching HQ Block Party" == cache.type:
            self.blockparty = True

        if "Locationless (Reverse) Cache" == cache.type:
            self.locationless = True

class RuggedCacherResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)

        self.boats = 0
        self.climbs = 0

    def update(self, cache):
        GenericResults.update(self, cache)

        if cache.is_boat():
            self.boats += 1

        if cache.is_climb():
            self.climbs += 1

class TravelingCacherResults:
    def __init__(self):
        self.dtGrid = defaultdict(bool)
        self.calendar = defaultdict(bool)
        self.ftf = False

    def update(self, cache):
        dt = (cache.difficulty, cache.terrain)
        if not self.dtGrid[dt]:
           self.dtGrid[dt] = cache.country
        elif cache.country != self.dtGrid[dt]:
            self.dtGrid[dt] = True

        if cache.isFtf:
            if not self.ftf:
                self.ftf = cache.country
            elif cache.country != self.ftf:
                self.ftf = True

        for date in cache.foundDates:
            md = (date.month, date.day)
            if not self.calendar[md]:
                self.calendar[md] = cache.country
            elif self.calendar[md] != cache.country:
                self.calendar[md] = True

class VirtualCacherResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)
        self.oldCaches = 0

    def update(self, cache):
        GenericResults.update(self, cache)

        if cache.is_old_virtual():
            self.oldCaches += 1
            

class ResultAggregator:
    def __init__(self):
        self.countries = defaultdict(GenericResults)
        self.achiever = GenericResults()
        self.adventurousCacher = AdventurousCacherResults()
        self.attributeCacher = AttributeCacherResults()
        self.brainiac = BrainiacResults()
        self.busyCacher = BusyCacherResults()
        self.diverseCacher = DiverseCacherResults()
        self.earthCacher = GenericResults()
        self.environmentalCacher = GenericResults()
        self.eventHost = EventHostResults()
        self.ftfAddict = GenericResults()
        self.geocacher = GeocacherResults()
        self.gigaSocialCacher = GenericResults()
        self.gpsMazeCacher = GenericResults()
        self.largeCacher = GenericResults()
        self.letterboxer = GenericResults()
        self.matrixCacher = GenericResults()
        self.megaSocialCacher = GenericResults()
        self.microCacher = GenericResults()
        self.multiCacher = GenericResults()
        self.mysteriousCacher = GenericResults()
        self.oddSizedCacher = GenericResults()
        self.photogenicCacher = GenericResults()
        self.regularCacher = GenericResults()
        self.ruggedCacher = RuggedCacherResults()
        self.smallCacher = GenericResults()
        self.socialCacher = GenericResults()
        self.traditionalCacher = GenericResults()
        self.travelingCacher = TravelingCacherResults()
        self.virtualCacher = VirtualCacherResults()
        self.wherigoCacher = GenericResults()

    def update(self, cache):
        if cache.country is not None:
            self.countries[cache.country].update(cache)
        
        if cache.is_challenge():
            self.achiever.update(cache)

        if "5.0" == cache.difficulty and "5.0" == cache.terrain:
            self.adventurousCacher.update(cache)

        self.attributeCacher.update(cache)

        if "5.0" == cache.difficulty:
            self.brainiac.update(cache)

        self.busyCacher.update(cache)
        self.diverseCacher.update(cache)

        if "Earthcache" == cache.type:
            self.earthCacher.update(cache)

        if "Cache In Trash Out Event" == cache.type:
            self.environmentalCacher.update(cache)

        if cache.hostedEvent:
            self.eventHost.update(cache)

        if cache.isFtf:
            self.ftfAddict.update(cache)

        self.geocacher.update(cache)
    
        if "Giga-Event Cache" == cache.type:
            self.gigaSocialCacher.update(cache)

        if "GPS Adventures Exhibit" == cache.type:
            self.gpsMazeCacher.update(cache)

        if "Large" == cache.size:
            self.largeCacher.update(cache)

        if "Letterbox Hybrid" == cache.type:
            self.letterboxer.update(cache)

        if cache.has_leapday_find():
            self.matrixCacher.update(cache)

        if "Mega-Event Cache" == cache.type:
            self.megaSocialCacher.update(cache)

        if "Micro" == cache.size:
            self.microCacher.update(cache)

        
        if "Multi-cache" == cache.type:
            self.multiCacher.update(cache)

        if "Unknown Cache" == cache.type:
            self.mysteriousCacher.update(cache)

        
        if "Other" == cache.size or "Not chosen" == cache.size:
            self.oddSizedCacher.update(cache)


        if "Webcam Cache" == cache.type:
            self.photogenicCacher.update(cache)

        
        if "Regular" == cache.size:
            self.regularCacher.update(cache)

        if "5.0" == cache.terrain:
            self.ruggedCacher.update(cache)

        if "Small" == cache.size:
            self.smallCacher.update(cache)


        if "Event Cache" == cache.type or "Community Celebration Event" == cache.type:
            self.socialCacher.update(cache)

        if "Traditional Cache" == cache.type:
            self.traditionalCacher.update(cache)

        if cache.country is not None:
            self.travelingCacher.update(cache)

        if "Virtual Cache" == cache.type:
            self.virtualCacher.update(cache)

        if "Wherigo Cache" == cache.type:
            self.wherigoCacher.update(cache)

        
        
        



