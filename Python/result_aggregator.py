from collections import defaultdict
import attributes
import html_builder as HTML
import country_flag_unicode as FLAGS


class GenericResults:
    def __init__(self):
        self.calendar = set()
        self.dtGrid = {}
        self.ftf = False

    def update(self, cache, calForFtf = False):
        if cache.isFtf:
            self.ftf = True

        firstFind = min(cache.foundDates)

        if calForFtf:
            # FTF Addict is the only badge that is log specific instead of cache specific.
            # Assume FTF is the earliest dated found log since it obviously should be, and
            # the FTF might be from a bookmark list and not associated with a log at all. 
            self.calendar.add((firstFind[0].month, firstFind[0].day))
        else:
            for date, _ in cache.foundDates:
                self.calendar.add((date.month, date.day))

        dt = (cache.difficulty, cache.terrain)

        if dt not in self.dtGrid or firstFind < self.dtGrid[dt][0]:
            self.dtGrid[dt] = (firstFind, cache.gcCode, cache.name, cache.type)

    def create_html(self, sectionNode, icon, combineCalendar, includeDt, include366, includeLeapday, includeFtf):

        if includeDt:
            HTML.add_dt_info(sectionNode, icon, self.dtGrid, icon[0] == "Leapday")

        if include366:
            if combineCalendar:
                sectionNode.append(HTML.see_combined())
            else:
                HTML.add_basic_calendar(sectionNode, icon, self.calendar)

        if includeLeapday:
            sectionNode.append(HTML.single_find_addon((2,29) in self.calendar, "Leapday"))

        if includeFtf:
            sectionNode.append(HTML.single_find_addon(self.ftf, "FTF"))
        

class AdventurousCacherResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)
        self.boats = 0
        self.fieldPuzzles = 0
        self.climbs = 0

    def update(self, cache):
        GenericResults.update(self, cache)

        if cache.is_boat():
            self.boats += 1

        if cache.is_field_puzzle():
            self.fieldPuzzles += 1

        if cache.is_climb():
            self.climbs += 1

    def create_html(self, sectionNode, combineCalendar):
        GenericResults.create_html(self, sectionNode, HTML.iconAdventurous, combineCalendar, False, True, True, True)

        sectionNode.append(HTML.multi_find_addon(self.boats, 30, "Boat"))

        sectionNode.append(HTML.multi_find_addon(self.fieldPuzzles, 30, "Field puzzle"))

        sectionNode.append(HTML.multi_find_addon(self.climbs, 30, "Climb"))
        

class AttributeCacherResults:
    def __init__(self):
        self.lostAndFound = False
        self.partnership = False
        self.leapdayAttributes = set()

    def update(self, cache):
        if attributes.LOST_AND_FOUND in cache.attributes:
            self.lostAndFound = True

        if attributes.PARTNERSHIP in cache.attributes:
            self.partnership = True

        if cache.has_leapday_find():
            self.leapdayAttributes.update(cache.attributes)

    def create_html(self, sectionNode):
        HTML.add_leapday_attributes(sectionNode, self.leapdayAttributes)

        sectionNode.append(HTML.single_find_addon(self.lostAndFound, "L&F"))

        sectionNode.append(HTML.single_find_addon(self.partnership, "Partnership"))

class BrainiacResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)
        self.fieldPuzzles = 0

    def update(self, cache):
        GenericResults.update(self, cache)

        if cache.is_field_puzzle():
            self.fieldPuzzles += 1

    def create_html(self, sectionNode, combineCalendar):
        GenericResults.create_html(self, sectionNode, HTML.iconBrainiac, combineCalendar, False, True, True, True)

        sectionNode.append(HTML.multi_find_addon(self.fieldPuzzles, 100, "Field puzzle"))

class BusyCacherResults:
    def __init__(self):
        self.leapdayCounts = defaultdict(int)

    def update(self, cache):
        for date, _ in cache.foundDates:
            if date.month == 2 and date.day == 29:
                self.leapdayCounts[date] += 1

    def create_html(self, sectionNode):
        sectionNode.append(HTML.multi_find_addon(max(self.leapdayCounts.values()), 400, "Leapday"))

class DiverseCacherResults:
    def __init__(self):
        self.leapdayTypes = defaultdict(set)

    def update(self, cache):
        for date, _ in cache.foundDates:
            if date.month == 2 and date.day == 29:
                self.leapdayTypes[date].add(cache.type)

    def create_html(self, sectionNode):
        sectionNode.append(HTML.multi_find_addon(max(len(v) for v in self.leapdayTypes.values()), 11, "Leapday"))

class EventHostResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)
        self.mega = False
        self.giga = False
        self.cito = False
        self.community = False
        self.lostAndFound = False

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

        if attributes.LOST_AND_FOUND in cache.attributes:
            self.lostAndFound = True

    def create_html(self, sectionNode, combineCalendar):
        GenericResults.create_html(self, sectionNode, HTML.iconEventHost, combineCalendar, False, True, True, False)

        sectionNode.append(HTML.single_find_addon(self.mega, "Mega"))

        sectionNode.append(HTML.single_find_addon(self.giga, "Giga"))

        sectionNode.append(HTML.single_find_addon(self.cito, "CITO"))

        sectionNode.append(HTML.single_find_addon(self.community, "Community Celebration"))

        sectionNode.append(HTML.single_find_addon(self.lostAndFound, "L&F"))

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

    def create_html(self, sectionNode):
        sectionNode.append(HTML.single_find_addon(self.community, "Community Celebration"))

        sectionNode.append(HTML.single_find_addon(self.ape, "Ape"))

        sectionNode.append(HTML.single_find_addon(self.hq, "HQ"))

        sectionNode.append(HTML.single_find_addon(self.hq_celebration, "HQ Celebration"))

        sectionNode.append(HTML.single_find_addon(self.blockparty, "Blockparty"))

        sectionNode.append(HTML.single_find_addon(self.locationless, "Locationless"))

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

    def create_html(self, sectionNode, combineCalendar):
        GenericResults.create_html(self, sectionNode, HTML.iconRugged, combineCalendar, False, True, True, True)

        sectionNode.append(HTML.multi_find_addon(self.boats, 150, "Boat"))

        sectionNode.append(HTML.multi_find_addon(self.climbs, 150, "Climbing Gear"))

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

        for date, _ in cache.foundDates:
            md = (date.month, date.day)
            if not self.calendar[md]:
                self.calendar[md] = cache.country
            elif self.calendar[md] != cache.country:
                self.calendar[md] = True

    def create_html(self, sectionNode):
        HTML.traveling_grid(sectionNode, self.dtGrid)

        HTML.traveling_calendar(sectionNode, self.calendar)

        HTML.traveling_single(sectionNode, self.calendar[(2,29)], "Leapday")

        HTML.traveling_single(sectionNode, self.ftf, "FTF")

class VirtualCacherResults(GenericResults):
    def __init__(self):
        GenericResults.__init__(self)
        self.oldCaches = 0

    def update(self, cache):
        GenericResults.update(self, cache)

        if cache.is_old_virtual():
            self.oldCaches += 1

    def create_html(self, sectionNode, combineCalendar):
        GenericResults.create_html(self, sectionNode, HTML.iconVirtual, combineCalendar, True, True, True, True)

        sectionNode.append(HTML.multi_find_addon(self.oldCaches, 180, "Old-virtual"))

            
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
            self.ftfAddict.update(cache, True)

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

    def create_html(self, combineCalendar, errors):
        tree, bodyNode = HTML.create_document()

        if len(errors) != 0:
            HTML.error_details(bodyNode, errors)

        if combineCalendar:
            HTML.make_combined_calendar(bodyNode, self)

        achieverNode = HTML.badge_section(bodyNode, "The Achiever")
        self.achiever.create_html(achieverNode, HTML.iconAchiever, combineCalendar, True, True, True, True)

        adventurousNode = HTML.badge_section(bodyNode, "The Adventurous Cacher")
        self.adventurousCacher.create_html(adventurousNode, combineCalendar)

        attributeNode = HTML.badge_section(bodyNode, "The Attribute Cacher")
        self.attributeCacher.create_html(attributeNode)

        brainiacNode = HTML.badge_section(bodyNode, "The Brainiac")
        self.brainiac.create_html(brainiacNode, combineCalendar)

        busyNode = HTML.badge_section(bodyNode, "The Busy Cacher")
        self.busyCacher.create_html(busyNode)

        diverseNode = HTML.badge_section(bodyNode, "The Diverse Cacher")
        self.diverseCacher.create_html(diverseNode)

        earthNode = HTML.badge_section(bodyNode, "The Earth Cacher")
        self.earthCacher.create_html(earthNode, HTML.iconEarth, combineCalendar, True, True, True, True)

        environmentalNode = HTML.badge_section(bodyNode, "The Environmental Cacher")
        self.environmentalCacher.create_html(environmentalNode, HTML.iconEnvironmental, combineCalendar, False, True, True, False)

        eventHostNode = HTML.badge_section(bodyNode, "The Event Host")
        self.eventHost.create_html(eventHostNode, combineCalendar)

        ftfAddictNode = HTML.badge_section(bodyNode, "The FTF Addict")
        self.ftfAddict.create_html(ftfAddictNode, HTML.iconFtf, combineCalendar, True, True, True, False)

        geocacherNode = HTML.badge_section(bodyNode, "The Geocacher")
        self.geocacher.create_html(geocacherNode)

        gigaSocialNode = HTML.badge_section(bodyNode, "The Giga Social Cacher")
        self.gigaSocialCacher.create_html(gigaSocialNode, HTML.iconGiga, combineCalendar, False, True, True, False)

        gpsMazeNode = HTML.badge_section(bodyNode, "The GPS Maze Cacher")
        self.gpsMazeCacher.create_html(gpsMazeNode, HTML.iconMaze, combineCalendar, False, True, True, False)

        largeNode = HTML.badge_section(bodyNode, "The Large Cacher")
        self.largeCacher.create_html(largeNode, HTML.iconLarge, combineCalendar, True, True, True, True)

        letterboxerNode = HTML.badge_section(bodyNode, "The Letterboxer")
        self.letterboxer.create_html(letterboxerNode, HTML.iconLetterbox, combineCalendar, True, True, True, True)

        matrixNode = HTML.badge_section(bodyNode, "The Matrix Cacher")
        self.matrixCacher.create_html(matrixNode, HTML.iconMatrix, combineCalendar, True, False, False, False)

        megaSocialNode = HTML.badge_section(bodyNode, "The Mega Social Cacher")
        self.megaSocialCacher.create_html(megaSocialNode, HTML.iconMega, combineCalendar, False, True, True, False)

        microNode = HTML.badge_section(bodyNode, "The Micro Cacher")
        self.microCacher.create_html(microNode, HTML.iconMicro, combineCalendar, True, True, True, True)

        multiNode = HTML.badge_section(bodyNode, "The Multi Cacher")
        self.multiCacher.create_html(multiNode, HTML.iconMulti, combineCalendar, True, True, True, True)

        mysteriousNode = HTML.badge_section(bodyNode, "The Mysterious Cacher")
        self.mysteriousCacher.create_html(mysteriousNode, HTML.iconMysterious, combineCalendar, True, True, True, True)

        oddSizedNode = HTML.badge_section(bodyNode, "The Odd-sized Cacher")
        self.oddSizedCacher.create_html(oddSizedNode, HTML.iconOddSized, combineCalendar, True, True, True, True)

        photogenicNode = HTML.badge_section(bodyNode, "The Photogenic Cacher")
        self.photogenicCacher.create_html(photogenicNode, HTML.iconWebcam, combineCalendar, False, True, True, True)

        regularNode = HTML.badge_section(bodyNode, "The Regular Cacher")
        self.regularCacher.create_html(regularNode, HTML.iconRegular, combineCalendar, True, True, True, True)

        ruggedNode = HTML.badge_section(bodyNode, "The Rugged Cacher")
        self.ruggedCacher.create_html(ruggedNode, combineCalendar)

        smallNode = HTML.badge_section(bodyNode, "The Small Cacher")
        self.smallCacher.create_html(smallNode, HTML.iconSmall, combineCalendar, True, True, True, True)

        socialNode = HTML.badge_section(bodyNode, "The Social Cacher")
        self.socialCacher.create_html(socialNode, HTML.iconSocial, combineCalendar, False, True, True, False)

        traditionalNode = HTML.badge_section(bodyNode, "The Traditional Cacher")
        self.traditionalCacher.create_html(traditionalNode, HTML.iconTraditional, combineCalendar, True, True, True, True)

        travelingNode = HTML.badge_section(bodyNode, "The Traveling Cacher")
        self.travelingCacher.create_html(travelingNode)

        virtualNode = HTML.badge_section(bodyNode, "The Virtual Cacher")
        self.virtualCacher.create_html(virtualNode, combineCalendar)

        wherigoNode = HTML.badge_section(bodyNode, "The Wherigo Cacher")
        self.wherigoCacher.create_html(wherigoNode, HTML.iconWherigo, combineCalendar, True, True, True, True)

        for country in sorted(self.countries):
            countryNode = HTML.badge_section(bodyNode, country, True)
            self.countries[country].create_html(countryNode, (country, FLAGS.flagsUnicode[country]), False, True, True, True, True)

        return tree



