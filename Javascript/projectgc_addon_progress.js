function namespace_lookup(prefix) {
  switch(prefix) {
    case "TN" : return "http://www.topografix.com/GPX/1/0";
    case "GN" : return "http://www.groundspeak.com/cache/1/0/1";
    default: return null;
  }
}

function log_date_comparator(a, b) {
  if (a[0] != b[0]) {
    return a[0] - b[0];
  }    
  
  if (a[1] != b[1]) {
    return a[1] - b[1];
  }
  
  if (a[2] != b[2]) {
    return a[2] - b[2];
  }
  
  return a[3] - b[3];
}

function log_date_array_min(arr) {
  return arr.reduce(function(a,b) {return log_date_comparator(a,b) < 0 ? a : b});
}

const COLOR_RED = '#EE6677';
const COLOR_GREEN = '#228833';

// Project-GC excluded caches from boomark list BMAFMJR which contains things 
// like prior traveling caches and antipode caches from country statistics.
const countryExcludedCaches = new Set(['GC990D', 'GC3906', 'GCG7ED', 'GC78F3', 'GCWZR3', 'GCA7AD',
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
                                       'GC1E1F', 'GC7628', 'GC7D6E', 'GC3B4D']);


const monthInfo = [["January", 1, 31], ["February", 2, 29], ["March", 3, 31], ["April", 4, 30],
                   ["May", 5, 31], ["June", 6, 30], ["July", 7, 31], ["August", 8, 31],
                   ["September", 9, 30], ["October", 10, 31], ["November", 11, 30], ["December", 12, 31]];

const flagsUnicode = new Map([["Afghanistan","\u{1f1e6}\u{1f1eb}"],["Aland Islands","\u{1f1e6}\u{1f1fd}"],
                              ["Albania","\u{1f1e6}\u{1f1f1}"],["Algeria","\u{1f1e9}\u{1f1ff}"],
                              ["American Samoa","\u{1f1e6}\u{1f1f8}"],["Andorra","\u{1f1e6}\u{1f1e9}"],
                              ["Angola","\u{1f1e6}\u{1f1f4}"],["Anguilla","\u{1f1e6}\u{1f1ee}"],
                              ["Antarctica","\u{1f1e6}\u{1f1f6}"],["Antigua and Barbuda","\u{1f1e6}\u{1f1ec}"],
                              ["Argentina","\u{1f1e6}\u{1f1f7}"],["Armenia","\u{1f1e6}\u{1f1f2}"],
                              ["Aruba","\u{1f1e6}\u{1f1fc}"],["Australia","\u{1f1e6}\u{1f1fa}"],
                              ["Austria","\u{1f1e6}\u{1f1f9}"],["Azerbaijan","\u{1f1e6}\u{1f1ff}"],
                              ["Bahamas","\u{1f1e7}\u{1f1f8}"],["Bahrain","\u{1f1e7}\u{1f1ed}"],
                              ["Bangladesh","\u{1f1e7}\u{1f1e9}"],["Barbados","\u{1f1e7}\u{1f1e7}"],
                              ["Belarus","\u{1f1e7}\u{1f1fe}"],["Belgium","\u{1f1e7}\u{1f1ea}"],
                              ["Belize","\u{1f1e7}\u{1f1ff}"],["Benin","\u{1f1e7}\u{1f1ef}"],
                              ["Bermuda","\u{1f1e7}\u{1f1f2}"],["Bhutan","\u{1f1e7}\u{1f1f9}"],
                              ["Bolivia","\u{1f1e7}\u{1f1f4}"],["Bonaire, Sint Eustatius and Saba","\u{1f1e7}\u{1f1f6}"],
                              ["Bosnia and Herzegovina","\u{1f1e7}\u{1f1e6}"],["Botswana","\u{1f1e7}\u{1f1fc}"],
                              ["Bouvet Island","\u{1f1e7}\u{1f1fb}"],["Brazil","\u{1f1e7}\u{1f1f7}"],
                              ["British Indian Ocean Territory","\u{1f1ee}\u{1f1f4}"],
                              ["British Virgin Islands","\u{1f1fb}\u{1f1ec}"],["Brunei","\u{1f1e7}\u{1f1f3}"],
                              ["Bulgaria","\u{1f1e7}\u{1f1ec}"],["Burkina Faso","\u{1f1e7}\u{1f1eb}"],
                              ["Burundi","\u{1f1e7}\u{1f1ee}"],["Cabo Verde","\u{1f1e8}\u{1f1fb}"],
                              ["Cambodia","\u{1f1f0}\u{1f1ed}"],["Cameroon","\u{1f1e8}\u{1f1f2}"],
                              ["Canada","\u{1f1e8}\u{1f1e6}"],["Cayman Islands","\u{1f1f0}\u{1f1fe}"],
                              ["Central African Republic","\u{1f1e8}\u{1f1eb}"],["Chad","\u{1f1f9}\u{1f1e9}"],
                              ["Chile","\u{1f1e8}\u{1f1f1}"],["China","\u{1f1e8}\u{1f1f3}"],
                              ["Christmas Island","\u{1f1e8}\u{1f1fd}"],["Cocos (Keeling) Islands","\u{1f1e8}\u{1f1e8}"],
                              ["Colombia","\u{1f1e8}\u{1f1f4}"],["Comoros","\u{1f1f0}\u{1f1f2}"],
                              ["Congo","\u{1f1e8}\u{1f1ec}"],["Cook Islands","\u{1f1e8}\u{1f1f0}"],
                              ["Costa Rica","\u{1f1e8}\u{1f1f7}"],["Côte d'Ivoire","\u{1f1e8}\u{1f1ee}"],
                              ["Croatia","\u{1f1ed}\u{1f1f7}"],["Cuba","\u{1f1e8}\u{1f1fa}"],
                              ["Curaçao","\u{1f1e8}\u{1f1fc}"],["Cyprus","\u{1f1e8}\u{1f1fe}"],
                              ["Czechia","\u{1f1e8}\u{1f1ff}"],["Democratic Republic of the Congo","\u{1f1e8}\u{1f1e9}"],
                              ["Denmark","\u{1f1e9}\u{1f1f0}"],["Djibouti","\u{1f1e9}\u{1f1ef}"],
                              ["Dominica","\u{1f1e9}\u{1f1f2}"],["Dominican Republic","\u{1f1e9}\u{1f1f4}"],
                              ["Ecuador","\u{1f1ea}\u{1f1e8}"],["Egypt","\u{1f1ea}\u{1f1ec}"],
                              ["El Salvador","\u{1f1f8}\u{1f1fb}"],["Equatorial Guinea","\u{1f1ec}\u{1f1f6}"],
                              ["Eritrea","\u{1f1ea}\u{1f1f7}"],["Estonia","\u{1f1ea}\u{1f1ea}"],
                              ["Eswatini","\u{1f1f8}\u{1f1ff}"],["Ethiopia","\u{1f1ea}\u{1f1f9}"],
                              ["Falkland Islands","\u{1f1eb}\u{1f1f0}"],["Faroe Islands","\u{1f1eb}\u{1f1f4}"],
                              ["Fiji","\u{1f1eb}\u{1f1ef}"],["Finland","\u{1f1eb}\u{1f1ee}"],
                              ["France","\u{1f1eb}\u{1f1f7}"],["French Guiana","\u{1f1ec}\u{1f1eb}"],
                              ["French Polynesia","\u{1f1f5}\u{1f1eb}"],
                              ["French Southern and Antarctic Territories","\u{1f1f9}\u{1f1eb}"],
                              ["Gabon","\u{1f1ec}\u{1f1e6}"],["Gambia","\u{1f1ec}\u{1f1f2}"],
                              ["Georgia","\u{1f1ec}\u{1f1ea}"],["Germany","\u{1f1e9}\u{1f1ea}"],
                              ["Ghana","\u{1f1ec}\u{1f1ed}"],["Gibraltar","\u{1f1ec}\u{1f1ee}"],
                              ["Greece","\u{1f1ec}\u{1f1f7}"],["Greenland","\u{1f1ec}\u{1f1f1}"],
                              ["Grenada","\u{1f1ec}\u{1f1e9}"],["Guadeloupe","\u{1f1ec}\u{1f1f5}"],
                              ["Guam","\u{1f1ec}\u{1f1fa}"],["Guatemala","\u{1f1ec}\u{1f1f9}"],
                              ["Guernsey","\u{1f1ec}\u{1f1ec}"],["Guinea","\u{1f1ec}\u{1f1f3}"],
                              ["Guinea-Bissau","\u{1f1ec}\u{1f1fc}"],["Guyana","\u{1f1ec}\u{1f1fe}"],
                              ["Haiti","\u{1f1ed}\u{1f1f9}"],["Heard Island and McDonald Islands","\u{1f1ed}\u{1f1f2}"],
                              ["Honduras","\u{1f1ed}\u{1f1f3}"],["Hong Kong","\u{1f1ed}\u{1f1f0}"],
                              ["Hungary","\u{1f1ed}\u{1f1fa}"],["Iceland","\u{1f1ee}\u{1f1f8}"],
                              ["India","\u{1f1ee}\u{1f1f3}"],["Indonesia","\u{1f1ee}\u{1f1e9}"],
                              ["Iran","\u{1f1ee}\u{1f1f7}"],["Iraq","\u{1f1ee}\u{1f1f6}"],
                              ["Ireland","\u{1f1ee}\u{1f1ea}"],["Isle of Man","\u{1f1ee}\u{1f1f2}"],
                              ["Israel","\u{1f1ee}\u{1f1f1}"],["Italy","\u{1f1ee}\u{1f1f9}"],
                              ["Jamaica","\u{1f1ef}\u{1f1f2}"],["Japan","\u{1f1ef}\u{1f1f5}"],
                              ["Jersey","\u{1f1ef}\u{1f1ea}"],["Jordan","\u{1f1ef}\u{1f1f4}"],
                              ["Kazakhstan","\u{1f1f0}\u{1f1ff}"],["Kenya","\u{1f1f0}\u{1f1ea}"],
                              ["Kiribati","\u{1f1f0}\u{1f1ee}"],["Kuwait","\u{1f1f0}\u{1f1fc}"],
                              ["Kyrgyzstan","\u{1f1f0}\u{1f1ec}"],["Laos","\u{1f1f1}\u{1f1e6}"],
                              ["Latvia","\u{1f1f1}\u{1f1fb}"],["Lebanon","\u{1f1f1}\u{1f1e7}"],
                              ["Lesotho","\u{1f1f1}\u{1f1f8}"],["Liberia","\u{1f1f1}\u{1f1f7}"],
                              ["Libya","\u{1f1f1}\u{1f1fe}"],["Liechtenstein","\u{1f1f1}\u{1f1ee}"],
                              ["Lithuania","\u{1f1f1}\u{1f1f9}"],["Luxembourg","\u{1f1f1}\u{1f1fa}"],
                              ["Macao","\u{1f1f2}\u{1f1f4}"],["Madagascar","\u{1f1f2}\u{1f1ec}"],
                              ["Malawi","\u{1f1f2}\u{1f1fc}"],["Malaysia","\u{1f1f2}\u{1f1fe}"],
                              ["Maldives","\u{1f1f2}\u{1f1fb}"],["Mali","\u{1f1f2}\u{1f1f1}"],
                              ["Malta","\u{1f1f2}\u{1f1f9}"],["Marshall Islands","\u{1f1f2}\u{1f1ed}"],
                              ["Martinique","\u{1f1f2}\u{1f1f6}"],["Mauritania","\u{1f1f2}\u{1f1f7}"],
                              ["Mauritius","\u{1f1f2}\u{1f1fa}"],["Mayotte","\u{1f1fe}\u{1f1f9}"],
                              ["Mexico","\u{1f1f2}\u{1f1fd}"],["Micronesia","\u{1f1eb}\u{1f1f2}"],
                              ["Moldova","\u{1f1f2}\u{1f1e9}"],["Monaco","\u{1f1f2}\u{1f1e8}"],
                              ["Mongolia","\u{1f1f2}\u{1f1f3}"],["Montenegro","\u{1f1f2}\u{1f1ea}"],
                              ["Montserrat","\u{1f1f2}\u{1f1f8}"],["Morocco","\u{1f1f2}\u{1f1e6}"],
                              ["Mozambique","\u{1f1f2}\u{1f1ff}"],["Myanmar","\u{1f1f2}\u{1f1f2}"],
                              ["Namibia","\u{1f1f3}\u{1f1e6}"],["Nauru","\u{1f1f3}\u{1f1f7}"],
                              ["Nepal","\u{1f1f3}\u{1f1f5}"],["Netherlands","\u{1f1f3}\u{1f1f1}"],
                              ["New Caledonia","\u{1f1f3}\u{1f1e8}"],["New Zealand","\u{1f1f3}\u{1f1ff}"],
                              ["Nicaragua","\u{1f1f3}\u{1f1ee}"],["Niger","\u{1f1f3}\u{1f1ea}"],
                              ["Nigeria","\u{1f1f3}\u{1f1ec}"],["Niue","\u{1f1f3}\u{1f1fa}"],
                              ["Norfolk Island","\u{1f1f3}\u{1f1eb}"],["North Korea","\u{1f1f0}\u{1f1f5}"],
                              ["North Macedonia","\u{1f1f2}\u{1f1f0}"],["Northern Mariana Islands","\u{1f1f2}\u{1f1f5}"],
                              ["Norway","\u{1f1f3}\u{1f1f4}"],["Oman","\u{1f1f4}\u{1f1f2}"],
                              ["Pakistan","\u{1f1f5}\u{1f1f0}"],["Palau","\u{1f1f5}\u{1f1fc}"],
                              ["Palestine","\u{1f1f5}\u{1f1f8}"],["Panama","\u{1f1f5}\u{1f1e6}"],
                              ["Papua New Guinea","\u{1f1f5}\u{1f1ec}"],["Paraguay","\u{1f1f5}\u{1f1fe}"],
                              ["Peru","\u{1f1f5}\u{1f1ea}"],["Philippines","\u{1f1f5}\u{1f1ed}"],
                              ["Pitcairn","\u{1f1f5}\u{1f1f3}"],["Poland","\u{1f1f5}\u{1f1f1}"],
                              ["Portugal","\u{1f1f5}\u{1f1f9}"],["Puerto Rico","\u{1f1f5}\u{1f1f7}"],
                              ["Qatar","\u{1f1f6}\u{1f1e6}"],["Réunion","\u{1f1f7}\u{1f1ea}"],
                              ["Romania","\u{1f1f7}\u{1f1f4}"],["Russia","\u{1f1f7}\u{1f1fa}"],
                              ["Rwanda","\u{1f1f7}\u{1f1fc}"],["Saint Barthélemy","\u{1f1e7}\u{1f1f1}"],
                              ["Saint Helena","\u{1f1f8}\u{1f1ed}"],["Saint Kitts and Nevis","\u{1f1f0}\u{1f1f3}"],
                              ["Saint Lucia","\u{1f1f1}\u{1f1e8}"],["Saint Martin","\u{1f1f2}\u{1f1eb}"],
                              ["Saint Pierre and Miquelon","\u{1f1f5}\u{1f1f2}"],
                              ["Saint Vincent and the Grenadines","\u{1f1fb}\u{1f1e8}"],["Samoa","\u{1f1fc}\u{1f1f8}"],
                              ["San Marino","\u{1f1f8}\u{1f1f2}"],["Sao Tome and Principe","\u{1f1f8}\u{1f1f9}"],
                              ["Sark","\u{1f1ec}\u{1f1ec}"],["Saudi Arabia","\u{1f1f8}\u{1f1e6}"],
                              ["Senegal","\u{1f1f8}\u{1f1f3}"],["Serbia","\u{1f1f7}\u{1f1f8}"],
                              ["Seychelles","\u{1f1f8}\u{1f1e8}"],["Sierra Leone","\u{1f1f8}\u{1f1f1}"],
                              ["Singapore","\u{1f1f8}\u{1f1ec}"],["Sint Maarten","\u{1f1f8}\u{1f1fd}"],
                              ["Slovakia","\u{1f1f8}\u{1f1f0}"],["Slovenia","\u{1f1f8}\u{1f1ee}"],
                              ["Solomon Islands","\u{1f1f8}\u{1f1e7}"],["Somalia","\u{1f1f8}\u{1f1f4}"],
                              ["South Africa","\u{1f1ff}\u{1f1e6}"],
                              ["South Georgia and the South Sandwich Islands","\u{1f1ec}\u{1f1f8}"],
                              ["South Korea","\u{1f1f0}\u{1f1f7}"],["South Sudan","\u{1f1f8}\u{1f1f8}"],
                              ["Spain","\u{1f1ea}\u{1f1f8}"],["Sri Lanka","\u{1f1f1}\u{1f1f0}"],
                              ["Sudan","\u{1f1f8}\u{1f1e9}"],["Suriname","\u{1f1f8}\u{1f1f7}"],
                              ["Svalbard and Jan Mayen Islands","\u{1f1f8}\u{1f1ef}"],["Sweden","\u{1f1f8}\u{1f1ea}"],
                              ["Switzerland","\u{1f1e8}\u{1f1ed}"],["Syria","\u{1f1f8}\u{1f1fe}"],
                              ["Taiwan","\u{1f1f9}\u{1f1fc}"],["Tajikistan","\u{1f1f9}\u{1f1ef}"],
                              ["Tanzania","\u{1f1f9}\u{1f1ff}"],["Thailand","\u{1f1f9}\u{1f1ed}"],
                              ["Timor-Leste","\u{1f1f9}\u{1f1f1}"],["Togo","\u{1f1f9}\u{1f1ec}"],
                              ["Tokelau","\u{1f1f9}\u{1f1f0}"],["Tonga","\u{1f1f9}\u{1f1f4}"],
                              ["Trinidad and Tobago","\u{1f1f9}\u{1f1f9}"],["Tunisia","\u{1f1f9}\u{1f1f3}"],
                              ["Türkiye","\u{1f1f9}\u{1f1f7}"],["Turkmenistan","\u{1f1f9}\u{1f1f2}"],
                              ["Turks and Caicos Islands","\u{1f1f9}\u{1f1e8}"],["Tuvalu","\u{1f1f9}\u{1f1fb}"],
                              ["Uganda","\u{1f1fa}\u{1f1ec}"],["Ukraine","\u{1f1fa}\u{1f1e6}"],
                              ["United Arab Emirates","\u{1f1e6}\u{1f1ea}"],["United Kingdom","\u{1f1ec}\u{1f1e7}"],
                              ["United States","\u{1f1fa}\u{1f1f8}"],["Uruguay","\u{1f1fa}\u{1f1fe}"],
                              ["US Minor Outlying Islands","\u{1f1fa}\u{1f1f2}"],["US Virgin Islands","\u{1f1fb}\u{1f1ee}"],
                              ["Uzbekistan","\u{1f1fa}\u{1f1ff}"],["Vanuatu","\u{1f1fb}\u{1f1fa}"],
                              ["Vatican City State","\u{1f1fb}\u{1f1e6}"],["Venezuela","\u{1f1fb}\u{1f1ea}"],
                              ["Vietnam","\u{1f1fb}\u{1f1f3}"],["Wallis and Futuna Islands","\u{1f1fc}\u{1f1eb}"],
                              ["Western Sahara","\u{1f1ea}\u{1f1ed}"],["Yemen","\u{1f1fe}\u{1f1ea}"],
                              ["Zambia","\u{1f1ff}\u{1f1f2}"],["Zimbabwe","\u{1f1ff}\u{1f1fc}"]]);

const knownTypes = new Set(["Cache In Trash Out Event", "Community Celebration Event",
                            "Earthcache", "Event Cache", "Groundspeak HQ",
                             "Geocaching HQ Block Party", "Geocaching HQ Celebration",
                             "Giga-Event Cache", "GPS Adventures Exhibit",
                             "Letterbox Hybrid", "Locationless (Reverse) Cache",
                             "Mega-Event Cache", "Multi-cache", "Project APE Cache",
                             "Traditional Cache", "Unknown Cache", "Virtual Cache",
                             "Webcam Cache", "Wherigo Cache"]);
                             
const eventTypes = new Set(["Cache In Trash Out Event", "Community Celebration Event",
                            "Event Cache", "Geocaching HQ Block Party",
                            "Geocaching HQ Celebration", "Giga-Event Cache", 
                            "Mega-Event Cache"]);
                            
const knownDts = new Set(["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"]);

const knownSizes = new Set(["Large", "Micro", "Not chosen", "Other", "Regular", "Small", "Virtual"]);

const knownAttributes = new Set([-66, -65, -64, -63, -62, -59, -58, -57, -56, -55, -54,
                                 -53, -52, -47, -46, -41, -40, -38, -37, -36, -35, -34,
                                 -33, -32, -31, -30, -29, -28, -27, -25, -24, -17, -15,
                                 -14, -13, -10, -9, -8, -7, -6, -1, 1, 2, 3, 4, 5, 6,
                                 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                                 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
                                 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
                                 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                                 60, 61, 62, 63, 64, 65, 66, 67, 69, 70, 71, 72]);
                                 
const ATTRIBUTE_CHALLENGE = 71;

const ATTRIBUTE_BOAT = 4;
const ATTRIBUTE_CLIMB = 3;
const ATTRIBUTE_FIELD_PUZZLE = 47;

const ATTRIBUTE_CACTUS = 16;
const ATTRIBUTE_LOST_AND_FOUND = 45;
const ATTRIBUTE_NEEDS_MAINTENANCE = 42;
const ATTRIBUTE_PARTNERSHIP = 61;

const iconAchiever = ["Challenge Cache", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAABhmlDQ1BJQ0MgcHJvZmlsZQAAKM+VkT1Iw1AUhU9TRZGKoh1EHDJUp3ZREcGlRLEIFkpboVUHk5f+QZOGJMXFUXAtOPizWHVwcdbVwVUQBH9AnB2cFF2kxPuSQotQwQuP93HeO4f77gOEeplpVlcU0HTbTMYkMZNdFXte4cMghhDGnMwsI55aTKNjfd3Tbaq7CM/C/6pfzVkM8InEUWaYNvEG8cymbXDeJw6yoqwSnxOHTWqQ+JHrisdvnAsuCzwzaKaT88RBYrHQxkobs6KpEU8Th1RNp3wh47HKeYuzVq6yZp/8hYGcvpLiOq0xxLCEOBIQoaCKEsqwEaFdJ8VCks6lDv5R158gl0KuEhg5FlCBBtn1g//B79la+alJLykgAd0vjvMxDvTsAo2a43wfO07jBPA/A1d6y1+pA7OfpNdaWugIGNgGLq5bmrIHXO4AI0+GbMqu5Kcl5PPA+xl9UxYYvgX61ry5Nc9x+gCkaVbLN8DBITBRoOz1Du/ubZ/bn3fc+UH6ARY1cuhaWfayAAAACXBIWXMAAA3UAAAN1AHvkboVAAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6AEQEi0X5+HlVgAADQVJREFUeF7Nmwl0VNUZx7+3TWYmK1lIQoQQgk20gCCKsmq1i9QNKYuK1aNURY8ibqcqVuqCFRFEezgWrAuKFSmgqMjSolJFRA4QFYGABEK2Cdknk2T21//33iROwmSYmSTj/M658967973Ju//73e9+996JQOFzMdJM/TRmeQ/pa/207/geSY3xxO8YFpFYxN5kszTq+OtjInm2z8mbvcfb1OL+Dqej9JzQiKQyX8YbxbG2deNF33VMkTjtK6/N7tmN03F6TmhEUplWtyciAaOC28M9g9q0izCIRIgWj1f7YzGJR1W5kaIihM0bw0J4vdqhVfsMg0iEaFbV2O0aXrwcaNEuwiASIayxaw8YO/VGsulXoROJEE38YW31aBcxSlQsopY/qhud2kUs4dc4Db5jyEQiRA1/VNXHnhA11o53avQdQyYSISz8Ud3o0i5iiZpGt++M6nzHkOnO+7NAY5HGIGVyhh/JSHOW35VPd185QM+JETZ9U09XPfUDn65BKuUTP6qQOOLkdJq/DyTEDEUWXnK51awBqQbHWRlxapwkdDzIw/TOg1bTk7Ny6YkbBumZMcJbn1bTLUuPUH62yWVWRD2i8FFjc5Gl3hmHulWgbnORtUEv0ZF8x3bmCAK9ce/VOQnvPFwozLs2R040ybIoCkpKgqxkJCtKf6S9P9rovLwEumJ0P99jscFn3zXR1n0NdNWFqVJetlEemBEnD840ypMv6Cej4WTUh9xeStxztHkGbq9A2qc9CPwtIlMShbJFtw5W+IFHV51Ql22s8MKI7IIkFLlc3iqM0Zpl4KFpN13WX3jrgQLtwVjhr++cpCffLSWjLHyES7YIAZFmP3T0c2EFaTdd2t/z6n1nS8s2VtL8t044MVXIwT3aKOjvLKcmmiV17tU59NS/TtKLH1Q48PCfXB411en0ToAI03EPKzkDSrjrmzscU8zQBv8N6yW7W70GaQrStU6vOsnpVtPRgpPXfFFjm7eyxHv/lBzCDJqNYKr+ZGchCs/Li9dOFm8o92AW9yBO30QKNE62nYqxOEI3VYkUSegu0tuCRr37n9ss5EL/GJEXz48U6kWdhdDC9BOn7NTm9LLv+EzPPh3c11wXYxZR1yKQze4hWRKCjes70cBiicWOaap23eFQ/YWoOFrZphoNHVlm3zEQDU0tbq0RYgGHW6AGGycXN1KwKbhm8uY4iY5W2/n9K/ma8RdiN6LFODhMSo6XWVVepO2Oiua22JhrcG0smP1ox3oHe/JgwdTYeKPkklDr6gZnHK45ptDoJATG2Ka1X9TQdWPTJIMi3OzLD0QxHJAQC8sSdbAEtgimss5OTof3pHYRANRv1m9H9RPXf1XL5zwf+UYv6SyE0+1WV6/YbHHOmZwtOl0qR5XdrfsV8ccPpWGvf/QqbS50h9afIoCKOge5VfWI77IrBRgFL737ymxp5RaLE+dvI6/Dn/gLwea1vLiiValrdtHlw1PcBlFYjGz/WKOd//HHp9+GPbfpNeD4qapRYJ+gUY93trVpDrwjSPJHFoSFwwaZXRgICL5QQdYreolOJyHAIYmEDxa8Xep88c4hMr6W/cQNelEnjiEC9ew48PMIwZVnEViMdorLbe0t9rF+6MTFsJSpS28fYliwutSFOr6PvMN6kU5XIdi0FuwtsckHy1rpvmsGCBiXlyM7Sy/tRO33J36erlGLoZK7hT/FZS1kNkosDU+u/DFgSH3z96NTPfU2NxUdt0lcR19ZB6cJAXiX6B+IwFyPzRgo5PY3xsOxrEJep7+MVjlYekobgqJKMwbHBgjRlQMnmrkyWrjchcfjFDH/xTuGyFwn3LMCeQf0op8IJARX8vE6q6tl0bpyde0jhQquf43s+/TSDtYhUhN2Fzf7LvueFodAluaAr0y7DjeSzeH53HfZziREA/NfvjNffv0/FkKdWj2om6+sE4G/FaKjkrOXvF9OTa0eWnRrHofwLyD/Ir1Y4w0kdeWWrpbYN9idAlU1/eQc/fmxspVqm5xcxpbbTia69brp4zPUX+SYaPH6chV1ugv59XpxZ7oTgtmA4GrdrBeKnbN/k0mTR6eqsizwHD5bL6Y2GGjlh7vr/VxW3+CA166ACN3FLdv21ZBBETnC26znUAJGvM15mcYUdAlp5qLDTrTkOuS/qxefTjAhePvszpomZ92Nzxe7336oQB6aZcowSMI2FCVyOd7r9VqrS9xzJOzV85BxsgiNInmCyL3+Cws5Xd4dOGWpePFlY0qiPGzL08OU2cuOuLkOXBft5m4IKgRoQOBx5db9De6//btM/e/C4UpaslIAMTiOSEN6Fsn75zdL+N5ex4Fwp6xBRIP4MgKwG76hvBaTKCIeCRIVUdhqNoiTtj87XHnlkyp1W1Gjm+uAsqAr22cSgtnv8ao3vbChnFZ/doq+XjJSGZAedy6GJI7ThyBt/vy7JjpU3rtDaStm+WVnsATm+bXHCP6Lw+pTeKev05OVcbuWjJQ37Wkgfmd+d5Tt124OQihCMOvhiG57dNVxddX2atq9ZKRhbEFSLnzIXpSxdXiuX3S414bSJnifCliCbx+zW7YX1dGBUhv7jo8gQtGFQxPO3rNslLJ+Zy3xu+KdZ+O29frdwem6ZhkMnl+U7DhgvfpktUNd80ihjJmcvPOg9TK8b7OlwWnimeslw3iROzJYyVNWTB8DxAld4VHi5sXfksejOuAoxzxx/SDD3+8aKs195Zhn+SdVvLZyK27zH0WCcua/eDrjMSxtzEw1JL4292xD4VlmWvjeSfXVrRbtu+BH6LIRKdqN4WBHpGjByOAMYXbvRGw9/Zl9CKtb6PbfZavzZw4UitE1Z7981IUGscInTMFtX+p3h0YkQjDpMMVl8MQ3jitIcj/4hxxl2GAzjbx3PzkwqVn9UCHdcEmG79bg8JBYDwvgWWSgGKErLXYPzXquiI5UtNDHC34JAb20ZH2568tDVhnv9C7eaR5u03bjwiFSIdq5ELHFfK9HvUqRRTo3x+w5VNlqsEOMWy7PpBX3DMVY1r0bYl/A6wn+k6dg/AB/cMdL31MDZpoFOSZXicUusnWIkrDJ7VafwS179DvDp6dCtMMbHFcgjUZiU+DhKs0cJ6qPzRgk8KoxzpGlWwAL0AgLcIW4yFWB4XHphuO0afcp9iO8083rqUeR2FlzEBUwWgyH3hIiEJOR2FllwGTVK0an0ZRxmcKYwn6wkuA+GuZNR2H635Y005odleqhkzbM+qkVIvwFxUv1u3qXvhSinYmI9J4SSJgAM+ZdM8pJi6OsfnGUnKBQolEiSYKFYIrMiyv1zU4tQGIxeM0DfoN/KvgcEofIIXai8ImGEP6chT9Ymp1qEIcOMGmOj/2JJImUlxVPSWaZUiDOyk9OIqr0rsb9f9Qf63uiLQS3snva+HRp7SPn+HJ0v3GsRuwYNSY8sIswP+CfEV+v5/Q9oUaWvQcs3oARxh/0FjLxKqIP3ncA2sQuWkRdCDS64LeJ1EGi0WcOIMEk8yFJu4gS0RaCayj0T/Zrfh8JcZpz1EhPUthKuv5ApU+JthB5/JHb36hd+MO7T+3dIzfTxA60fQEoKkRbiPP5Y1hu4G3VZJPePfKytHJ9az5KRFuIX/HH2HMCd3/uHrKoUn62mbfuuaNowkWDaAtxEabuKo8SgWAfkRav0sj8pPY5Ci+2RoVoCiGiosMvLkjsRgadJBNGEJNAYwpSKMWsXOfL7nOiKcQ8BEzSA9fxz5a6h61iQLJK0yZmkdXu5nXRa/SSviVo60QAL08FEnccKvhBRpIiHV5xQUh/0+4WacLD++m4pdUOASch60e9pBMOpJ93Sz4ADyOx2++1BF+iHRV4UESbWjIZ9ISgTDXFSTyRNyD1mN60CN5mn/PYjIH6VQ8QRZEkWUZs0f10vbS6jV7bWsan3Nc6fgIUKb0qBL5sjvfjib7L8Gl18pKdvsd5JopKrDRzobZKz7O3Tlv8kdBTZ8nL5bxGwCY8JxJZeebJq1Un6kQqbxBCEoEx+pYAE03yIUzfuavwr0QiNsdwlvMDcQ9e+/xZl/anEYPjafrEdJoU4nI+r1bzgm1Vk0g2VP5MGzldSY5XKCVBplFDkyl/gJm+KcYXEW1H4iW8sImgDTuxThKFqe4PJ4T0PbzeYIOf5zVL7ga9Ra3VSePv38WntyHxLn3Y9LRrJPKmzpngjdxam0AltaJmAb0pAoPu0d6iufohfHoqRFa8MfBX8HYdt3wZ+j33f967CNf8Q4XD8dQkbRQdrmVEQI+EQJCUmZ6kdDQve0zu71VWkY6h9autArX1cut3B0/UQMdvq8OlR28JIdwXDE2Unr45n0xGhWSM/W2OwM3OC7McPvcVy94/Tu/tqHK4Perpix0h0JNX4yYI+98K+xg2yoisvKdtNAKJJ0aM1XcMFRZSW5zsBu70mIuGDM85+L9ytH/qCg+i/wOH+xTslOzdUQAAAABJRU5ErkJggg=="];

iconAdventurous = ["5.0/5.0 Cache", "data:img/png;base64,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"];

iconBrainiac = ["Difficulty 5.0 Cache", "data:img/png;base64,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"];

iconEarth = ["Earthcache", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAYAAAA4E5OyAAABgmlDQ1BJQ0MgcHJvZmlsZQAAKM+VkTtIA0EURY9RUUQRMYWIxYKfShsVsZQoBsGAxAiJWri7MTGQXcNugo2lYBuw8NP4K2ystbWwFQTBD4i1hZWijcj6ZiMkCBF8MHC4M/cycwcCB1nTcuvGwLLzTjQc0uKJea3hmRragAG6ddPNRWYnY1Sdj1s5LXMzoLL437Qkl10TajThMTPn5IWXhEfW8jnFO8JBc0VPCp8K9ztyQeF7pRslflGc9jmgMoNOLDouHBTW0hVsVLC54ljCw8I9ScuW/EC8xEnF64qtbMH8uad6YfOyPTerdFldhJkiwgwaBgUyZMlLXxlsUVyish+q4u/0/TPiMsSVwRTHBKtY6L4f9Qe/u3VTQ4OlpOYQ1D953lsvNGzBV9HzPg897+sIah/hwi77Vw9g9F30Ylnr2YfWDTi7LGvGNpxvQsdDTnd0X6qVFUil4PVEvikB7dfQtFDq7Wef4zuISVfTV7C7B31pyV6s8u7Gyt7+POP3R+gbsl5ywIKF3IkAAAAJcEhZcwAADdUAAA3VAT3WWPEAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfoAREALTGS8nDQAAATg0lEQVR4Xs2cCXgUVbbHT9Wt6jV7yEIIIZANEiSENWZw2GRRBBxFEcHdp4w+Fd/43GfQz+c47zkzuIwrzoiI+PCNMjiuUREURZQdgpCQsMQkLNnTW3Vt79zqm6VJd9KddHB+39df1b2306n617nnnnPv7Sbw82OzA8Sb8ej1lWXf4eeBY8eBhlgFYTyvaRcBx40SBGE0x3E5sizHY5vfNWC9ju2Nuq6XK4pyEHT9kE7IVy5Z3ovNmu9dA8dACmKx8/zlhJAlwPMzVEWJih+UpEyacTFXMHESScvKAWt0DAgWK8S7W0GUPeBoawOr0AAC74SKo7Wwa+ch5eNPt3MtLW2ECEKrqqqfcbq+3qGqH+LnS75/E1kiLkg0QJ5GyL08IddiMWrB9TdqU+b/iiQOzwY3L4Lue1sHiVYTzBsxGEBX0DoEcDd+C1LzLtaKcATcXhv8WN4Aa9/6Qnv33c94Kg5a1xso0CpU5Rh7Z0SImCB2URzNc9xvdU27Kq+oUL3pgZXCoFFjwHOuAudwyfBUSLaZwYMiWOLGdxfkHFSww/d7zsLDj76qVFZWo8Ho6zhFebINoIK9pV/w7Ngf7HZC/oBXti97YsGV0x6Yx+VeWyxEjexdjLQoqyGG7KwE1VPLanuGgBMuLLLBlo/uE7ZteZ6MG5e/FETxRxshzyahRbK39Zl+CWIlZH6s2VwZn5b0mzmPLuJbMqvJgaqtkJKSx97RMwWJ2MEQT/MPxjEcdOxiGaleeP9/lwv/3PgHkhgffadssfyID2cGe0uf6KsgIj6RP+Ifb5pz5+Lk+EuihZ1HPgFVU4zG+Lh049gT8RaTYSGKuxpU6SyrDR8qTOEoEfbueJosv+2KNBylPrPx/Eps6tO9hf1HaJODYkymr2wxUffOeHght6Pufa61zf+GLBbfk++J3HifdUutB41jf+HBDQ/cU8x/8sH/8FaLeSVeY2kCQAxrDpmwBLECpBOL5duM0TkTsm/I4/cf3cxa/FG1nmMrdL4wPNYOuuYFxXWc1UaGghwB9u96gcsYmjJVNZu/xqAvmTWFRMiCYCQ5wmQ2f5dbMmYEP1EW6k6Xs5butJ1jMecyBLuKmfCGM6UmH2lsJgdsKV0pjBmTXYAPcDt9kKypV0IShKpssVo3F1584WBH5hnS0nqGtQSm/OjX7Cwww2JsxtHrOGIcu0LqPwbbqfVgafgYRMdB4FQnawkPAi7YtGEFmTR+1DB8kJ/FAsSxph7pVRA6lAlmc+nwwtz0+tSTvMvdzFqCc6DsE5Ax8gwEDXyGRFlAU13oUH/yVXaBdx8DU8t3YEFh7DWvQmzlIxB18nms244eNLw0h9PdsGHtr0lW1pBsMJs/wCqLryU4vQriMZn+mpCeWkDG68TpamS1PSNJDjhxcjcr+TMI4w6LQFCMk1jqDFR4dxBfomsguCvQat5GcVaCuelLrFNZY+/w4IGP/vGIEBNtK8bgcRWrDkqPguDwdauua1cPX5Qt1DfSGwidxqZqduZPmt33kBR3jXE0wJsW0SJ6g1MdYD2zEWKOP4UihR6xm4kTSj/6PQFNW4751RJWHZCgguDAmYNZ518ueXAJVJ4MHkoHQ1EC514p7YJ4OgURPJXAeZkj5tEF9gLvPQNR1c+in/kES72Ew4zURBme/fMKnYjiqz052aCCcCbTixfMLBZ2VvX+5AJhMvkcZ1focJtkNYOmtIEmt7BajPLa9rEzFOeC1QCznaCO2wRK2lLQhSChBFqVpf4jsNetCbkLLZqfxU0Yl2cVeug6AQWJIuRKTdcu5kapRGPRZ7gkJmSws07izCKm9px/d0FE52F8Al3yTGIDkrIAhMJ1ANOrQcm4E9sF1uiP2LoHne9rKErv10mH+NUv3oH3pC3CSHsuq/YjkCCCYDKtmnv3Yr26roxVhQcRMCwfnM9KndBUn6KiybdDh1Ueu4seXchq/OHQQoSCv4A2eStolsCWLjrL0FLexLPeu09CjBfuvecazSSKf8Zit2y/myDodK7B8WpohXN3n6cGSiYuw1Gue+KZgPkLRfU2GEeKzznqwCXP81UEgY8vAW7KflCjL2A1/ohte9CnfMpKPXPX8mm8qiqj0Eq6/dNzBeGwfz0y/faFenNLHasKj2EZ42DGtDtYyZ947DKUroIQFETnzECSLmE1weHEeOCLvwI1qrv1UaiTFVxHWSk4JuKGFXcv1kyC8Bir6sBPEEydp6uqOrJGKe+TdaSl5sOSRauA5wP392iTaARkuupmNXSEOQaaLROvBJODEOCEOBRlW+Dug46WRrmhBHC33zKNlxVlvFUQJrAqAz9BMHW+YdzCqerpev8xHp0K/LLkFrj5ur/BTcteg5LJ10FUVCJr9VE4eh7cuGw1WK0YJAeAoNO0ihgKdLEOCsHhV7fnslJoUEuBsRtA530W1xVergdL4xesFBy72Q3Tpo5VOF1fxqoMulqCLdpkOjvjwQW2vRWfsyofM6ffZQjSFQzYoLbuEJw6fQSSk7JhaHpgp9gOHWEWZqeBF9N9Vz1GmwinOSG24iFQRjwEQt7vjbpwUMofBaHySVbqROct0DriMdBxtOqJnQecsGjxY40tkpSCRWOY6rAQKyGz0EJs5T/tZDWd5GVdxM464TgehqSNhvFFV/YqBiXK5OtGNAZph/fWG0cuZpxxDBch53HsOt2Hd07zgLn5K1YKTtHoBEAXkYCuYgqr6hQETWX6mLklyrnJG0F/kJA4jJX6TnSHIK3GkULQvClc1EjjGDYcdsEcOjnWHVMzTQZ7XsYhnAQTxuVSy5jmq+kiCI7Ls5NHp3bzhinJuSAKoTm8nogSA1kI+hP0Lbw9h9WEj5B+M6hWdMrnwCtNRkrQG0uXziGYosxiRZ8g6B6jFUUZ6dS6p/ZjxvQcH4SKhfhWTTXFYRwp1AHqOGqEOsIEQ0+5gp35I7YdYmfBKZ6YxWHkOhFPjSdmCOIShDxd17maev+ljZjoZJgw9kpW6h9mwWeMXYdcDruPJviPVn2BH4ZxT9fQnyG4g8/qtZOUaMIkWBMxmR1Oy8ZV8pqWZ4mx620OX59uZ+6s+0AUe51TCQlqITrGB12nDDkNxRHDngfuBm/LAk3sPnVKJBpc9pz4mQUvCIQHlRBj7cQQBDOA7MyikX5/WVS4EApGzWal/kPnUHXVf0qAjgY66ffakoGGonQDxefl3ia1NMjJSVcxHjEcmc+OOS4hbnBCh81lDS+G+Zc8ykqRgXYZHQXoCqdiOVh6HyZ8/rOg5DwBStoyUOOKQTOlYS1B59rpxIORkZGqUQ3ouSEIKhFltlsMQcZeMB+WXv0cENI9CuwPIk8F8Q+pjS4TFdoqXzC0xq9Ba90HfMxYELIxUCt8E8iF24GfWQMwxwW27AfBnnoZWBN+AabofBAsg3G09p+ESk6K47CXGItJhgiY9W245jd3XZUzaw43ePAoWhVRaNi+LD/DmFR21G30Veo6RJ9aC6TkO7yKbqN9UDRXJegNX4JeXwp841Zj9swAP0Mzp4JmxZjJmg166uXAx10IPIb5HO/Lsruio3WqchNo+Lr11vvU994tfcOpqrd0CHLLg7+9avySGzu6TSQxof9YMnKoMbHsqNtk1PHo16OTMcMVokDbMQMzXrxoy1B8YRStMXdmmDs6Ycx3OPcJ4KVaw+8EhwPFngeehJmg2Dotj8cQnjdhpoziEBGTQzGBHWl35WDmlCnKju++o4Lc2t5lHI6WpgHbnUMthKKzqT76xOwpC4Azp4C661dAWr4HoXkbCKfeBuH4MyCcfN73ql2Dr3UgNH4JxF0VVAzVnAaeQfMxf1kJjvQ7/MSg+JY8aow8yt2wDdz1m0Hx0BEIBVRV8Giyhl3GcDbto4yjubGx9+mmPkLnUg2MUJoDW/IcIKYE8J56H3TpFMYidGdVaNDETbUMA29sCbgGXw+tWU9AW+aD4EmchUOv4ReDwhGL4Utihl6P/mQkbK/YAzMfmoGRqYXHKzQEMa6UrpYXlkx55PaX10bWkzKsAoGr89LB6yg3chlL3AR8YtXgQEHa8w3qYHml2QjWOHyiRh3dUoa+Rid20PClC7EoXuDphZ7gxVgwxxSCKSYfBxMRTjWfhcfefhI+++YtY8eCad8gpfZw1f1OTVtlCGLn+WvNVttbq3YcDHFSPzzowtRiFISG7Tz1GXILtNW8020YjiT0xkX7CBCjMBez0eSUA5eiQll9K6x4+jKoqfOF9TR5bdzoAK8kX+ZS1Q99XYaQI5LHDaYBkQP7MD5lChWDDr3O0x8OiBj08+nQak+ZCzGZt2DXnI1iZEK9W4bttQ3wXnkNHGpohYbGzkW0pMRMkCUZiKoacb4hiFWWy+l2SLmt93XbvtAuCIUOc4I1HV9DDe/fV2gsIVjSwBxbCLakWRA9dBnEZNyE5zPRMnLQGjjDGjYdrYUPq+qgvMkBKl6H290CHqkzWEuOw+vgeRlrjGlC5u0A4iyWsv987uX8ISUdUwMRg/rUOcNSINFqNtZluqJrktGVdPQbdDRAxXz5TtfFJxyVOMyIeXSKHPoSXojuFlsoOE7UuyWocbiNV5Mn8LwqXXP+25s3sxLAhIx5+ufP/P3bFkkyJok6djLzGMvLsjyhcPalhtVEmqPNTjjY0AInWt3Q4PGCQ1ZBUjSMPwiYRDsIplgceQYBMSfjk081nn7HC4dnYko0nKPOWaFN1uGs22vcOH3ye840w87TTcb/OOOSwIOfG4zD5V/C0cpvWAkz/QOKdvZE7euyrm+l5Y7HZSVkgcCTTS/vOQJyZ/V5gwZvNF6hFmTCMJ/gkZZlDUXDdknV8EZVwxL6wzvv3Q9lP5Ya5wmxQ6B89WG0YG6qQ1GMOccOa3CrainHc87W472vawwEXrxhN95wm1cxLIg+6TqnB7uBFxrw5cD6/opBJ8aPnejc8ZiVWgR0GzmK8S2r6hQE8Wiq+vd/vPpC54TFvyiS1xenhEvV8R3gcjWxEsDxLRWqrChr8bTjnv36Btvj+cVruw+DFOFst780NB6HzVtfgiPlW0BWJGN3QUpSNmRn/QIKRs2CpEEj2DuD838bH4CDh3zLnRlpo2H3M9tB47iJbkXpWGrw+3oIOpbjNpPp6qSExMTUgjHn35EEgY4Ma9bdBrWnDoHGEj9VlaG17TQcP7ETvt+1ASqPbae+ABISMkAI8DB/qjkAn37+Jzzzdbvhwli9el/FLocsP25UMLrdNEatS4kgrntl948g+fWonwdqDc+/uABa8OZDwYyWMzJ3OlxQcCmMGDHZiERbWurgjbeXQ0PDCeM9qUlZUPbSfjqXakSnRiUjkBUIsVZr5U33Pzx07FXX/exWQp/s6jXXsVJ42GzxkBg/1FhdpMK2UxgzS9+65v1DGHvQrQR+njqQCSher3fFa08+zolS35xXJLFajYmsPkEdaHXNfj8xcjOL0Um+xymKcjcWuw1bAfsEDsEbCc+XvnL/PUpH6v4zkRA/DOz4pCMB7U6nN9eqPCHvOFU14DbsoE5C93rv3Pv1VqX6m839G/z7CXWUdDE9EhQNma0f33vEhV3gXlbVjaCCtGK0jWZ1x1N3/BtHWjvH7vMN3QB8pr6KlfrO6Kyp8MF/v8lh3HGDGyDol3N6HEZcmvY6HtY/unihYhn47/8FZMu2V8Dp9N9TEi5DUkfBrle+UTGtfZG6A1YdkB4FoWBYe1vLmdMHnrr2CsWYaDuP6Jiu79rzHiv1jbjYwdC0uVlxt7Z965Tl/2DVQelVEMSpSNKcY+WHq1ffu1w1n0dR6LwFnb/oK3GxqSCW2dXaw1UVvCTNx6rAu4m7EIog4AA4K3k8F+/csvnUMzcvUSx0Wec80HUiJ1ySEjKB32dVy384eMIrSbPQC4akbEiCUFDaKvzg4sN7d1c9cdVlsrWPG3rDQSR9W2gfnl4IDZ82KVW7Dx3UPJ5idKL+O4V7IGRBKPjBP+E/KKk+WvHDr4sLNfnkwE4VmC3hLYTTbV7F+Qth/0s/6I0n674UJOkiat2sOSTCEoSCRtzQ6vVOlSTPH1fMn6Pveuuv+kA523A+NT4uDYqiZ+kfPv6W5nF5ftfi9c7FsSnsPtevO6E7gUVBeM0eEzvo8TXrBXNmjt+Ecn9xOBrg6WdnslJg6JbRyTmXwhfP/VOTnK4a2eu9HqPQLaw5bPr16xCyrldIqvqSJnm00g3rp1Tt2KYVTZjEi7HxEVnQoF9VO3TYf4toO6Johkn588C1Q1K2v/257nG7X2jzeq+g18Te0iciZuvY2/PxcdFNJYtzRo/Rbnr4d0JKQSG49b7/i3Ub/h0qjm5jJR/JiZmQmzIedm/4Wv7pyDEeY5U3eUX5L4yse99hFwIR7/yYm+bSH0MggrBU17ToS5csU6defiUZlJ0HbiLSlcmQqKkrg9WvLzO2iWcMzochMdlw9kCN9o3vxxCaMa1Yy34MIaLfc424IF2gP5exADPLJRzPz1QVJTo2IVGZPG0G5E+aLAyhP5cRGwcmixWI2UzDUlBlGbxuF7iam+DA/q1QWXZQPbh1J7Q2NhFRFKkIpaqur8fwm36rif3+SmQZSEG6wttEsYhT1V/i2Nj+gyq5eIPxaPJ+Ix3Wq9jehPWHsb0MhaI/qLLVJcv7sXnAI8LzJUhPWO3Y0/BCdIwZ6DA5cCvgvQLw/43Lh9x6b4NUAAAAAElFTkSuQmCC"];

iconEnvironmental = ["Cache in Trash Out Event", "data:img/png;base64,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"];

iconEventHost = ["Hosted Event", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKM+VkT1Iw1AUhU9TpSIVUTuIOGSoTnZREceSikWwUNoKrTqYvPQPmjQkKS6OgmvBwZ/FqoOLs64OroIg+APi7OCk6CIl3pcUWoQKXri8j/PeObx3HyA0KkyzeqKApttmKi6J2dyqGHiFD0PUwwjKzDIS6cUMutbXPZ2kuovwLPyvBtS8xQCfSBxlhmkTbxDPbdoG533iECvJKvE58ZRJFyR+5Lri8RvnossCzwyZmVSMOEQsFjtY6WBWMjXiWeKwqumUL2Q9VjlvcdYqNda6J39hMK+vpLlOPY44lpBAEiIU1FBGBTYitOqkWEjRvtTFP+b6k+RSyFUGI8cCqtAgu37wP/g9W6swM+0lBSWg98VxPiaAwC7QrDvO97HjNE8A/zNwpbf91QYw/0l6va2Fj4DBbeDiuq0pe8DlDjD6ZMim7Ep+aqFQAN7P6JtywMgt0L/mza21j9MHIEOzWr4BDg6BySJlr3d5d1/n3P48484P0g84P3KP2IxswwAAAAlwSFlzAAAN1QAADdUBPdZY8QAAAAZiS0dEAP8A/wD/oL2nkwAAAAd0SU1FB+gBEQESFfft1AoAAAkbSURBVGhD7ZoLUFTXGce/yz55hAXkKWJA0Mizqam8tFEr0yZaQpqmTMk4k6klxQgZJnGipRqp2CTGTCcmosjENtUmcay0nVriixkITiCEFsUgmhYQ5bWwGh6rLOzj7ul37r3hUYR9uLt3bf3NnL33fPf5v+c73/nO3QsP+D+DEZZi4oslkF91Ov1YdPyqeDASCRxkGDDjOnFFwWuZPDxgO66L2uLZUgnz8YGt4ZL4RUrB5Fw+ax6FooNqQgikiSl8X2qi14t/eiNSLtRdQtrGtvHem8btHkJdDBSeMnQ8OzCaCLC0g9iBUs61tVJM4Xbx9QgLqzf3wPotahg30K5rH/ed8GPnRuCJ9c/Awqgk+OQzrWC1nftKOAYlOFEzDrkvbIbcvJfgxKdGYYvt3FfCv2jVgaeXPyQnJ0NmZia0dY3DdbVB2GobEmEpBj+MCpMv+9Ea1awP/+R5LRyr0sFfz+vh6OlRzs0LX/4lpKamgQSTAI1mAEr210HVP4xwvtkADfhggLAQNX/2geJI5aBp6DZ7XszhrGzNMp/cI7sWSoX6NK50jsPzu4egaHsxBAUFQXBwMISEhEBCQgIwmIlQTCYTXL16FR+ABgYGBrjy2o4iqD8cCf4P3b1N12xqH+/oNex2W1ePDJODrxeBWxo15OTkQEZGBiQmJk6IpkilUs62du1ayM7OhpZLTZC05CFQ+Vh2ZLcV7oUjbcWbIVBVeRh+8uOnYGxsTNgyk9HRUcjKfAKutZ6F3/0qEDys8GO3Dm7UXT8sDgbDYCM8k/WkYJ2O2WyG1Y+ngh9zGT7YEQQ+ntZJcmvhFAVmWpue9oGu7i7BMpN/t3XA1g1+gLm/YLGM2wunNH2lgxUrvivUpuOBWW/y8kfh4r9sm23aK9wPy0aZTHbS09OzXS6XDyuVyh6FQvE52l/DEkt3chTN7Qykpq/i1tVqNWx47lnY/GIuDA8Pc7b0lRn4cGxLZmwVToeeV1Fwt5eXV3lWVta64uLi6EOHDqn27NkTnpeXlxq95JHtGHlbMeIew33DuaPukUvt41zSUrr/PUhKeAQCSD3oek9BfGwMVFScgPT0FdDcIexsJbaM434ouAIFrdq5c6e0sLAQsLWFTZMM6YxQ39IBv9mSZ2xq/FxrNBoz0Uw94b+ZcxyfSuarA6Adk0OYvxFez1NB9AIFZ2/6agyKyoZBogiAEN878Icd8zj7XHwzjlsrHL1ZXotJxGNnzpyRxcfHC+a7064ZhTbNHTj3cbl5/94SPcuyKWhu4bdOYLXwQS0LfTeNQF9YTBnGOUw4RW24rIOlUQoIVFk8lW0JDKaHb2Mf/k5NTY1F0ZToIG/wlEshIyfP4+cFr8jRUz5B80z3sJIAXwkkRM8UTZFKGVj5qLdVoqdijfDFhJD88vJyaUxMjGCaG3qDS4K9wYyzqadzt0iCQ+eHobmQ3zpB/7U+A0v3cRVjejP0D5poWtdnjau/Fxsbm9fa2iqfmi5awoxzyKortwClweD1q/DCs98fxP4eRDfxe8AiiQdzOT5aKcXWlAk2m0hL9IKsx1VCbTpHTw1x+f5UvrisM9xQG7QmliyxpITBvt1XUlISum3bNsFkPRe7R6BnaBwkDIGnvh0BLGtaieY6fitHHJZ8hYyxOfrjzadveDIgaPemUMEySVnFLdhzVEPkUuYUVk28FYjeSDpx+Q6Wbs4yB7SFSH19PXq77WCQIycv9XNlWUq6Hs/1EndWByCTMlXPrw8gXX+Pm1Z2/SKUdh7qVXncjrNgqY9zjzM83L7heGoKuSiG8675fM05HK8ahl+/30+FF2Ap54yzYEk41x9xOOIqtjI1co3pdLTyjds5nD9Xj8DW/X3oZ1CE1YO8dXYsCVfTn56eHq5iK9qxSZ2tOFdGuPM5mlN1Wtjybi+NpzRdfou3zo0l4YOYf9+orq4WqtZDG3vgNu3WOMNiWLh+rYO+D2rgDA7kbMNtyN+Los3wBlZf562OYW9kZKQehyI+YllJ19e6icBW+se/EDo64LmsHw8tQINbXJSSSCQMiyf9rWB2KAswc9OXlZUJkiwzbmTJuSsaTvTpln7iPy+ITp0286dzDFQ4LgjGT9qfHfZAp4Fz3mJ0eVNTU5MgbXYwoJG69kFOdOWX/SRn4yYjpqyteBq7kpTZwFzqtEQCv6ervMU5eNB828/Pz1BbWytInAlrNpN/Xh+eEL0x/xUTHjeEx0fyp3EoG7BYk3LfM0qckn6Ebs/m5+eb1Wr6d+sk1L3rOwY5wSc+vUiWxicZsF/TTGkpf7h7YY+bPIeC3jaZTGHJyclGLPL54RHgFRoJ3Z0d5MP3D7Ca/j6CY/8+3JdG2RHuKDfD3v5Bh6bvYcnEvp+AMSAMG30EI/81FEyDzt+w3MTittxLYKDH0ndvdHpEv2OhL77p35e0zP4S3E2wVjidw9KZ1Rrs59/Cfv6YwWBYgK181+Nxn1Hc54per6fpGi30RYRTsjZ7sSQ8GQXkoytnYZ9WLV68WL98+XJ5UlISExcXBxjlwdfXF3x8fLh8XqvVwtDQEPT29kJLSwtcuHDB2NjYCDqdTopxoRkfxFE852Esd7izuyEr8UZrcUnS0tIMpaWlpKuri4vetoKeQaqqqkhBQQHBB2TA4Y12hV1YfOiF3AUlwzDvYDGvW7fOaO88fDbQI8i7B8pJzNI4mtTcwOul85cVFz9s5UsqlcpQUVEh3KpzaGjTkKI397H4gOl892f85cXBG0U3RkRE6Lu7u4Xbcx5Gk5nL5Y+crCEYP6j4bP42XAwGsLLAwEBDZ2encGvO54YwezuAMze8Pn0ruIi/G9fxMH3qx48fF27JNWBaz7V65ZcDZFXGDwwo/gPhflzGy9ja9N8O4ZZcx8WuEa7Vj52tIzj20yHOtn8F7gE6u4lLSUmRYKvzFhcyz4efqfqHPky/Z/HG1QWcwQVQtd6YiIjy9ZNSxl/WzExc3mVju+ubeQoKKX/5yXexrkNU4dZ8pOMsRBVOP9EUC3GFC0sxEFW4mIgr/IGrux4aVz/CcfynOEGx/+NvO5HJFRAcvpDBOTtTfaaSZjMJWOg7eKdDhdMPc1ZzNXGhExX6r4jLG+ABD/ifBeA//KzFgb8RyogAAAAASUVORK5CYII="];

iconFtf = ["FTF", "data:img/png;base64,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"];

iconGiga = ["Giga-Event", "data:img/png;base64,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"];

iconMaze = ["GPS Maze", "data:img/png;base64,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"];

iconLarge = ["Large Cache", "data:img/png;base64,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"];

iconLetterbox = ["Letterbox", "data:img/png;base64,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"];

iconMatrix = ["Leapday", "data:img/png;base64,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"];

iconMega = ["Mega-Event", "data:img/png;base64,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"];

iconMicro = ["Micro Cache", "data:img/png;base64,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"];

iconMulti = ["Multi-Cache", "data:img/png;base64,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"];

iconMysterious = ["Unknown Cache", "data:img/png;base64,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"];

iconOddSized = ["Odd-sized Cache", "data:img/png;base64,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"];

iconWebcam = ["Webcam Cache", "data:img/png;base64,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"];

iconRegular = ["Regular Cache", "data:img/png;base64,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"];

iconRugged = ["Terrain 5.0 Cache", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABXCAYAAABxyNlsAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKM+VkT1Iw1AUhU9TpSItInYQcchQnSyCijiWKBbBQmkrtOpg8tI/aNKQpLg4Cq4FB38Wqw4uzro6uAqC4A+Is4OToouUeF9SaBEqeOHxPs5753DffYDQqDDN6okBmm6bqbgkZnOrYuAVPgzCjxAmZWYZifRiBl3r655uU91FeRb+VyE1bzHAJxLHmGHaxBvEs5u2wXmfOMxKskp8TjxhUoPEj1xXPH7jXHRZ4JlhM5OaJw4Ti8UOVjqYlUyNeIY4omo65QtZj1XOW5y1So21+uQvDOb1lTTXaY0ijiUkkIQIBTWUUYGNKO06KRZSdC518Y+4/iS5FHKVwcixgCo0yK4f/A9+z9YqTE95SUEJ6H1xnI8xILALNOuO833sOM0TwP8MXOltf7UBzH2SXm9rkSNgYBu4uG5ryh5wuQMMPxmyKbuSn5ZQKADvZ/RNOWDoFuhf8+bWOsfpA5ChWS3fAAeHwHiRste7vLuvc25/3nHnB+kHh91yrzrJEVIAAAAJcEhZcwAADdUAAA3VAT3WWPEAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfoAREDDTvl5QM1AAATHUlEQVR4Xu1dCXhU1dk+s2VmMpM9GEJi2AmgESHIohIUBRXKIlJpK1aT/7dW0YcKVu3vWh+2ArZY2odWQayhVkHKooWfrUTzCyakgEF2QjCLSUjIZJvJLPfe87/fnRMEDSHJTGZI5H2ek3vvueeeOfc93/nO953lhv3AYNbr9WPE+TX4EwaD4TWEanHZ4dCK4w8FdyFEIYSpVx2MHxK5OoRhdGI2myPo2NHQiGMgYUbTfBDHKTgO55xHINTLnOdzWf5EkqT3cM+upvQj8Fs34PAVnXs8HiK3js47EgElNyQkZCo6lD/rdLq4u+++W7njjjtCoqOjWW1tLcvdn+fatGmTweN22yXJ8zgI+Id4zC8AuY/isAaBI289jgrFdwmA1KdBrvLkk0/K58+fh7B+H2fLq/hPH5/LKR3IWCYe9QuQ358ROILfW0VQgReaSYS99dZbgsbL41BxLX9lRSY3mc0yKuR5kYXPQF4HiFwcK0RUl0CE1Wo9/9xzzwn6WkajW+af5Ffw2a8s5UajSUKlDBT5+IIQEOvGHyL3tIjr/AA5L/fo0cNTX18v6Lsy8r6u4ZsPlfGBKUNlo9H4N5FVuwFCh5PUhuj1pBayRXSHo8NNMYvFkgHoIb0i5sqIDzcyjUbDJsz4uVar0/0YUQbvnXbjFgQFvbeCuiv1RnU8Oppcq91u75mWliYuW4dwM3XmjA1IGcYkj8dsMpl6qBHtxwgt5zJnTEKlBUzndii5aNLdICmahIQEEdM66LReCzEq5jr1CNs3Xj1pP8aBXAM1B5SnXMR1ODqUXJfL5aRjY2Ojet1aeEjGALf3ceLEe9I+dMfzSSCXIVc9zrsGuUAFXM36nJwccdk62Owe9Vh05oQqbDD6T6gR7QA61NvVE5ALkOQWqNcBQEeTq+Dldmzbtk1ctg7FNq+kf75jCzOZQ8llbZvoXwSQeRsY9dYWAGuh65hicHXHgWCenZ2N97wyymqdfMuX5Xz1/+bx0FALeWo0DtFukPNg0ul4qFZLZhipl2CMp3QcYmJi/pWSkqJUV1cLCptHvdPDt311jn+Ue5YnpwzlUTGxR/C413RoH6JAqGwBsWYQDKKPifguhe6RkZHFqampcnl5uaDyUjhcEt91rJJnZh3hqbfdycPCI2qhr30ywUjqEXgY9LZRr/eA3Exxq8shPioq6kx0dLS8dOlSfrEUV9a7+PtZh3n6M6/wmG7XKeERkaVQJYPEc20GCE0PDQ0tQSAjWSZyESeB3GdEki4JI174OXhrdjgGysCBA6WbhqbKiT37UMfHrWFhDTi+inRmb/K2AyRmIA/lpZdekteuXctvGTGSh5rNRC6phbZ5M50UUIG6iXjZF/DSi0micH0H4n1yc5FXKirNvWjRInJzVWzaX8jDwsKIXBq/DfemvIY2AaT2hMqpvv/++7mieLkldUOWx3VxcSS1Z0XSgCHYZokWEkW6dQQCHQeApChIsQ4E1brd7lJZlivAUxnuHYAbnI+jA+Fi6NBRPlZUVLQ8OTnZuHXrVgZJVX2GzwuqWUlJMXvknhEM+b2L59PFMwFBMMjVgdCf4PgAOLwH5EENh3pAjGfw4MEmdHpa6ExWVVVFgZeWljpBnMZms5ngrSmwIErDw8NLjEYjDUdGV1RU9HU4HMaMjAy2ZMkSmnxUf+RYeQM7fc7OdmSuYKv+9AaNT4xF+Ey9GSAElFyQlozmuQEkJU+YMEGZMmVKyKhRoxiIVYcYW0JZWRn78ssvWX5+PgPZrK6ujsG8Y6gQNnnyZHbx4NApkHoc5NqqzrE5D6SxBgDE0qRk15k3+w50aK6nx44dKxUXF6s60d/wyAo/UFSj6lkKd02cxiHJ5OX9XpShSyLEYrFs6N69u7ukpERQ4V+Uw23eDSekidgnXlxME52qlYCQIsoRUARCLVhg134MvXp7VlaWYdCgdvsGzaLeKbEjZfWsst4tYhj79z/fYysXv8y4DFHWaHZ7PJ4J4lZA0dHkRoHYHeiAhuzatcuvxFbbPaywysHK6pxiNJGxuvPn2Nrlr7I927cyjSQxWaslK+FOdJpZ3hSBRUeSex1UQVZcXFy/3bt3G3r16iWi249Gt8xKa52sxOZUJbYJMGzZ3k/+wd7+wwKm1+mYHZaGW6eTwPk2dGRTRLKAo6PIDYfEfp6UlDQQEquPj2/7LI3dJbOTBYUwxypZaHQ8U0zhrMZxYVhWhbPRwQ7nfKpsePv3msKC05owo5E5a2qIWA6pdWq12htdLtcZkbxLwACr4DMQ6/Gl86Jx3ReXr1HHBCiYYQvHxfew9e6XXJV841BbYq++LqPRRJ0VTZkrVo2Gw7dtGrel8DNRnq4DmD5vwP6Ujh07JmhqH2hs9811u9QeH87GOJA1EzbyPBwXIyxFyEXgNBBOpH6H2AWiOF0HIGIKkbFhwwZBUfshKwr/YO9JlSyQOlz8BCFeECvRIHgTsTQYLoj9nUjXpRCJDsw2Z84cQY/voMHzqJhYavqP0A/gmAqiyw16vadJDdARasGDey6E/1ZL0tUAO/YviYmJbVq2dCXsO1PNBw+9hchdjBYxA0cnzSiEgVQKUAmqzkX4AvcHi6J0LeDlhhqNRuVy6gCmPC+qdsBiEhGtRH5JHZ8w/We0IO84fkMhMklaSR2EGAwkrecRaN1tIJyhNsMvU+voxF4dOXIknz59uoj5FmSPZp8+z744Wc7KK6tEbOtgMepYQs9+TKfXJetlWWNAcMMyIFML9ZQJz6s/wrtIKtyIqws+kwuJ7QVbcvKzzz77vbwqG9wgtpp98O7bbPbU29jmTRvFndbBCnITe/djkkdierhhLr1ekjWaenhd98I5yECSgO3MCQqga98cMGCABBdTNGYvztW51HW2MzKeJhtVge177oknnhB3W4e6Rg//y5a9qhUANUATjEdQmX3ET1/18Fly0ZE8kJ6eroM3JGLgOXkUlldUw44f3Me2rP0rkyXpfkjb6ry8vDY1X5NBy+ISkxjljQdzIK0jOpPH5Su5MQ6HI2H06NHi0gtajiTJnGX+cSENAKx3u92boRtzjxw5QovzvIlaAYNOS0vCmTU8gga5abNIp9rP4BO5aK6JaL2sb9++IsYL6sRsVRXsaP5BPST2TxQH6csDwZrDhw+raVoLk17LwiOjyM6IFlGdBj6RixcOoSNIVq+b0OiR2dmTR9UVimjKuRTndDqLTSZTA03VtAV6SK/BYCRTq7lpd/y0YQhCOsIK6OR1plDLxsiY2PVGo5m2oj6EQBv7fFkS1W74qhZU+/K7818KGnFdTTXePIRWJ15YW4vO7wTNgbUFtA5ao1VXQ9MOSBUgMQ0V9TE6N1ITh6A2Vt004vbZt43/0Y9HjB0/bdDNI2Yk9un7itFkpg2D/0G6evQNn+G5p3AdSXkEApey0kZQz41mX3Do0CF1orAJ+87Y2JZN/2TLX3zKDYk1imia8l6Rmpr61J49e0TMlbG3wMbSp41DSzj+mix79oLUxdDhw265NU25a/rD2j6DhrCYuHhUgkbtAPU6jaqr6cVcksIKzpxhp786xAryc5XdWzfJDnuDA5bNL6GiPvD+wtWLUDQ7vmvXLrKcLmD/2Rq+eM1m1YRCmgu6EtfpsbGxl9psVwC5wCnDb+WkUmhQaNzEacrKjVn8izM2frKigZ+rd3G7SyKnoll4JIUXVzfy7FPn+Ue5X8M0fEodaQuF+kCRYr0lu0oBaaxftWqVeBUvjpXV87WfHlXJRVMcK5JSc76d4iorK0XKK4MIXLluO//FM7/h27P3q7ZvG73oC6Ax4p1HK/nv/raFJ/bqq1isVhuIDtpMxRURFxd3cO7cuaL4XpCk0Axs7/4DFaPZ/LpISguhpxK5OTk5ImXgQdPvh0vq1DXAMx+b07QVdj2K53drxNcOjezW/d81ryLEVqebb71TY7GEzaJzWl0Dc+xDslvPQA8GC3r0jTcmhLG0QfEs41cvspdWZGqiu8VNN5stR9Cy/PoVEZ/Jtdvt2bm5uQo6GREDVWHSMyPs0zH3TmP1tbbekIzHQOwWraIYzCYTKywsFCmDh27WEJbWP4ZNGD+eLV+3Wztq3D3dtVrdpygrtTS/mG4XzJv2AhbDeUjvvPEoZFJSkohlrMYhMUN4LNu36180OztRdjbqjLKs1ZrNrEePHuoSpGCDLIvEKDPrFmllA0aNZ1HXJWjyc7PH6HX6SRCGnbAqakTSdsFncuEk1EdGRv4Cujds7NgLfRdzw/1FT870hhCWm7Vdq3e5NJJOxzzw6Gw2G589ezbMY58sQVZTU8OysrLYhx9+yFasWMGWLVsmr1mzhm3dulVz4sQJKpta4SBKPNE8rEY9S4o2s+69B7KUMfdpjh3Mia+rtWVARf8fTM0ikSw4iIqKemfcuHHeHkOAJhipU1ufU8hDLVZu9M5x0Qryly0WizM9PZ2XlZWJ1K0HnBC+aNEinpaWJsE8o/yUiIiIs3BQ3kf+CxF+i+u/R0dHF9I9VLpMU0+nTp0SObSMgnN21WS7e+pMBfnTvoxE8ZrBAV5iBl5OaWhoEEX0gtZuzXpiHi2GazLLXqD06NzuBAGVRA4qRVm4cKFqQUDSxJOXoqKigi9YsID379/fTfnA/CvDs3/F705Fdpf9GBB+twfSPIPKV4meNWsWP3v2rMj18th/1sY3H/yGR0ZF0e/RuHFQEQFy3ZmZmaJ4Xrzw2oKLF8P9UaRtggH3poSHh78DtVJOpIEEedKkSXz+/Pl89+7dfN++fXzevHkcki4hVCHNfISb6VmqIFTWrxBeQtxDiOum5to8NEg/CfkXIB/59ddf542NjaKU3wfZ1tTqEpJ60Q6gOSKP4CExMXF9k2ogSZs5cyZHZ6cSiwKuRZIWFSy50kj7KCQ6EyQU03MI3Gq10jlJTwgImoAKWQeJVL21hKSenuQbbpKsYeEKnqcvi3yIYz9vjs1Ch2dnI09HcnKyvHPnTrW8F6MB3t72I+f46u3/ubBmQjwbPICAVCrMQw89RJLGLaGhRCy98Ce43R7Thj7QEIcA09jwc+R5DPkr9913n2v16tX8m2++4S6PzI/CG9yYV8T/5w/v8MFDhklGk8mJ36QtUS31YnGowI+ovGgpyoEDB9R1EgWVdr7tqwq1nxg55k4ZFXEUaX02V30G1TCaOA+3WnkoOi8xO/s5brV72xMBeSxA4JA0fvr0aSFfl6LRLalfF9l0sJQ//vx8VK6VPt9CG/paJAaVMComJiaHSJ44aTL/9WtL+CNzXuTX9+qjQM1VIt6/613bCRMKWmjU6yVaT0CLNHD9NeJjvLd9AyToSXRg0oMPPshbWhdRYmvkWw9X8CXvfUw7MJW4hMRNIosWAcEYD0nehFAWHRNTFBYWQf2D92MPwQYk678QFHUbqE4n45zGT/1a6yRlsBLODxs2TG5pgR+ZgDuOVvKF72ykkTQeHhXzS5FF5wRe/DCRSos1iGSSBHHLr4AEJ0C6jqPzlMnevRxoCJKWQs2a/TxsbIsTJH/rOnYmiF6eW2kVjF7vBtHrxK2OggUOQla3bt1kmk2+HGhocvPBEt43+QZZHxJCk5udDyD2MQSZFsQRyR0ltd8BfaZwKzojuSXPq7DKzn/zxmoe4t2zduksamcACH0TEuu66GMR6qRlAGAAwXkpKSlyS51c1olK3rNvfwll8+vnCwMCqIHNMBUUMr9wHuixxDg4HTXkxV0OZEFkzH2VVv3Q0iefNm4HHJCIbFrdTQHne0V0wIDO6mF0dMrJkycFnZdCkhWe+e/8Jm+LPk4cMPjb+7h0R0gA4HQ618Lg/5qGHJsDfaOs1/UJrFf/QRwd270iOiDwmVwIh43jQAMHOA+G4c0bGhqWZmZmKrQfuDlEmA1syOixmlBz6AMiKiDwmVyNRlOKP5KGczrvjSifB+DbCpfLRWt1PR980PxShBC9ht08aiyzN9RT+Wi8IiDwh+R+pWg0OiIXMELv0uerA416mFqZy5cvV2RZFlHfglYAJd+USmVlUbHdU0V0h8MfkkudWFM+tOAjKEN0DodjPg2Er1y5UsR8i2qHm9VWe1e1T5j+k+DOLLQR9HEKO9m5MMnInswW8QFHWFjYry0WyyV7M2gRNg18T5z5KI+O7WZDsqAsyms3QOhOIrZpbAHm0fXiVqChiYyMXAazS3kkPYPvyTvCtxwq5bNmP6cu/oApNlGk6zwAoRlEKo2K0fJ6nP9W3AoKQOSUmNjYIrJ/o+Eih1ostEftYXG70yEchXeSahA7Gckb8mmQ3A/QQlLvFaR290Z1UsD1fZ8GycXX52jejNbCXoM/AEKHEamkd8XORpLegPwPnKsVfjP4FUUpQzMcA5s3KURRdJJWa9RqtQ7EB8166FKAKri1SXqF7q1HtF/m0Toj/OqqQkqLIa0DuFY7MESWdbJWq6NeBfE7RZJr8AUwf3qQxNJMsJBe2nh2dS+P70yAehhNBBu8HhsNoj8tbv2g4PPYQnOQJGmfRqMZzhlrmpmgD2Feg59BzsXMTjk5eA1XMxj7f+hoI6bZ3oevAAAAAElFTkSuQmCC"];

iconSmall = ["Small Cache", "data:img/png;base64,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"];

iconSocial = ["Event Cache", "data:img/png;base64,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"];

iconTraditional = ["Traditional Cache", "data:img/png;base64,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"];

iconTraveling = ["Caches in different countries", "data:img/png;base64,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"];

iconVirtual = ["Virtual Cache", "data:img/png;base64,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"];

iconWherigo = ["Wherigo Cache", "data:img/png;base64,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"];


const typeIcons = new Map([["Cache In Trash Out Event",     ["Cache In Trash Out Event", "data:img/gif;base64,R0lGODlhEAAQAKIHANn7yt//37LN/5ub/zObLP///wAAb////yH5BAEAAAcALAAAAAAQABAAAANKeLrcPSbG4VQkmEhnso5FxHSZBEGGAnmgFFIkAHyogR5GQcjEOxSDW0fXw0iOOF2BaDymSD2mM7UiEp0UXLHkHAWa3cZ0UxFgGwkAOw=="]],
                           ["Community Celebration Event",  ["Coummunity Celebration Event", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAKQ2lDQ1BJQ0MgcHJvZmlsZQAAeNqdU3dYk/cWPt/3ZQ9WQtjwsZdsgQAiI6wIyBBZohCSAGGEEBJAxYWIClYUFRGcSFXEgtUKSJ2I4qAouGdBiohai1VcOO4f3Ke1fXrv7e371/u855zn/M55zw+AERImkeaiagA5UoU8Otgfj09IxMm9gAIVSOAEIBDmy8JnBcUAAPADeXh+dLA//AGvbwACAHDVLiQSx+H/g7pQJlcAIJEA4CIS5wsBkFIAyC5UyBQAyBgAsFOzZAoAlAAAbHl8QiIAqg0A7PRJPgUA2KmT3BcA2KIcqQgAjQEAmShHJAJAuwBgVYFSLALAwgCgrEAiLgTArgGAWbYyRwKAvQUAdo5YkA9AYACAmUIszAAgOAIAQx4TzQMgTAOgMNK/4KlfcIW4SAEAwMuVzZdL0jMUuJXQGnfy8ODiIeLCbLFCYRcpEGYJ5CKcl5sjE0jnA0zODAAAGvnRwf44P5Dn5uTh5mbnbO/0xaL+a/BvIj4h8d/+vIwCBAAQTs/v2l/l5dYDcMcBsHW/a6lbANpWAGjf+V0z2wmgWgrQevmLeTj8QB6eoVDIPB0cCgsL7SViob0w44s+/zPhb+CLfvb8QB7+23rwAHGaQJmtwKOD/XFhbnauUo7nywRCMW735yP+x4V//Y4p0eI0sVwsFYrxWIm4UCJNx3m5UpFEIcmV4hLpfzLxH5b9CZN3DQCshk/ATrYHtctswH7uAQKLDljSdgBAfvMtjBoLkQAQZzQyefcAAJO/+Y9AKwEAzZek4wAAvOgYXKiUF0zGCAAARKCBKrBBBwzBFKzADpzBHbzAFwJhBkRADCTAPBBCBuSAHAqhGJZBGVTAOtgEtbADGqARmuEQtMExOA3n4BJcgetwFwZgGJ7CGLyGCQRByAgTYSE6iBFijtgizggXmY4EImFINJKApCDpiBRRIsXIcqQCqUJqkV1II/ItchQ5jVxA+pDbyCAyivyKvEcxlIGyUQPUAnVAuagfGorGoHPRdDQPXYCWomvRGrQePYC2oqfRS+h1dAB9io5jgNExDmaM2WFcjIdFYIlYGibHFmPlWDVWjzVjHVg3dhUbwJ5h7wgkAouAE+wIXoQQwmyCkJBHWExYQ6gl7CO0EroIVwmDhDHCJyKTqE+0JXoS+cR4YjqxkFhGrCbuIR4hniVeJw4TX5NIJA7JkuROCiElkDJJC0lrSNtILaRTpD7SEGmcTCbrkG3J3uQIsoCsIJeRt5APkE+S+8nD5LcUOsWI4kwJoiRSpJQSSjVlP+UEpZ8yQpmgqlHNqZ7UCKqIOp9aSW2gdlAvU4epEzR1miXNmxZDy6Qto9XQmmlnafdoL+l0ugndgx5Fl9CX0mvoB+nn6YP0dwwNhg2Dx0hiKBlrGXsZpxi3GS+ZTKYF05eZyFQw1zIbmWeYD5hvVVgq9ip8FZHKEpU6lVaVfpXnqlRVc1U/1XmqC1SrVQ+rXlZ9pkZVs1DjqQnUFqvVqR1Vu6k2rs5Sd1KPUM9RX6O+X/2C+mMNsoaFRqCGSKNUY7fGGY0hFsYyZfFYQtZyVgPrLGuYTWJbsvnsTHYF+xt2L3tMU0NzqmasZpFmneZxzQEOxrHg8DnZnErOIc4NznstAy0/LbHWaq1mrX6tN9p62r7aYu1y7Rbt69rvdXCdQJ0snfU6bTr3dQm6NrpRuoW623XP6j7TY+t56Qn1yvUO6d3RR/Vt9KP1F+rv1u/RHzcwNAg2kBlsMThj8MyQY+hrmGm40fCE4agRy2i6kcRoo9FJoye4Ju6HZ+M1eBc+ZqxvHGKsNN5l3Gs8YWJpMtukxKTF5L4pzZRrmma60bTTdMzMyCzcrNisyeyOOdWca55hvtm82/yNhaVFnMVKizaLx5balnzLBZZNlvesmFY+VnlW9VbXrEnWXOss623WV2xQG1ebDJs6m8u2qK2brcR2m23fFOIUjynSKfVTbtox7PzsCuya7AbtOfZh9iX2bfbPHcwcEh3WO3Q7fHJ0dcx2bHC866ThNMOpxKnD6VdnG2ehc53zNRemS5DLEpd2lxdTbaeKp26fesuV5RruutK10/Wjm7ub3K3ZbdTdzD3Ffav7TS6bG8ldwz3vQfTw91jicczjnaebp8LzkOcvXnZeWV77vR5Ps5wmntYwbcjbxFvgvct7YDo+PWX6zukDPsY+Ap96n4e+pr4i3z2+I37Wfpl+B/ye+zv6y/2P+L/hefIW8U4FYAHBAeUBvYEagbMDawMfBJkEpQc1BY0FuwYvDD4VQgwJDVkfcpNvwBfyG/ljM9xnLJrRFcoInRVaG/owzCZMHtYRjobPCN8Qfm+m+UzpzLYIiOBHbIi4H2kZmRf5fRQpKjKqLupRtFN0cXT3LNas5Fn7Z72O8Y+pjLk722q2cnZnrGpsUmxj7Ju4gLiquIF4h/hF8ZcSdBMkCe2J5MTYxD2J43MC52yaM5zkmlSWdGOu5dyiuRfm6c7Lnnc8WTVZkHw4hZgSl7I/5YMgQlAvGE/lp25NHRPyhJuFT0W+oo2iUbG3uEo8kuadVpX2ON07fUP6aIZPRnXGMwlPUit5kRmSuSPzTVZE1t6sz9lx2S05lJyUnKNSDWmWtCvXMLcot09mKyuTDeR55m3KG5OHyvfkI/lz89sVbIVM0aO0Uq5QDhZML6greFsYW3i4SL1IWtQz32b+6vkjC4IWfL2QsFC4sLPYuHhZ8eAiv0W7FiOLUxd3LjFdUrpkeGnw0n3LaMuylv1Q4lhSVfJqedzyjlKD0qWlQyuCVzSVqZTJy26u9Fq5YxVhlWRV72qX1VtWfyoXlV+scKyorviwRrjm4ldOX9V89Xlt2treSrfK7etI66Trbqz3Wb+vSr1qQdXQhvANrRvxjeUbX21K3nShemr1js20zcrNAzVhNe1bzLas2/KhNqP2ep1/XctW/a2rt77ZJtrWv913e/MOgx0VO97vlOy8tSt4V2u9RX31btLugt2PGmIbur/mft24R3dPxZ6Pe6V7B/ZF7+tqdG9s3K+/v7IJbVI2jR5IOnDlm4Bv2pvtmne1cFoqDsJB5cEn36Z8e+NQ6KHOw9zDzd+Zf7f1COtIeSvSOr91rC2jbaA9ob3v6IyjnR1eHUe+t/9+7zHjY3XHNY9XnqCdKD3x+eSCk+OnZKeenU4/PdSZ3Hn3TPyZa11RXb1nQ8+ePxd07ky3X/fJ897nj13wvHD0Ivdi2yW3S609rj1HfnD94UivW2/rZffL7Vc8rnT0Tes70e/Tf/pqwNVz1/jXLl2feb3vxuwbt24m3Ry4Jbr1+Hb27Rd3Cu5M3F16j3iv/L7a/eoH+g/qf7T+sWXAbeD4YMBgz8NZD+8OCYee/pT/04fh0kfMR9UjRiONj50fHxsNGr3yZM6T4aeypxPPyn5W/3nrc6vn3/3i+0vPWPzY8Av5i8+/rnmp83Lvq6mvOscjxx+8znk98ab8rc7bfe+477rfx70fmSj8QP5Q89H6Y8en0E/3Pud8/vwv94Tz+4A5JREAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADKGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozREQ2QkQ0MzdGMkYxMUU5QTU0QkJDRjI2QUE1NzFFNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozREQ2QkQ0NDdGMkYxMUU5QTU0QkJDRjI2QUE1NzFFNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNERDZCRDQxN0YyRjExRTlBNTRCQkNGMjZBQTU3MUU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjNERDZCRDQyN0YyRjExRTlBNTRCQkNGMjZBQTU3MUU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lJW6fgAAAedJREFUeNqck89LVFEUxz8z9cwRnXFV+Q9om1JEaFfWZAoi2rJFBNEiaCMhUhhE0qJfBP3YKUQ/RHA3DCJoDIIkzT4qs6wJBXGcHB1lfDa+17nvPudNMwuHvvDlnHvufd9zzj3v+uwNbGBXuCncdqn8nDDt2vzek4WmsTeLDYdxcVBttvdQnUwRiscIGYbe+JGAqRj4/dDZDnVHdXzFDCTF9Lnfm0pgQ1j9dR5sW0dfvoXHz+DTF70OBSE2Ds2NkMlV7OAh5VcCj+7BsXrovQnJVZiZ1XYP65Kib8BNaR3YLRD47Qj8/AV/pFND6nk9qjMWCii8/6Dt6k7ldkF4RbWQUQKf52BxCYI1cD4MgQBks95Jy8pXYJW0UBuCj3GpZw2OyP2aJly5JBUZ3smzp7RdNqsOlQhMTEHPRR3p74XhF/BqBC506ZiaxOBtx1Uj9RULpOdkArmc7v2aCLSchqYTMBvXp54+hJMtjrv1782QcsbYdgYaj8P8N4hOwNXLEG6F6zdg6Dl0nMt/kC0SSDoCDwa9yJ1bnj8ZoRhmcQWqhQzlY7OkBV8kOi3OXWGFsGofgYW0fd+QrKNqIT+upVqoU5WXWcG7gG2ri+x218NKICVMlCnwXVjjvsxK9Yp99t4L+k/8FWAAJ4SibjpXhgEAAAAASUVORK5CYII="]],
                           ["Earthcache",                   ["Earthcache", "data:img/gif;base64,R0lGODlhEAAQAMIGAPmbRv39/XesnSBZEKDU4AAAAP///////yH5BAEKAAcALAAAAAAQABAAAANIeLrcXjAWp8oQAmgwm73ZxjHfJW5diZ3oYRErEATn9MZz7QpwyI4FXu8HFPYwmMvAZiQ4YYPostKESjvUp3XqQQquFJcEwkgAADs="]],
                           ["Event Cache",                  ["Event", "data:img/gif;base64,R0lGODlhEAAQAKIGAOzs/750dP7+ieTk/ywsEf///////wAAACH5BAEAAAYALAAAAAAQABAAAAM6aLrcTTASp4i4WMyX+65XIY7FMHyWEKxsYKIhKb5LKrblWccyXZvA4OcXBOgoEh/lN1waIM5HdLpIAAA7"]],
                           ["Groundspeak HQ",               ["Groundspeak HQ", "data:img/gif;base64,R0lGODlhEAAQAOZ/AHyuOLrRvEqINf7+/T5pK16XN1WQNnKmODt9NXCkOGuhNzNsLzlmK2adN1CNNoW0OUODNXmrOHWoOG2iODV5NGieN2ObN0JmJj5jJk+MNjthJkeGNT5/NTd6NDJ3NC90NKGXNo+OM4KyOff69neqOIGxOXWBMDZ5OTl8NIe2RYOzOaKmPPv8+D+ANeC6QEuJNuvx7J6qO0GCNV+UZqbJanWoPaixPG+kOGGaN5qoO+fw3Et1LdHhzbWhOTNnLUWFNWuccIe2O97rzPn7+H+wObnTn/z9+qayPK+5PKCWPIizXHqsOEeETrfThE6KP7vVjX6vPViTNlB6TMneqbHQdqHGYT1+O1mUNkiHNbPQjKy3PDh7NOLs18bdnXmpXrKyPEWEP6OvPKvLip+tO+vz3Ia1OYe2OZnAYZ7DY3apOIOyRJu/gJC3eO3z7lSPNtTjzYOtd0FgJn6vOYqyfECBNZvBXMPaljhfJm6ecDZjKqq0PFaRNoq5OkhrKv7FQv///yH5BAEAAH8ALAAAAAAQABAAAAfggH+Cgl1VQSJnWTqDgwOCNA8icktpNUWOgkZUTSxTJQAREgcTFUojgnZ8ZmhCoBIJChUWBWx/ZHxlKkRqJAc3Cg04BVEGb09lSH59espffs8gOxlzdSVayjZ+Icp9fdoETikAzM9+IMp7Dn49BHRQJEfKJubKDi/mDAhKB2HKMdrKVjwLwcCKmAljlOXwE+dcuSR58HCRdeHCHgwYsGjQcMeFHx8B/qwpcMWAvQ0QWiDosGCBFEFDvLjJ8GKDDA4oOnj4wKTNoBFzBPy4iYLCzhkwGAniAQfMFgongIQcFAgAOw=="]],
                           ["Geocaching HQ Block Party",    ["HQ Block Party", "data:img/gif;base64,R0lGODlhEAAQAPcOADJ7P0GQSkOSS0OSS0OSS0OSS0OSS0OSS0OSS0OSS0OSS0OSS0WTTVGaWQAAAFScXCBjMi93PUCOSUKRS0KRS0KRS0KRS0KRS0KRS0KRS0KRS0KRS0GRS0OSTUSST0+YZh5hMR5hMS92Ol6kRWWqRmWqRmSqRmWqRmSqRmOpRmSqRmWqRmWqRmSqRmSqRni2VB5hMR1gMSpsMn23PWqmOmShOmajOmOgOWekOoS+PmaiOmGeOWKfOWKfOWShOm2pOx5hMR1gMSttM3SvPEKBNjt8NT5+NSlrMilrMnm0PEaGNihqMh1gMRxfMSVnMleVOB5hMR1gMSttM3eyPD5+NVCON2GeOS1vMypsMny2PWOfOlSSOCNmMhxfMSttM4C6PR5hMR1gMSttM3WwPCxuM06NN0GANUaGNjR1NHSvPCttMyRmMilrMilrMipsM3+6PR5hMR1gMSttM3SvPDJzM1mXOSVnMiRmMi9wM3SvPClrMhpdMDZ3NFSSOCttM3+5PR5hMR1gMSttM3izPE6NN3CrO0SENjt7NUWFNnu2PUaFNjt8NUeGNnOuPEyLN4O9Ph5hMR1gMSpsM364PXeyPIO9PnSwPHGsO3WwPIfBPnWwPHCsO3CsO3KtPHWwPIrDPx5hMR1gMSttM3WwPDJzM1+cOTZ2NB9iMS1vM3WwPC5wMyxuMzN0NC5wMy5wM4C6PR5hMR1gMSttM3WwPCttM0KCNjd4NBteMSpsMnWwPCxtM1aUOHaxPEGBNixuM3+6PR5hMR1gMSttM3WwPCttMx5hMSNlMjt8NT1+NXayPCprMkWENj9/NR5hMStsM3+6PS1rPh9hMittMnWwPCpsMxxfMSBjMUeGNmikOn24PSlrMjJzNCRmMhxfMSpsM3+6PVeJZSNkNyttM3axPDh5NCxuMy1uMyxuMz19NXm0PDh4NDR1NC9xMyxuMzh5NIG7PidnORxdNjl3PIC6P4S9PoK8PoK8PoG8PoO9PorEP4O9PoG7PoK8PoK8PoO9PozFPyH5BAEAAA4ALAAAAAAQABAAAAj+AAEEEDCAQAEDBxAkULCAQQMHDyBEkDCBQgULFzBk0LCBQwcPH0CEEDGCRAkTJ1CkULGCRQsXL2DEkDGDRg0bN3Dk0LGDRw8fP4AEETKESBEjR5AkUbKESRMnT6BEkTKFShUrV7Bk0bKFSxcvX8CEETOGTBkzZ9CkUbOGTRs3b+DEkTOHTh07d/Dk0bOHTx8/fwAFEjSIUCFDhxAlUrSIUSNHjyBFkjSJUiVLlzBl0rSJUydPn0CFEjWKVClTp1ClUrWKVStXr2DFkjWLVi1bt3Dl0rWLVy9fv4AFEzaMWDFjx5AlU7aMWTNnz6BFkzaNWjVr17Bl07aNWzdv38AlhRM3jlw5c+fQpVO3jl07d+/gxZM3j149e/fw5dO3j18/f/8EBAA7"]],
                           ["Geocaching HQ Celebration",    ["HQ Celebration", "data:img/gif;base64,R0lGODlhEAAQAOZ/AHyuOHGlOEqINf7+/T5pK12WN1WQNnOnODt9NWuhNzNsLzlmK2adN1CNNoW0OUODNXmrOHWoOG2iODV5NGieN2ObN0JmJj5jJk+MNjthJkaGNT5/NTd6NDJ3NC90NKGXNo+OM4GxOff69neqOIKyObrRvG6ecOvz3Dl8NH+wObnQvJnAYYOyRPv8+OLs12+kOE6KP1SPNrWhOf7VdzhfJlB6TIm1VEuJNoOzOcPaloe2Oevx7MLSvWGaN0CBNYq5OjZ5ObbRl6vLikiHNXmpXkRqNkt1Lfn7+EeETvz9+l+UZrKyPP/kqHqsOH6vPbTSfX2pdbvVjbnTn7vVmLPQjJC3eFmUNpu/gHapOKHGYabJajh7NJvBXMbdnbnTl0GCNefw3KzJoz1+O4a1OYe2O57DY97rzD+ANXWoPYe2Re3z7tHhzdTjzYixeIqyfEFgJr7XmLHNl36vOWGZN4axZLPPl0WEP2uccDNnLTZjKsneqVaRNkhrKv7FQv///////yH5BAEAAH8ALAAAAAAQABAAAAfhgH+Cgl1ZZCQrVGCDgwOCWg4kck1YaFKOgklPTy16IQAQEQESFHQigjk/OmVmoBEvCRQVBVV/Jz9jOCksIwewDD0FVgZsUWNwfnx9fXxLy30fRhhuXCFTyQF9IMx8yiAEMGkAXn7l0Mx7DX0yBD5OI0HJyh/MDTfQCwg2AXXJc9rMwviZAWKBGCES4iQr0OcNvT5M/BTJY8KFLAsW9ly4MCRDBho8/OAp8eeKMAP2NDw4g4CDAgU1BB0hEgPDDQ1fNqDg0MEDEjWDRLQRgFPnhJ5KdjAStAaKnS0TgNxRwSgQADs="]],
                           ["Giga-Event Cache",             ["Giga-Event", "data:img/gif;base64,R0lGODlhDQAOAKECACwsEaQlJf///////yH5BAEKAAMALAAAAAANAA4AAAItnIEJxhAPwzpPWPuWC5djuX0RWAneh5QQGmKdNLTvFI8ZcyQ3jjs0nwPyfoYCADs="]],
                           ["GPS Adventures Exhibit",       ["GPS Maze", "data:img/gif;base64,R0lGODlhEAAQANUkAOzs7WiUj/39/f/TAKkJC/z8/Li6vvLx8rSxuvb19u7/5L++wChYIMDQxNLwwU9eUxtaIlmsQbm3u4GJhPn5+c7Qz8/Q0M7g1B1XJfHx8eTi5AY3F+rq6////9vGdNzy1j+WNxEYWHrQUgAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACQALAAAAAAQABAAAAaGQJJQOBqMEIKhcigpgkajpZIzMoCuI41UuBiFAKDvKCEVjMLg75MEHVLOnnj8ORIposSrh0C4iv4OUVAFIxtXWFB/iSIjEwx/igcZbSMdjHV1EIxDSSMNkIkYihYFRA8XlCIRfyEjFUNtbCEfIbUhAXhKXrS2t61LIx/CtR8BtLlEUMrLUUEAOw=="]],
                           ["Letterbox Hybrid",             ["Letterbox", "data:img/gif;base64,R0lGODlhEAAQAKIGAAgICICA/+rq/1FR/8HB/wAAAP///wAAACH5BAEAAAYALAAAAAAQABAAAANEaLqsVS2aN6B0ZQRhI9Vct3wBQQiASJZnwTFZwJrVOz4z4dqORhE13kRDCDx2wphp2VIRlxVRjxW9ZAaD1KX32N68igQAOw=="]],
                           ["Locationless (Reverse) Cache", ["Locationless", "data:img/gif;base64,R0lGODlhEAAQAKIGAPmbRv39/XesnSBZEKDU4AAAAP///wAAACH5BAEAAAYALAAAAAAQABAAAAM9aLpWxRAW8GKc1Ern9KqewnVeMQgEMYBMYA6DirIifKbpKgk8Tgg6RsGXAgY/RONRlLTRGj7jk1lcXkaRBAA7"]],
                           ["Mega-Event Cache",             ["Mega-Event", "data:img/gif;base64,R0lGODlhDQAOAMIFACwsEaQlJZvL4OTk/+zs/////////////yH5BAEKAAcALAAAAAANAA4AAAM4eArcoBCIScVbNT8pQiigNwzM5H3nWHZnSnJegQYq/IU0eQBj718734Cgg+waKqOSB1Qums6dMwEAOw=="]],
                           ["Multi-cache",                  ["Multi", "data:img/gif;base64,R0lGODlhEAAQALMKABcXF8fHx3d3d6enpwgICNfX1+ViAPf39//eGQAAAP///wAAAAAAAAAAAAAAAAAAACH5BAEAAAoALAAAAAAQABAAAARTUMlEq6Vjoo2M51uiJMJlliOoctSYEKY5HkeyUgc8296XFImaiNLpIX7AmgRwowFbgEuUdgBKXKwgVXSNba+TQyBA03LBP2pNCZ4M1K129yK/RgAAOw=="]],
                           ["Project APE Cache",            ["Project APE", "data:img/gif;base64,R0lGODlhEAAQANUAAP///wAAAOfn58PDw/r6+mFhYQQEBImJiRUVFREREfDw8BcXF2hoaPn5+aGhoZiYmOXl5dfX1wEBASgoKFJSUpKSkpaWlra2touLi0lJSTExMR4eHiwsLKOjo+3t7cjIyBMTE2BgYIiIiE9PT1BQUExMTFVVVZ+fnyMjI5ubm6urq15eXnt7ewUFBXJyctTU1MbGxg0NDQYGBsfHx/Ly8kVFRQgICPf399DQ0AAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAQABAAAAZiQICQhRIaj8iAC8k0elqfZpMWOEmZlsAVGQpwhA6cFBKwzQAbhqnUVAU0E8lDKGg2AiQCYitcBTIGMS8UI0wwEQAiARcAIHVMAykDFTIFfAAKAAcJlwA1CzeXBFqdAB0YUkEAOw=="]],
                           ["Traditional Cache",            ["Traditional", "data:img/gif;base64,R0lGODlhEAAQALMKABcXF9fX18fHx+fn56enpzFgEwgICJe4g/f39wAAAP///wAAAAAAAAAAAAAAAAAAACH5BAEAAAoALAAAAAAQABAAAARJUMlJq71Ymp16v8Yhjl+VHEVaHAaRVKG6ti4FjGOL1BKwGR1AIoDYvSQdUqJYPCI9HqYTORAImk3LkIlYTicJArd0gZIz6PQlAgA7"]],
                           ["Unknown Cache",                ["Unknown", "data:img/gif;base64,R0lGODlhEAAQAJEDANDX9CQ8lwAAAP///yH5BAEAAAMALAAAAAAQABAAAAIznC2pxwgPRUOh2gAkE1bZvFXawGEjWYGo2ZRSqbZvek5obN+1ze18kpsAgwcOLmf0CX0FADs="]],
                           ["Virtual Cache",                ["Virtual", "data:img/gif;base64,R0lGODlhEAAQAKIEAP8FBebm5gUFBf///////wAAAAAAAAAAACH5BAEAAAQALAAAAAAQABAAAANDSLrcTiLGt8QYIQtqrw+bY3WDBVZKN17nNqklK0El6WFjGgMen1c7AK8m6gxLnMAN9xAob5pQ5Qk9TUHPjDU1k8wICQA7"]],
                           ["Webcam Cache",                 ["Webcam", "data:img/gif;base64,R0lGODlhEAAQAMQSAF1dXSAgIJ+fn+Hh4cHBwZCQkNXV1aKiojIyMgkJCRQUFElJSdnZ2e7u7vr6+vT09JmZmQAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABIALAAAAAAQABAAAAVpoCSOkmGQqPgAQBSxTyo9kWM3eBST9PMswERuN6vRCowBQ9jQqWqLAwSSXDZ3NMfCMaUOhM6irTZdMq6jrDbIKITTtdtQRnPZibJEIICQoVwBEX4iLgSGAi4ycTYODAKIKS4Kk5QKgiIhADs="]],
                           ["Wherigo Cache",                ["Wherigo", "data:img/gif;base64,R0lGODlhEAARANUrANjY2PD09z5woZiYmPDw8JidoZCQkICEiKioqPj4+IiIiC9lmsDAwJeyzFR/qGqRt+jo6Li4uKa908jIyJSjsoybq9Le6Xl9gIuXoqmtsJOeqiBak6S0wyFbk9DQ0KCgoJyru4aZq46mvJKaoeDg4LCwsICAgDBmmoiivf///xJQjP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACsALAAAAAAQABEAAAaUwJVwCFmRGIDEcLkCDEyllWkaZZZMCpRWe1iVSMNrAXVSmU8d1AAhJJlGKLP8jCoKDeT5/FQhSFdleg8bZiglBBFxcgsNARZzGW6KKhIplg9zHJJyAgEpAXoUCSaTKp0NewUrH4BzAgtzDlUKDoF6KicaAEIAB3l6JyJsYRe/uCcgEUwrEwaqKCEYAx7LQwQMYGBLQQA7"]]]);

const attributeIcons = new Map([[-66, ["Teamwork not required", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAIXElEQVR4Ae2dA3AszRbHt+qVXtl6DDcbG9e2bdu2bX26NuLrG13btm3b59v/rZrU7mxPz0xmk+1U5l91Loa1v3SfPn1Op9fCUt+Ef/9zapj/zGWR1ltbYgO+7Iu3/TyaYKOiZPjM+OxgABZgYjeL3FwOTA2zTsmIDfjq/EDTwARs7GZxtNx/JDds+I8/w61HTFh8AyOwspsFZpH+YcLTB9FuFhj++NVtTTD6TOrOvwYMns9bFWWlGC8v8vnf/4uURXl5UUOrD62Msir6RLCzYIRRoz033J/88OAiaL52Gxbsx+QCdhYM0/ITB+JNiDKIzJYIdhbEOvIT7Wy+ZD9uQnQwdGc5D7CzsIJk9P9Yby8ToswnsoJtC6NvSzeZEGXGYsUDaByiCdA4RBOgcYgmQP0QTYAGIZoAjUM0ARZ+iDZ/f1EB8iEmVilJx48coY8fP9Kzp08pY9s2KlOiZIFA8/f2oVkzZtKtmzfp58+f9OTJE0pJSqaosHDRAPIh3hjVn+jHD5L04cMHali3Xr7C8/PypkMHDxFLABkfHSMeQD0Qb926RTY//3wDOHH8eOIpKzNLTIASxH0V41QhNqhbN98Anjh+gnj69u0b/KKYAGG701LpTP2KXIhDBg5SvD84wEZtWraiQH+ry7lK5ctT7Ro1ue9/9eoVqalKhYriAly+dCl9efyQC7FZ48bMewN8/Wj/vn0Eff70mbp07Jjr186dPZt7vGkj9v2wUydPEk/fv3/HD0dcgK2atyBICeKFwT0oNMDGdP4YqSVdvnSJrD6+uef79upNkt6+fUu1qlVnvn/q5CnE064dO8X1gZIlJSZyIc5hxInJiUkk6Ye9ldavU8fluWidkp4/f07ly5RlhjAnT7Bb4YsXL6hEfIL4AGFjR42mhw8fEiCerleBC3HRgoXkqFUrVjKfWa5UaUIXlvTg/n0qHhfvch1G+b/++JMePXpE0Ns3b2jzpk0UFx0tYhzItzL2D12/VEnKKhbs8o5N9atQyrpEctTjx48pLChY8Xkzp08nR924fp2mTZlCo0eMpAF9+1GXTp0IbgQtGINF1UqVOc8TGKDv/70IMZckxYFl9ACnEKdb5y7c52KguXr1KukQWi1Cp8IFcMXy5SRJK8Sc7GxNz27coCFhiqZH8H/lSpcpHAAnT5hISvry6AGdYfjEy8N6UykdDn7dmjWkV7dv36aYiEixAfbs1l1qHbohztGZxUG3XLd2LSGs0SrEiUHWADEBomt9/vyZtOhEThZlFws2DBGGwBiDiFZlZ2XBR4sFsGK5cvT69WvSqrSUFIrz9qKtMQFugYiYUI9WrlghDkDEV/fu3iM92rxxE+51G0SEKzoFX+15gCG2QDp37hw56uvXr6SmrIxM3O82iHVq1iI1ffnyhRwEXw2f7TmAmDbt3rmLHHXt6jVq0bQZqWnnjh14htsgNqrfgNSUuG4dTZ86lRwEnw3f7RmAGAEdhTloZGiYlrQS5rW4ThPE2WHqELX80AYPHIhrkU5DVoYkwXfDhxcowJnTZ8izHE7hAf7P09EjR3Cd2yC2b9OW1FS5fIXc6zt36Og0r4YPj42KLhiA/fv0JUelp6WhOztdg6IOT6dPncJ1boPYtXNn4gkJBfk9TRo2wnGShJwjErr5DrBls+aotBGETIrSNTxdvHAB17kNIvKFPO3bu5f5nupVqtLTJ08JwuwGMWW+A5RClwH9+iueRwYEeT0lffr0CYkBt0Gc/+efxNO8OXMU31O6eAlkv8VKJmDOCUfNE0ZOXOsOiBjAeALgQpWNGTNyFKkIuT1caxgi/BaqbTzdv3dPdID88iLHLxmG2Br+VoMa1qsvPkDJp2gQVipg9DYMMaNJLSKOv5WVCsQHiK6pUVLxyDDEG6MHqkFEIQo/MPEBXrlyhTQKZUjcU2AQ27ZuLTZAxFV6hLk07nM3RKWk7vr0dLEBLvjrL5IL8eDwocOIIWSTUVTPM8R95WOYEHMyMylzWwbJ9f79e7FXJjx48IBkQoSPc4rLzvjrXfh2aMtmZnlgWdk4Kl+ylEsKC+rVvYeQADG3ZLawmMgop2Ufck2aMCFP78NMBgkBpRrLrHB/WsToEaj+CQlw7erVJNeUSZOdrjl75gzJtT0nJ881GLVC1bzoIHr+9KlLYjUiJFQsgFgI9PLlS3LU3bt3scxCNWuCfBy7yKMvpQaIx2qUcvks6XUquYzOwwYPEQtgh7btSJLaKgNkreWqUbWq7ndiJiPXgNataBtjpeypfl2cIMIfCwVw04aNmhKmMKxhkWvcmLG6WzxmMo5C/Ilz8T5eTIg3xgzKhYjIoFhsnBAAMZnHanynYg3W73FqKZjcs4pMmg0zGJmQE8Q5rRCxnloMgPJkZmpyiuo9o0aMkK9d4d+jspDyzp07UjypFSIy0AIAlNU/0K20/CoBFnojq+2oKhUraX6nrBqIQF06pwciCvKeBRgdHuGUi8PImNdWhOUZWn8X5N27d06//yGN9nohzp01y7MARw4f7rRiVM80KTQwiN68fkOStm7ZouU+zFw4gbg+iGcGdCNfTwLECilp7XLvnj11+5Tf580jSejSWu4BMEmoP2N1BI7nFeLscCv5ejqM4fsvrgtwGsG1FLgxc5E0Z9Zs6bghiJj2+XoKoPimH6IJ0DhE4wBNiMYBmhCNAzQhGgdoQjQO0ITIAaiw+ZgJUQYxWmHzMeb2dw2t8gK0CXE5Y/9AsGNuwLgySpreFE1L8JZDZBvYKW0Bim0vizzEDBWIYMfdhBYtEd05qohuQtvR5ksHwYKzCS0AmtsgG9gGGfBg5kbcRjbihplbwRvcCl4y88sI9H8Zgdx0fB2G+XUYfwPeuhzuXZGctgAAAABJRU5ErkJggg=="]],
                                [-65, ["Not a yard (private residence)", "data:img/png;base64,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"]],
                                [-64, ["Tree climbing not required", "data:img/png;base64,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"]],
                                [-63, ["Not recommended for tourists", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABO1BMVEUAAACWMCe3NiiJLyafMifDOClxORy0NiiJLyeqVVX///8jHyB7eHnKOSkkHyBTUFCrqaqHhYb//f0zISGiMydVJyPAvr+9vLy5uLk0MDElHyCVk5R2dHQvKyx6LCVnZGWdm5w1MjM7Nzi7urpXVFU2MzRhX19QTU6Miordf3WRj49IRUbGxcVZVlf55+U2IiGRMCY5IiG2NigvLC3RUkSOMCaenJ3RU0Xdf3Q4IyH56ObdgHa0NihoZmbBwMCBfn81ISF/fH1NSkqSkJC/QTOjMyeQMCZ+fHzFxMTFOCliKSSNiYmzVkxfXF1VUFC5t7iAbWuUkpNYVVZVUlOnpqb//v6koqMkICHy8vLDQzXv7u6DgYFEQUKfQTcuKis4NDVMNzaWkpO4WU40ISGgMydoZWW3NihlKSTGOSmEWMHSAAAACnRSTlMAyfqN3/4J+YgDWYwqIQAAAihJREFUeF6t2dWS4zAQhWFNbMcZyQ7CIMMyMzMzM/P7P8FOq5z1bJ30rLeO/pu++8ol+aplfPUoTpOcKEnjqG7+1KjlAao1Cm5yIg/UxKQHwSNE8Rp5wBrG1Ivzu37JEfUGfa/U6iYa4YdmHVNz0SuRiWXcDiH6b4xNKuPOuQDiQIzUJDJ6BwOIPSESk0vOhRA9VYAgsiCILAgiC4JIgyjyIIo8iOL9Pe2/urqjGqiIM0ML7duoDKI4bTF7oSqI4k47tv0VQRQvjwc7FUEU5wSYcVs6KuCJiiCKHIjijc8ciOKXLg+ufs+yFbd3/tE1EU9tihfnt3RTwFuZ74pbybLzq9uCC227Wct1rD1zshDVdrmWjPbCNuDQjkAQVdAOdXDJliCIKmiXVHC5BKUDx0AcCy6r4FoJoqiDayo4VYIo6uBUFRBEFgSRBUFkQRRJEMTdXRZEkQVRZEEUWRBFFkSRBVFkQRRZEEUWRJEFUWRBFFkQRQ5E8WyXBVFkQRRZEEUSRPEuB6J4b/af4LQCKuLxB9b3UAXnFFAT33c9+FgFnwBY5X+0T1XQPVNAXXxu7Qungy87rwBUxddefPPW6aD0bn39g/vYqtCnI/5mmhr4/50uRQBJEUFSRJAVAaRFAGkRQFoEkBc9VSzTQohfRUpMKmPgAojfREpNLKPf5MTDIvriYmW6yIo/CjAaLXX7A+ocez9/FUvd0Gvn0Ivx8Kv78I8LwZ8/fgOG4k9Yjn9eNQAAAABJRU5ErkJggg=="]],
                                [-62, ["No seasonal access", "data:img/png;base64,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"]],
                                [-59, ["No food nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABsFBMVEUAAACJLyfDOCm3NiiJLyafMie0NiiWMCdxORyqVVUjHyD///8lHyDKOSn//f0zISFVJyPl5OS8u7soJCUkHyCiMyfp6eloZmb+/v755+XBwMBgXV6QMCbc29xsaWrX1tZkYWJ6LCUsKCmzsbJoZWX39/f8/Pzv7+82IiG2Nii1NSg3IiG0Nii9vLzdf3TRU0Xdf3VqZ2hmY2RlYmNraGlpZ2fRUkSPLyaRMCaOMCY4IyF2dHRnZGU5IiH56OZEQUJMSUno6Og2MzRPTE2pqKijMyeCgIFZVleNi4vVdmv09PSfnZ3c2dqoST7Ze3DW1dW0s7MnIyQ7NzjKyck1ISHOUEKOjI35+fnl1NLGxcVpZWU8OTrT0tLFOCliKSROSkucmpsvLC3k4+PPzs5ua2wzLzCop6ejRDn7+/twXFuqqKndfnNKR0i9urrFZ104NDW/QDLdgHbX1NSAbGrOcWf+/PzZ2NjMTT/Ww8Hb2tu9PjDl5eVhXl41MjNtamt0cXIxLS7a2tpJRkfR0NDx8PGJh4gpJSZeW1x0cnM5NTY0ISGgMyfp5+e3NihlKSTGOSksMZa7AAAACnRSTlMAiP76jd/5yQkDAJIoTwAAAnVJREFUeF6t2VVz20AUhmHFsRznrIwQZiwzMzMzMzMzM/cv17tZ+YurdqJ2v3dGc+6eWelCF2c9UzrppxIZhxIpP5n2ajU0Zgg1NliuuSlDqqnZgPDcRfO+GWLVt07b77d+nziUy1eM0pj2kiG+KBCXyv1GSXq+HscZojmj76X0ODGNIOa1kfISeuQmEcScJhJeRifyR7G0RmT3ntiioSwYFVu3lqR4aaVcabsmm7pvim3VYGF1cWMMMCIWVJ90q07pqD6PVY8Feg6qam0bJgSjYotqDcHqfCGmo1uUaWRtHBBiFLQnPKBs6+KAEKPgPDHtCsGzsUCIfwOLIdgbD4T4OzhbTNP/FYTIAiHWg/P/F4T4jQNC3JwdD7a6gFa8eoQDQtweABxyACF2bauBy1xAiDuyOw+Pqgd7h51AK+7X4oysBeY4g3JoJkQK2LJivDiXACqIFPCYUu0LauJJd/CUgqhGS+7g6TMQ758Td1DOXyiE4sXACUQtodgVsECIJFCLTyBSQHV5ihYXBjSwb6oVaaCEIg2siTQwFK/TQCveyHJAiLOyLBAiC4TIAiGyQIgsECILhOgMQrylxdt3aKDcNf/HewENXNpuxMUBDVQQSSBEEgiRBGrxIUQKqB5NhkgBe5dA5IBixTINhEgCIbJAiCwQIguEyAIhxgSfGvBZHdhpwA6JiHHAQe0NP68DBwoafCkRMQ746rVSI0NS35u3be/eC4I4MSgfPn76LJEGzIiKhrLLNHHJil/GlmkpPfJCEL+Orft8PSplN3G5Fk2+XZn2u4rfLZgMl7qVvNN3zP34aZe67LUzezHOX93zLxfo1x+/AFQNW7J391nYAAAAAElFTkSuQmCC"]],
                                [-58, ["No fuel nearby", "data:img/png;base64,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"]],
                                [-57, ["Not a long hike (>10 km)", "data:img/png;base64,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"]],
                                [-56, ["Not a medium hike (1 km–10 km)", "data:img/png;base64,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"]],
                                [-55, ["Not a Short hike (<1 km)", "data:img/png;base64,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"]],
                                [-54, ["No abandoned structure", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABZVBMVEUAAACfMie0NihxORyWMCeJLya3NijDOCmJLyeqVVX///9oZmaRj48jHyCrqaolHyD//f0kHyDX1tbKOSn56OYzISGiMydaV1dVJyNTUFCHhYb//v7RU0VZVle5t7hhXl7Ix8eenJ16LCX55+W2NihPS0zdgHY2IiF2dHSRMCZXVFWQMCZkYWK0Nijdf3U8OTrRUkSPLyb6+vpYVVbdf3RKR0iOMCbegXc5IiFbWFg4IyHq2dfKyclkUVDGxcXdfnNiKSS/QDK1tLS7p6bJSz2jMyetTkM1ISHISjzFRjhFQkKopKSnpaXPzs7r6uovLC3FOCmpqKhgXV7f39/+/v7DwsJ3c3OWlJW8PjB1c3M3NDR0YF7OUEKrqKlVUFCgQTeAbGq1NShoZWW8PC5iTUurl5VbWFm9X1Xh4eHk4+PAYFW7qKeRjo5GQ0PWw8HMTT+uUUc0ISGgMyetrKy3NihlKSTGOSlyaXQiAAAACnRSTlMA3/kJyY36/ogDjuEMjQAAAmNJREFUeF6t2VVz40AQhVHZjuOkBWYMZ5mZmZmZmRl//3pm2re2ytauJd3vVVWnhp5anq1QzOVL9QyV8rliwUNTk3VCk1PKTU/USU1MWxAeQbT7rRPr77qg53fqTJihZqflzrHgFQf4unKYpeqyVYpezmBXGaJdY87LG+voJoLYMUbes++5uYYgNg1R8uqmMGSIlhqAEGkgRBoIkQZCpIEQaeDGxixEDiiNuxA5oGCNLFAaZyFyQDlwEiIHxK5poDTs63n/KIoiDijuPR6piJBAfeE7KzQQori2ZAYhcsD1/Q7N/iUuBUEs4/vn/wmiBkRbLCgS/A98N2/78BBiRjBS/8RWJx7v9bPAwuGlLOD8CifeBrBWDmYCxYmnywClZi5scOntoJ0QVHFDGaAJQiBBUhAiDYQ4GrxcqyUFIY4ETUlAJx4z4rYyDZSnz1TMAj73ff+SgouvzhnxzYWLi+nB7YJwjpsrgvrAle61RGCcCPC6yJjgjSiKbkqMCLAn44EoRqSBEBUJbqUHf/h3hkSUBuzpB4iJwV2uewouhPd92wMVuyqMDaq/Q8FV4SBd42MaqLt+Uk4Hzg2DKu4u00CIacD2KBAiDYSYHNw3DDrxhYosUF6udGJS8HUc2N3vxMq4YM31NgbEOa6ujAeieBAiC4Q4QwMh0kCIJBDinhkWCPFjLDhXG9kngPoBff5ijK/VYTBt+sKrNBAiDYRIAyHSQIgO1GEaQ/xmpJIb93VCgvjdSHk3kGxVs4l7jWjL6ch0Oav4U8HiYKjb6mQ6x+av3zrUZY+d2YNx/uie/3OB/vvjD0cXkAs/lOT+AAAAAElFTkSuQmCC"]],
                                [-53, ["Not a park and grab", "data:img/png;base64,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"]],
                                [-52, ["Not a night cache", "data:img/png;base64,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"]],
                                [-47, ["No field puzzle", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACzVBMVEUAAAC3NijDOCmJLyeWMCe0NiiJLyZxORyfMieqVVX///8jHyAlHyDp6ekoJCX49/jT0tL9/f0zISH7+/vKOSn+/v4nIySRj48/Ozz6+vr//f3Qz8+iMyfy8fH5+fkmIiOzsbIkHyCPLyZVJyPg4OBcWVqYlpYpJSbm5uYzLzA5NTZZVle8u7suKiuGhITy8vLX1tYkICGdm5zv7++PjY7Ix8ctKSpqZ2hNSkrx8PFaV1d0cXJOSkuxr7Bwbm6OMCacmpv39/cqJiehoKAwLS3s6+uUkpM3IiHk4+ONi4wvKywlISIpJiZgXV709PS2Nii1NSiQjo/l5eVtamtAPD1bWFmBf4CpqKimpKTj4uP4+PitrKx6LCU3NDTS0dG5uLlHQ0THSDq5t7hoZmZkYWJ0cnOOjI3Av8BGQ0P55+UrJSZLSEnz8/N/fH2joaKbl5dVUVKrTEKBfn/T09NKR0jAQTM8ODlTUFA1ISH8/PxbWFi5OiyRMCa0NijdgHY4IyHRUkTi4uImICG+vb2Eb26ura0nISLo6OjGxcZUUVGwr6+bmZrW1dWamJi4OSvLysrFOCljYGFpZ2f29vZnZGU1MTJiKSRMSUnt7e1VQD5BPT7df3Xdf3Q2IiE5IiFRTk9PS0xhX1+QMCaLiYmgn59eW1ysqqs0MDGZl5fc2dpdWlujMyfSwL5XVFWqqKk0Li+tq6uFg4OHhIVLRkegnp6AfX6amZnEsa+koqPY19e7uLg2MzTU09TDwsJ3dXVIREXLTD5lYmOUkpL35eO3OCqvrq5fXF21tLSPe3l8Z2bGRjibOzBKNTMuKCnn5+dNODbYe3E4NDWlo6RPTE2Ni4u1oaDERTe6W1FubGzZ2dliYGCbmJnq6erBY1mzsrLc29ze3d2ciIfBwMAsKCnHxsf19fXZ2Ni6ubl2dHQ0ISGgMyd7eXq3NihlKSTGOSnZskSlAAAACnRSTlMA+v6IyfmNCd8D3ehT0gAAA91JREFUeF6t2QN7K00UwPG0vUlzz8SqbdvXtm3bNl7btm3btm37M9yd2Zm22dPsvNPd/wf4PZnkPLN5zjpYqS63MzlioWSn25Xq6C4lKWJDSSmcGzggYlMDBjIQeRZEdt6IjWmnTuXf3937iIVCRdlMSUp1uAR+yEOsVLCIKS6Hm2IX2CGyz+h2OKl12WEbxCJqOB1snkPX2iCG2IQ7IjRC7BAZxUEkWgXNxZKRgfdmZDVuUwDNxI93Au/8ZQpgQvGLMHTnn6wAJhCrcqFXm9qVQCySqzogLu9iJRCL+WDoFhUQi5cGjeDFkxRALHYB6kYFEIulGKxVALF4HwbvUACxOBKDzQogFudgcIg6KMSbPORy5EX3qIBYfMYIPktUQCx2GgZxQbsaiMXp8eBmogZi8aSTe3unElUQi6eVhgXnv5lYAcnYafqpZ3MvfAOxBArx7TuBVz+rP2DFRKN4TaYQ6z6ZEEfEKqTgxKXgXzJ3zleDKieNaK2895Tl8SIMr95xa/rtoyak772kduE5uTBYBrZBfOuPxYm4uyTgMFAUx0vA20BRHCYB50EC8fOnpvQJjpGApYC75yAVC+9/AHDwoAR8CHsLY/r0FHraohgcIgFXI29cKyFCbMRgiQS8EIEXEa0332LihnEI3CgBrzd6/jLN28Knp3ArAislYLoRLNa8UUHg4nbj9ATzJKAvaADrNXAXm57dVLzaIJZLL4cvGbM//8CsmcepE/Z6vVdQIHjlNCG2zE5f9ROwqqXgGqqsXUftxafHP4/HcvEMdswzs9jUSMG85rPOFhfp39DTufQ2O4+JD3Og85HBj6pdsBVRED3GiMf139qjfGOLyoWXz4AnYD0S1cAnuZfzNAXGAHBxqKef4HwOzqVeLQASFcGyBRx8TvOeD4MuviBEdbAKeC9q4EvAe/kVLqqDrwrjNQ18HURvTEWiKeirERdFuPf/6moQjX5HF99dVvN/wJlNEOjyacKgchAVBwKBHOgu630mfpDZVCUHP8ylgvejtKUZkLC6Tz+j4pHM+Q1ScDrgYCUhZAV6clFxshTMMgOx+LUU/MYMxOK3BTIwwxTE4tACc7AM+uq7tLS07yGRaArWgDQsmoEjoH8iBkW5auJyXTQBfwClfpzKxYRgoxpYcpSLCcGfx+f/Ul/szRmeEe0Bghn+X6fw6nI6mkZ7ZxT/tqTl93l/ECJEBOIa8mI+ny+W10BME6IO8mUaUQ6Lf+rLNCcFi4gN4l9UcuoLyewCa+J1VGS5+cp0kVXxHw66xFI3uyhkBQz9+x9f6tq9drZ7MW7/6t7+lwu2v/44ATIWAMp0btehAAAAAElFTkSuQmCC"]],
                                [-46, ["No trucks/RVs", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACOlBMVEUAAABxORyJLyafMie0NijDOCnKOSmJLye3NiiqVVWWMCejMyc1ISEjHyAzISFVJyOiMyeRMCYlHyAkHyB6LCXFOCliKSS0Nig2IiGqSj+Ae3yQjo+cmpukoqOtq6u0s7O9vLzAvr/CwcHEw8PGxcXGxcbBwMC5uLm1tLSysLGura2pqKifnZ2Zl5eRj4+GhIR7eXpwbm5jYGFPS0w5NTYlISJKR0h9e3unpqbJt7XOUELdfnP//f3////9/f3o6OiamJhyb3A/Ozw7Nzjl5eX56ObRU0Xa2tqFg4MtKSp1c3P39/fn5+dWU1RIRUb8/Pzdf3T19fV4dXZ7eHl6d3jKycmXhYPCRDa2V0ySjo7t7e3MzMx5dneUkpOQMCaVk5Tb2tuUkpI3IiG1NSiTkZHZ2dl3dXV2dHSSkJCWkpPZ2Ni4WU7Y19d0cnPdf3V0cXLw8PDg4ODdy8nNTkD5+fnx8PFzcHH55+XRUkRxbm9vbW1ubGzd3NyIhoc0MDEpJSY+OzvX1tb+/v6KiIg9OjtpZ2dJRkcnIyTz4d+MiopBPT5NSkpua2xOSkv29vbz8/NVUlOzsbLdgHZgXV4oJCXv7++qqKmsqqvf3t76+vpeW1zy8vJoZWXl5OQ3NDTp6elsaWq3trZ+fHyHhYagn58vKyw4NDUuKittamumpKQ4IyG2NiiOMCa2tbVdWluEgoJCPj9CP0Cgnp4yLi+trKxcWVrc29yxr7A0ISGgMyc5IiG3NihlKSTGOSncWsyNAAAAC3RSTlMACY3f+f7/iPoDyWgbj3cAAAL+SURBVHgBrNLFgQMxAENRmdneDfffaECBBqw/dHtjAjPW+RA3Ct5Zg18pR0E5gaHUKKoWgvREIucbhSXA5MhaHxvN9UclG9gv/n8YOx1PVCzc63NWiByjg399LleBuF6GB8/zvAnEyROO+GoMhUjqCyrER2v22Cc3AMRxvHg8tW337Lt/bdt2e7btq20bx1rvrZ9N0jns5DbJ5LfWd61JT1AQ1aBSFEBZ1ICyqAFZ1IP2ohJkUQ/qRRFkcfyEiZMmT5k6bfqMmbNmz5wzfdrcefMXLJy8aHFYeERkVHRMrFMwLj4hMSlwVHIK+mvJ0hnLlq8IBa5cvAoAVq8RRLG169b3B27YCMCdiE2b7cEtW4Fe4jYn4vaVtuAOwIsYbgvuhCdxmS24C5KoB3eHme3ZGzhl337jwG6+/IEw7mAI8BCMDvd+hR8x3jNHGTxG3DJn4HE+w4mTLDKItc7BHQwGiSrwFAkigzjtHDwTDLLoCTwLo3MkiOcZvOAc3BAMspia4h0MI0nkV3iaczBdAlnMSHENZsIoK7tvObk9xLxsLj8EWAC7CotYDM4LyKI7cDk8ifZgMTyJ9mAk3IsKkEXnYAk8ifZgKZyLSrCsPLqismpDNYs6sKY2lurqSxuocWITixqwmVp2A8DBi1TMt9EJeEn20hovX4HR1Wt03RRvpCjAm7fSgNt37uYD9yor7rMYGnwgeg8bHwGPnxCtfAo8oxlgsXdhwWDjdAl8TseBF4HTXwKvaBEkUQaJXr8J7i0tBN5Zn0bvKdCHj4HLfBrh6BesUC0wP7DbCjSTKLa117kBW7YCkzo6u4CaDpLESODAZxcgdcFqEpEkfgHQ5gaMnWJ6dxpJFJ3fQu7rgm9p3x9QdyyOtHkMPcQipwRZlEG9KIMqUQ+yKIMaUQCVogAqRQFUigKoFU3QHKb5If4whmnmuG8o+SD+NMZ95kBy2Eid+MsQAw22RqajtOJvCxz0f6g7bKjqcRzy56811PV/7Oz/YNz/0b3vCxf8XfzxD067pgKBW1PeAAAAAElFTkSuQmCC"]],
                                [-41, ["Not stroller accessible", "data:img/png;base64,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"]],
                                [-40, ["Stealth not required", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACalBMVEUAAAC0NihxORzDOCmfMieJLyeWMCeJLya3NiiqVVX///8jHyDKOSkzISHh4eH4+Ph4dXZVJyNzcHHRUkQ3IiEkHyAmIiP55+UvLC0lHyD//f2iMycoJCX7+/v6+vr9/f35+fk+OzssKCmfnZ0uKivZ2dloZmbHxsfp6embmZpOSktDQEHs6+syLi/Y19eEgoLz8/Pl5OR+fHyNi4v19fViYGBNSkpdWlvAvr8pJSbKycmWlJWJh4iBf4AnIyQkICHe3d3m5uZUUVGnpaV6LCUlISJRTk81MjOLiYkqJic8ODlcWVqcmpuamJjx8PGdm5z29va2NiiQMCb//v7df3Q4IyG0NiiRMCaOMCY5IiHdf3Xi4uK1NSiPLybdgHY2IiE5NTbg4OD49/iTkZHOUEJ9e3vr6uqzsrJAPD07Nzi9vLxlYmNxbm9raGm1tLTFxMRLSEmMiorPUELw8PBVUVKYlpa/vb7WxMJFQkLf39+HhIU1ISGjMyd/fH1bWFmUkpI1MTJjYGHc29zk4+Oxr7COjI22tbWmpKTFOCk8OTo6NjfGxcWePzbn5eXNzM1gXV6ysLHZ2NhBPT6PjY6sTUPo6OhiKSTb2ttvbW16d3iYhILKSz0rJyhIRUZEQUKgn5+SMij29PRfXF1ua2xJRkekoKE4NDWkoqPT0tJ0cnPt7e3DwsKUkpPJyMitrKxIREXMy8s0MDGtq6v+/v7T09OQjo/Lysp7eHlwbm7u7u78/PzBwMB3dXU2MzTegXfcyshDLi23OCqSNCswLC0tKSpkYWLGxca3Nyk0ISGgMyd8eHm3NihlKSTGOSl+8yR7AAAACnRSTlMA+Qn+34jJjfoDlfcTfQAAAwlJREFUeF6t2XN/81AUwPG269btpJ5t27b92LZt27Zt2zbf0/MkzZqtZ812cvN7Ad/PRe4/JxohnUGv9TAy5KHVG3QaZ57eRhXy9hQ5Hy+jSnn5CCDyGERhv0YV+79rnXh+a1ZzDJlsoY5z1GkMXfjwYI4l/zpBMWj0PLZDDVFYo16j5a1jw1QQbbyh1Qjfs2m8CqKJJzw0Rj6OU0MUKBFEIiuIRFYQiawgEplBLLKDWGQHsbjOHBU/fWtCan1MgzV2flr4vBgKiMWwNHDpMAXEYiu4Fk8BsdgGqGgCiMXjGFxLAJEYDbgiAojEqYCbdIYISuKg4FmAg9lUUBIvXAQcbCeDkjgkBHDVRLBvcQEdlBdzFYATbrYtWz7FjRhhLrlX1hpGAaMjeSDQVxJxiaQVPo3oSzQvIYHcjMkTZcRXifZm8qVwO+0RWe8XuYiR08ywLz+OdClSHd84v++8eORXeY51ztyNDTMDuELoFAE6uDKD4/zGOF6hE7gMCxWDuxdzWFwFdsXgUihwimO7xCJYoRQ8dBdKOVcx3QJlFYrA5vUWgKwNrmIyAGwqVAAmbAa+LVxPMcUCfNtaiGDqaxBr6iHuqgZHeU2UtxxTGgXOYuslcc9ecFa1v/9g3AHo1sGvkjhKejMDrJQtl0P3jtZmnjh56nQPMeks7VJyABXo201MOke95fOyYngNRwWLM+TEXAUv5RK4F7PD6GDFlWz34tVrNLDFfv1GlKRgcVzIrdt38uP6B6a0VyEGi8LNlGQ29gnef4AI9yKAJbZYHnzYAUAS4ZE8WAtAFB/XyIEFkUAWn1TKgM8A6OJz9+ALAAXiy3R3YMBoUCS2uwOtAGRxMADkNSIQLZAmJvcOvgFQKA542xsYYAZF4rv/YmdvYGUQuQ8feeLT56AvCFTY0IG8McIfnyGriEBmEYHMIgKZRQSyiwIlDtPUEH84hmlaHrRxKog/eUnrGEiG+rOJI3lRSC+OTOtYxd8iaOga6obamM7R9OevONRVe+ys9mBc/dG9+j8XVP/98Q/pDZF8J7eHDwAAAABJRU5ErkJggg=="]],
                                [-38, ["No campfires", "data:img/png;base64,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"]],
                                [-37, ["No horses", "data:img/png;base64,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"]],
                                [-36, ["No snowmobiles", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACT1BMVEUAAABxORyJLyafMie0NijDOCnKOSmJLye3NiiqVVWWMCejMyc1ISEjHyAzISFVJyOiMyeRMCYlHyAkHyB6LCXFOCliKSS0Nig2IiEkICFaV1d8enpbWFklISI0MDHLysr////Pzs43NDSzsbK7urooJCX5+fn9/f0tKSoyLi87Nzjd3Nzl5eWQMCZcWVr6+vr8/PxkYWLX1taFg4NNSkqysLHV1NW0s7NRTk9pZ2evrq4pJibT09PT0tI8ODldWFns6+tXVFXAYlf//f3j4uM3IiG1NSjdf3Q4NDU6JCPPUEJqZ2hYVVa8u7tPTE355+XRUkSDgYFKR0h+fHyCgIHKyclBPT729vZCP0C2tbWmpKQ6NjcnIyTm5ubdf3X49/ibmZozLzDx8PGNi4z+/v7z8/ORj48uKivf3t5OSks8OTru7u7w8PBdWltTUFDR0NBoZWW/PzLGZ138+vra2tpzcHEmIiNoZmaAfX7s7Ow8JiWWNy2gnJzv7++HhYbEZlzr6uqIhoelo6SsqquMioqhoKA5IyKUkpJVUVJubGw/King4ODy8fF9e3t7eHlKNDPDRDYsKCny4N7JyMhPS0yQjo91c3NDQEHdgHb39/eenJ1hXl77+/txbm/W1dU/OzyJh4jafXOVkZGOMCYvLC1vbW2PjY7U09TJSjzMy8unpaVfXF1APD3QUUN3dXU5NTafnZ3Ozc62WU/X1dU9OjvAvr/t7e29vLxbWFjGaV93dHRHMTC4OCo4IyG2Nig0ISGgMyc5IiG3NihlKSTGOSmOCSPtAAAAC3RSTlMACY3f+f7/iPoDyWgbj3cAAAMTSURBVHgBrNLFgQMxAENRmdneDfffaECBBqw/dHtjAjPW+RA3Ct5Zg18pR0E5gaHUKKoWgvREIucbhSXA5MhaHxvN9UclG9gv/n8YOx1PVCzc63NWiByjg399LleBuF6GB8/zvAnEyROO+GoMhUjqCyrEByv2oB04EIZh+Ar+5UHdr7Zt27btrm3b6hpd2761ImmwnWTazOx7HDwxzaC8yIKsKANKiwwoLzKgvMiCciIDckRXN3cPTyHQWvTyBuDjKwJai35YzF8QZMWAQAUMChYEGTEEaqGiICOGKV44iYKaGKGKwRQZBSA6Rgxkxdg4ik9ITEomIZAVU4DUNPETmxXTAWRkyoOamIXFsnOkQU3MzVPEfBlQq6BwcVyRIka5SoKMWCwJMmKyHKhVUqqJZaRUXiEHVlZVL4k1pFSLOimwHprY0EiLFaOpWQZsgS5GtbYRUTvg4ykBdkATO/PQ1d1D1Av0iYPt/TCLGBgcGgaiRoTBUeBfEWPjAIYnRMFJMKLa1LQYWAZN3LQ42eYt0Nu6bfvK4A4gqpJM7cRSu3Yr18yevTDKr0tbCQzYBwwHk9F+LBVUU6CIB/Jg6uChIT5IhwEcIaOj0Dt2vFDbj6Z6T3hxwZMAcIr0DsGo4rSViBYuSGcAnD13XqsFptIvXLQQw7jgpURwCr9czYrRaRww4Ar4VVmIVzngNcC5eN0evBGIVYo3DfHWSXtwBnAsBt4mW7B9FxyLd6bJHiwHnIr7JogD3oVT8d594oEP4Ex8+CiNuOAhOBQfb1Ah1/onluAsBMWnmLUE00ZX3TNUPdfFiegXxIBaQzMvrXtFRq/7eoGqN4q4kd4Ghr+zB8mjF1a9dyXS7A/mrf74Cd7NxAHp85coLOvrt++0kPV+/PGTiAPy8lrer9/qVouCbH/+aqIkyIjSICNKg4woDTKiNMiI8iAjqqD6M+1/iPPbDyJZIcN9/LxUMPEAiGCBDEgKCFNm4sF9bFDADB0yFaHUxENQA5lgg7oC/BSFI9/hI9BBXWoPO1N7YJzqQ/c0mFyg+vQHAPM18kGsEuSPAAAAAElFTkSuQmCC"]],
                                [-35, ["No off-road vehicles", "data:img/png;base64,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"]],
                                [-34, ["No quads", "data:img/png;base64,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"]],
                                [-33, ["No motorcycles", "data:img/png;base64,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"]],
                                [-32, ["No bicycles", "data:img/png;base64,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"]],
                                [-31, ["No camping nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB1FBMVEUAAACfMieJLyeJLyZxORzDOCm3NiiWMCe0NiiqVVX///8jHyCVk5TKOSlHQ0T6+vopJiYzISFVJyMkHyCiMyfLysr5+flYVVYqJidqZ2j//v6xr7Dw8PBPS0wrJyjKycl6d3g1MjM3IiHa2to1MTIzLzDi4uJ2dHR6LCX8/PyrqaqLiYkkICHu7u5APD3+/v7o6OgnIyT9/f0vKywvLC20Nij//f3RUkQ4IyH55+V/fH0lHyBeW1y1NShoZmaOMCbdf3Q5IiHdf3W2NijdgHZdWls2IiHg4OCQMCaRMCbf39/MTT9iKSQ1ISFIRUbNzM09KCZfXF3LTD7v7+/l5OSUkpO6Oy2jMyeysLGgn597dnfPzs6cmpvy8fFCLCvy8vKCgIFNSkp3Y2LFOCk7NzjAv8DBrq25uLleSUj39/dGQ0Px391oZWXFRTfS0dHm5uYtKSp7eHnOT0GfnZ05NTa3trZkYWJPTE0sKCnT09MlISLj4uPh4eGFg4OXlZb19fU8OTrJyMi8u7t9e3vXeW6hoKAoJCU3NDRsaWomIiPz8/O0s7NhX1/egXdfSUi7PC6eQDZQS0wwLS2amJj7+/tLSEk0ISGgMyeAfX63NihlKSTGOSkiSTB1AAAACnRSTlMA34iNCf76yfkDKthsawAAArxJREFUeF6t2VWP6zAQhuEUt2unzMvMDIeZmZmZmZmZGf/sOXbSqp9qWXXs9zIXj6JoNBcTixcM+CKhqEahiC8QtMr5w1EDhf0uV18XNVRdPQfB0xSZ548azG9ZQff77VxPNUqmMlwJB61ACV89l+qU7uNKwPIx7KgJkb+jz4owa920ATHFjIjF5zm5woCY5BNuRVmUmhA55YIgmgFR1AdR1AdBNAWiqA/KxURCGZSL9nZVUC6eyeViiqBcbCUkqwbKxTbyv8sqoFzs2srApnYFUC42Et4uBVAqLidum5VBFFc5YmJNCbxX8AiiaJNyD7yBKMZypFx8gycQxVZS0UYvIIp7CPTUA4jisxkA7n/pHaQd85m4CMW3GqBYfKcB0k1rq8W7LRqgPXtmtfjVOxiLE4H47btnMEuISNw7pALiFhSLv7yB7U2kQlxSIR68pgLiFhSL15VA3IJi8YYSCFtQLG67pQTiFuTiFhTJPlUwFgdw4tQOFPsPK4JZAu2mHedRvDCkBLahNzZJ6YErKB5SANkIQq/YwyM4PW+OKYCN6B2nvBMonqwdnIfe6REHHDmL4rlawcRKBAep2yDO48VLNYI2ep3jJXC8E8WrNYDVIziap+Xyo464zBH7b8pB8QgO0IoGCIi378hA8QgOd1eC3cMo3peB4hHspVAvAfHhIwkoHMHHFKOtKD6RgKIRjMcEWwPEogQUjKAt2msgjk1KQRu9nkI1WOhB8bkQfDHFa44jWGwRVCQgTuSneK8BnENUc8UGUmqBDoiiPoiiPoji+wYR2NXspQ8fGfHpM3/wBUCPzVrKjIVp4RzqiwjqiwjqiwgaERHUFx3QPaaZEH8wKeSc+1LUgPiTSRHnIJlJ64mLmcjzuSfTPl3xtwsGSkfdTErrOyb//HWPuqbPzqYP4+ZP9+Z/Lhj//fEPpHN45j7LA3YAAAAASUVORK5CYII="]],
                                [-30, ["No picnic tables nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACHFBMVEUAAACfMie0NiiJLyeJLyaWMCe3NijDOClxORyqVVUjHyD///8kHyCrqaozISEkICFVJyP8/PyRj4+vrq7//f3l5OTT0tKQMCY3IiHKOSmiMye3trY3NDRQTU75+flhXl6rqKnj4uN6LCW5uLkqJiefnZ2Miorx8PEyLi+Ni4v6+vqHhYaDgYE1MTKvrKzDwsIlISJ0cnM6Njf7+/u6ubm2Nii1NSg2IiHdf3SRMCb55+VgXV7dgHanpaXdfnO0Nig5IiGOMCbRUkSPLybdf3U4IyElHyDKycnGRznAYFU4NDW7PC7FOCnRU0W3WE5BPT6UkpPAvr/49/j6+Pjc29xGQ0MoJCX9/f1ZVlfx3923Nyk5NTZvbW12dHSysLGKiIi4trfPzs40MDHZe3A1ISGjMydiYGBMSUl1c3OamJimpKSNi4zs7Ozo6OjX1tavm5piKSS/YFff3t709PSxnpx3dXWsqqvMzMzJyMiyn53AYljERjijkI9bWFjk4+OYhoTNzM3CRDZJQ0SVkZKJh4jKx8ekoqPg4OCTkZGqS0Hy8vIsKCleW1y/vb7WeW96d3i2tbVlYmP+/v7T09NdWluzsrLf39+qqKn29vYvLC2AfX6zsbLZ2NhaV1e5OixWU1SPjY7d3NzJSjzDZFnl5eWEgoJ0YF7afXM0LzDR0NDKt7XMTT+oSkGgnp40ISGgMydKR0i3NihlKSTGOSkrFYBzAAAACnRSTlMA3/mIjcn6/gkDu6LyMgAAAvZJREFUeF6t2WVz6kAUx+FAKaUbtO7ubtfd3d3d3d3d3d3dv+Dt/gmFe8+0WXL295aZZ5LdLDAnBvJ5XO60fEZpbpfHBwqleAEw86ZYXHpqvqZS0wHC0yTifvM1lmIYPmv91q0VjILhAihen+GJ4YPGC07+CigewyWxqTpEXKPLcEtr5wgNYlgabgPPc3CABjGIJ9zAnQuhQwRlgUTkgkTkgkTkgkTkgkTkgkTkgkTkgkTkglRkgkScVBawa4UiaInDs0ybJiiAVOSDEI8QkQeKo9OkODBLGzjkxCkpTj9TCGDBzIzuLnbCmZVhtcwWpOuYWwbjmkArAbYmcVKouAZ3fcu6boC3Z6iDVMQ6ZocECpVD3JQkSMX6GFAPcOt8h6DImwJxTlEMmNwJcalTUOwdLcU38XNdCfCgU7Bu9mCIuT1iqYnmOQSbTPM/MXQc4DeH4FyTiFsA1lY5AheaskWLE8UlEYgbHYHLAQby+ieKXQBXOQFXlwAsFlFxTFRcb6INDsBGeDlC/COGsgFuVgLbhyW2DeD2QHc7JkpxF34VdgPck5FYUy9gAAQtttdjs4DRslVBKnJBKvJBKqqD+wI97Y9AOZAZ7xB25nBLZquJCuMfVduflGPwIh0iVsLTU1ULsD2pk3IPYCUgIlYDPJkM2FwCsBQOEU+b6GcS4Fl45SEwVDwH8HwS4AWANQJR8RL2+vIVZfAqvIYi0Zt4HeINZbAQ4E0IROwnxaFSvKMKFjUAvAuANC4uFiuCNfDuE4qID9RA6w9Co7AVHz5SAkvhlTQLe/GxEtgF8Al1qPhUBeyIAHwm+hSfR8UXCuBLeK8A9CG+hthiD7a9BfhO2PQe348fPtqCxTmyT3V2YNvnLxL46rcBSXY7M8rPB6lIQaZIQaZIQa5IQLZIQLZIQLZIQL4Iyhqm6RC/Y5gWHfeFhQbxh5Tc0YFkgZ8njpQiclkj0wqu+MsCPbGhbkGYtY7B33+soa7usbPuwbj+0b3+lwvaX3/8Bcq6vaYYwWqOAAAAAElFTkSuQmCC"]],
                                [-29, ["No telephone nearby", "data:img/png;base64,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"]],
                                [-28, ["No public restrooms nearby", "data:img/png;base64,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"]],
                                [-27, ["No drinking water nearby", "data:img/png;base64,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"]],
                                [-25, ["No Parking nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAByFBMVEUAAACfMifDOCmWMCeJLya3Nii0NihxORyJLyeqVVUjHyD////KOSkkHyAlHyAzISFVJyPf3t6iMyckICH+/v5TUFBKR0iPLyYlISJ6LCXb2tsvKyzs6+uwr6/9/f10cnPW1dU0MDGjoaImIiPBwMCOMCb55+W2Nig2IiHdf3U3IiHRU0W1NSi0Nig5IiHdfnP56OaRMCbdf3RXVFWQMCY4IyHRUkShQTbV1NW6PC74+PiamJg1ISF8enpWU1RVUFCUkpL6+vqjMyekoqNxbm9hTUsuKivGxcVcWVpBPT5tamuqS0CNi4yrqaqcmptIRUbR0NBwbGy3traEgoLo6Ojl5eXm5ubj4uO9PjAyLi/c29xvW1rq6ephX1+sqqvFOCliKSQ8OTpgXV6trKxCP0BeW1z5+fnHxsddWltfXF3Ozc5qZ2jS0dFQTU7Cr63JSjzHaF7FwsLu7u7Z2dl7eXpVUVKioaHFxMQnIySUkpPAv8AvLC2YlpbHxMVLSEnT0tLT09PZ2Njh4eHi4uLf39/d3Nza2trX1tbU09S+vb2ahoS+PjCPjY5zcHEpJiYrJyg0ISGgMyfCwcG3NihlKSTGOSmRj4///f0CMF4+AAAACnRSTlMA3/7Jjfr5CYgDNTwkAQAAAnVJREFUeF6t2eWWo0AQhmGYIWSmmnjG3dbd3d3d3d3d3V1vd0MH6kBqh9BUvxfwHOA0/PgwZGnLtBscRg22aaUNrCnlaCjV5HHNjY6mGpslSDyGKO/X0VjlrtPe81uxCBjl8kWppNKG5ePTs8Ap0yEVyzBd7KgOUV6jadiudWyyBjHvGrYhz3NunAYxJ0+44bgB6BAl5YFE5IJE5IJhcc3MUVoyoAAGxBYxWuV5W7bGB1EMgLTenvVxQRSXisiWL44Jojj3r4hucCgeiOLUeuKOeqCyeL8OqC5uiAbVxe6u+iCK8+OIC+ODsHoiimv/YMuOFILgguPxwZZpUpxREfsg2Log+UkBFCh+hlBfVgqsoAKiuArClX4I7LICiOJ2qGngEII7FUAUN5Lv4yYEN6uAKM6qFVsR3KYIijFz/ieWzvjgLgUwStztg3sUwCix2wf3KoAo7iPi/rIPHkgAioOTasU+4deTBDw8oUZs70TwVhLwBNSIJwV2Kgl4GjyxrSoOCuwsJAHPQUBsP39BYOJiIvDScKUrV13x2vUbItDNoQRg+DyOD37Dy7dBFYwW7wAHpOLdexyQiv1dwACp+OAhMEAi9j4qAQMk4uMnAAyQim1ZDvj0Wf/zzsKLl69ev3n77v2HjygmBSEUvoU8kIojWT6I4lgi8kCYjSIbpCIfpCIfpCIfRJELUpELUpEJUjHDBqnIB6nIB6nIB6nIB1Fkg1SMBr+2YqAgElAhKhKQLRKQL0rKG9N0iN+qY5rtgnnQIH53Jbs6SBYzPHGKK8pMbzLt4Io/PdDyR91invUcc79+e6Ou7tlZ9zCuf7rX/3NB+++Pf35lWZJKvhHQAAAAAElFTkSuQmCC"]],
                                [-24, ["Not wheelchair accessible", "data:img/png;base64,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"]],
                                [-17, ["No poisonous plants", "data:img/png;base64,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"]],
                                [-15, ["Not available in winter", "data:img/png;base64,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"]],
                                [-14, ["Not recommended at night", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACzVBMVEUAAABxORyJLyafMie0NijDOCnKOSmJLye3NiiqVVWWMCejMyc1ISEjHyAzISFVJyOiMyeRMCYlHyAkHyB6LCXFOCliKSS0Nig2IiEkICF4dXaHhIUqJicuKivw8PDo6OglISJoZmaSkJD///+5t7gwLS10cXLp6ekpJiY1MTL8/Pzi4uJPTE0mICHe3d2Bf4DMy8v29vZXVFWrS0D//f0pJSaKiIjz8/NST1DdfnOAfX5JRkfx8PFiYGCLeHbFRjn5+fnY19e3traVk5R0cnNUUVH4+PjZ2dkxLS7R0ND56ObRU0X+/v7d3Nygnp4vKyzMzMz9/f16d3jAv8BbWFktKSrHxsf8+vqnpaXU09SvT0RhXl6QMCasqqvOzc7y8vKwr69IREU9Ojvh4eGura304+GNi4tkYWLn5+d8enonIyRBPT6zoZ/QUkTm5ubS0dF5dneFg4NXQ0LHSTs2MzRZVldaV1c3IiG1NSiZl5d7eHnk4+OamZmpqKitrKxCP0D7+/uqqKm0s7OnpqZRTk+UkpKPLyYxKyzg4OBtamvDZFpGQ0Pdf3X49/gmIiO7urqPe3rRUkRubGz55+X19fUrJyhMSUk1MjOYlpadm5xbWFjV1NWMiopCPj85NTZ7eXrAvr80MDHs7OyioaF1c3N+fHy9vLxlYmObmJg+Ozvl5eWQMSfq6eqOMCbJSjzDwsKenJ08Jya2NiiPjY5eW1w4IyFHQ0REQUK4trf39/efnZ0yLi9hXF3Qz8+8u7v6+vr09PSamJjLbmRfXF0zLzDs6+urqapoZWXdgHbLyMiRj4+koqN/fH1hX19DQEFaVVZwbm6YhYPISTvRdGqhnp7v7+///v6lo6RLSEnt7e2mpKTr6uq7XVPGxcY3NDTj4uPGRjhdWluysLF2dHTl5OTMubeEgoK/vb6DgYE0ISGgMyc5IiG3NihlKSTGOSm9y1u6AAAAC3RSTlMACY3f+f7/iPoDyWgbj3cAAANuSURBVHgBrM9JEgIxDENRZVLSgaSZ4f4npWSGC8Rvo90vGybElAsXlJxiwF9tdNAqPrZOJ32DdLrp9i8dVSA0msNxLJj7idICIr/Ol7HieqNEJM3do2g3JmTN4+lQ3NXIKJr5cihOJQooY3gUKb/gmxV7iI8jjgI4XpxfeYn1Ytu2ndQNaiu1bdtGatu2kdTm/RxNdt/u/Cf5vOns7z7fsR5HNFcBskQLSys2yBKtbWwtuKBMtLMHpRwQHZ1UgCQ6u7iCQm7uiB6ebJBEL2/0AaV8EdHPnwuSGBCItkGgUDAiYkgoFyQxLBDDQaEIrC8ygg+6RUXHSGJsXHxCYpL8SkxuEFNc2WBqGqZnSCIiZgqbmYUNZbNByMklMS8f5BVIYGYhG4SiYp3YyRmEOqNUGh8Eqy6NYtcOTYPYjQ9CLjaK3UWxhw7sqQIswabFUtRVxgbLEbFX7z7KYoEe7MsG+2H/AQNh0OAhSuJQPTiMDQ4fIV22I0eJYipSFUzQ8C4UxNFIjVENwthxcnE8UhPUg6I4EalJqkFRTEKDSlWDojjZEJyiGhTEqdMMwemqQUGcgYbNVAsK4qxMI3C2OlAQ58ydh0bNVwkK4oJAY3ChWlAQFxmJi5ewQL64FLSAsGy5XFyhBXTNxpUycdVqDeCaFES5OB3+G0ydHYsoF5PLeaATyFu7LgQRBXE98MANGzdtBmrL1m3JSJFos50JwnrEHcU7ffItdu1ev8c7U4IEMXMvcEHXFBQTxH3ABqFyP0M80IEPwtSDDPFQBz4IZbbNi4dJ5IHgdqQZL/PoseMk8kAwP+HelGd7EuCUTjzNBQHOnFXkzp2/AKAXL17igwChl6/IuavXKgCAxOuBNxggdXNr8WLSbt2+sxoaIvHuPR5I2S1ccf/a+QfrHz56bA4UiU84IKMcz6fPntcv9+Jl+I1Kc83gwlf6K/zua8Q3mkGoqjYQ34J2EMre6cX3HU0BwhkXuq87mgKEDyiI2sBqFERN4EdEnPapTvxMoibwC2Z+3Wz37Tv+OE6iFvDnryqoK+j3vFMkagFT9aMXOxJZICO9KIHSMM0U4h9pmNYw7msLJhD/SuO+hoFku47axH91olTr2kGHTEUoNfEN1EAm2KCuAD9F4cj39h10UJfaw87UHhin+tA9DSYXqD79AQCobAGtqIqRdgAAAABJRU5ErkJggg=="]],
                                [-13, ["Not available 24/7", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACZ1BMVEUAAABxORyJLyafMie0NijDOCnKOSmJLye3NiiqVVWWMCejMyc1ISEjHyAzISFVJyOiMyeRMCYlHyAkHyB6LCXFOCliKSS0Nig2IiEuKitFQkKPjY7////Y19fKycmdm5wtKSr6+vpiYGCQMCY2MzRVUVJwbm7z8/MmIiNIRUZ1c3OBf4B0cXJEQUKrqaq8u7tTUFDS0dHFxMQ5NTY3IiG1NSjZe3D//f3GxcXl5eVyb3D5+fnq6epST1Ddf3RDQEFHQ0Q1MjPu7u7i4uIpJSbGw8N+fHzp6emWlJXr6up5dndQTU54dXaIhofJSTzJal+5t7iura2ysLHk4+NVUlPZ2NheW1z55+XRUkQlISLx8PHR0NAkICHW1dX35ePMTT9RTk86NjdcWVqAfX729vazsrK7urr7+/u7p6aMiorb2tuwr680MDHs7OwqJifn5+f49/g8ODmPLybGxcagn58vKyz39/e6ublNSkrDwsKNi4uamZnJSjz4+PhmY2R6d3hpZ2fOzc6Bfn8yLi/GtLJfXF38/PzNzM3v7+8oJCWkoqOKiIibl5ejoaKGhIRtamvo6OjNb2WTkZGYlpZ0cnP+/v6amJjdf3VYVVbe3d1nZGWzsbJZVlfc29z18/NhX19bWFjHxsfBwMCRj4/s6+uOjI3GaF61tLQ9OjvNTkBJRkdAPD1/fH12dHTZ2dl7eHnT0tLj4uOVk5QvLC3HSDqxr7Dy8vJBPT62tbWBbWtgXV63trZOSkuOMCYnIyS4trff3t62Nig4IyFbWFn9/f0xLS6trKw0ISGgMyc5IiG3NihlKSTGOSkQkLDqAAAAC3RSTlMACY3f+f7/iPoDyWgbj3cAAAOwSURBVHgBrM4HisQwDIVhuTvZdbK9pWfvf8exRWZoAmOkn/KoHw8wpY11npGzRit4FKIXKIaL63ovVN8hiJ6QWLzgBQsAKnrs6TkxGsYXVKICfcdf3xKn9w9UNJgynxIifjRgy3x9C4hjMSy4MsOPgDgUwoEvpSQhInWBXJEAmSIBMkUCZIoEyBQJkCkSIE+kQJZIghyRBOvi71+uCjaI0zzPSxVsENcMbi1gRdyPDJ51kBL/KfHM3rG3gBVxy+CaWsCKuGRwupFKD+rVHHEAxq/gXz0q3s+2bds2Y9u2bZu13UbX1cwimWhO9ul7sP6txitoENcDbPAKGsSNwKbNHsAtW7dt32EQdwK7ZNng7j0A7N0nqv0H1LaDhzgsMx0Btqk90Tq6FLj2GHbHT2jiyUOz4CmA08sFz5zF7dx5XbwgbheBS7Jc8DJw5eq161eAG2KLN9XmW5+I023gjppZvdvpLvD5EuA94L6I7FgDD8Tq4aPH+pt58hTYLnr34JksDq7HdfbCMVE9f8HLV5r4GuCNaL0F3i0Bnnr//r2fqPwhQFRbYWegdo1BQLDohcCaUJ8D+wGEqWl4BJFRt+27jlZiDBArWnHxkCC+wEQgSc0kQ4rc5lGqI4anAemilQFk+gI3ZwHZahht4mmO3IbcA7aYB+THiVYBFBb5AlcBZ1eLSDGUiAIP77fFUqBAtHYAZeIDLAeoEJHPA6gMt0GxxapDUC1aNcAJH2BtHVCv5nZBhjigIzYcolFme1IJTWIGm/OBFjXXCm1PZkBXbC/SwA4g2Qx2pgFd1kHdkNQzXRv0+vW5Yv8nGjgAdYNG8PUmYI/9HrPQsq5xyBk9bjlp0CUmcLgQWJEji4Mj2gi3GgW+NIGf9wLBZ8Tueo/dV3CuZ7uIfM088Rt4/5kJ/Bao+27U7nvtQR12Zx79oInDwI9iAn9C62dx+sUBn58Ffj0wK64CfjOCZxcFf3fAPwAG7Xf957T4Vy9cemIErywK/u2AN4B/RPb/64jNQIoYQXNJQLGIjLmi6n+A5+OBTDGJ3sBxYGJSTKI38DLwTMQkegOfAZfFKHoCJyeAcTGKnsBMIP68GEVPYFBbW9uUaP3Xmh0cQAQAMBC84wug/3IAPQFAnjYpYArYHGL5FdSpqCAXFeSiglxUkIscFJGDInJQRA6KyEERd3CPaQ6x2WPalvvS2CC2e+7bgmRWMrFbxH3hkUwrKvYHGJxRN0sTAibDeERdd3Z2h3F/uvefC/b7YwYV+NxXipSSXwAAAABJRU5ErkJggg=="]],
                                [-10, ["Not a difficult climb", "data:img/png;base64,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"]],
                                [ -9, ["Not a significant hike", "data:img/png;base64,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"]],
                                [ -8, ["Not a scenic view", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB1FBMVEUAAACJLyafMifDOCmWMCe0NiiJLydxORy3NiiqVVX///8jHyDKOSkkHyDt7e3//f0lHyAzISGiMydVJyP+/v755+XT0tKHhYZua2x7eHmDgYE3IiEnIyTLysotKSqHhIV3dXV6LCXRUkSOMCbdf3U4IyFTUFB2dHSenJ1kYWLRU0X56OY4NDXdf3TdgHZgXV7//v60Nijl5OQ2IiGRMCa2Nii1NSg5IiGjMydiKSRCP0Dl4uJwbm6rqapvbW1WU1SXlZbNT0EkICHx8PFRS0w2MzQ1ISF/fH24trfi0M7f39+EgIDTdWqzsbKxU0iKiIjm5ub8/Px+fHzr6upeW1xyb3DAQTN8d3iTkZGmpKSFcG9raGmfm5xdWlva2tqfnZ3BQjS6XFL29vbFOCkyLi+PjY6MeHaPLyZhXF1ST1BmY2R0cXLax8bMTT+kRTxfXF2amJi6ubnOzc5xbm8qJif6+vrJyMjOcGZGQ0NZVlc9Ojt6d3iNi4yura3BwMDi4uIlISLz8/M6NjdNSkrGxcZtamspJSb4+PiyVEtjYGEvKyzu7u6/vb61tLTs6+vn5+eLiYllYmPSv73LTD5KR0iuT0U0ISGgMyeQMCa3NihlKSTGOSnKX9nSAAAACnRSTlMAjd/+yfmICfoDLGNawgAAAppJREFUeF6t2UWT4zAQgFE7M05mWg5nmGeZmZmZmZmZmZmZ/+yWZHuTtGxJta3v0rdXLlmnliPKuCmvwSfU4KXcjPOvdJNvoaZ0yDU3+pZqbBYg8kgi99K+xdKOkwnPb+ZyRqhYLgXnmHHcCJ9aYJSyA0JxnRQfR2yI4htTjsfHrEkWxDI3PEfc5+IUC2JR3HDH5zFmQxRUCCKRDmKRDmKRDmKRDmJxOES1RcAoiBqhA5FIB7FIB7FIB7FIB7FIBrG4NBe1IgIv5KLmG4KE+4hApUgH961axMW1cyaL5rJ+Po6xCVBXpzG4EMaM5uK4vAA6WCcfIzG40hjsgaqoALeYgs9fQFVUgDDbEFwAUCMqwH5DcAPUicngPEPwLQS1DAZiIrjaDFy8BOrFHUkgLDMCvwLUi98KSeAeI3AzYPHnmgTwgBG4DiRxfT4ebDUCN4II/ZlYcFOvAXgbIFaMA2GrAbgNsLidi0PzceBOA3AX4HZPF+LeGPCpAbgfcB1dB7l4qCCDh7u14NGKDLLj4hxPnASpU1rwNMSAZ86e4+L5POD6tODFOJCxruAcJfGSFrwsg1dYspjTgVevYa5yvZdVxRtYvKkBb2FvrNCSv/GOBrwrg2rxnga8L4Nq8YEafPhIBjXiYyX4BGRQI7YrwWcqUIiDXBxfI7YpwXYdyFqQSAYBiXQQiXQQiXQQiXQQiXQQiXQQiXSwXpxIB7FIBrHYRwWx+DKrAl9hr/IagW8kcUhWAXa/e5+r7cNHhvrU01rt85dIxOD/NmxaKGKQLmKQLmKQLmKQLgoqXKbZEL8HyzSPjzKzIP7gkhcsJEtZmjiDi6JUuDIdoIq/QtCNlrqlMukci7//hEtd22tn24tx+6t7+48L1p8//gL/8Fm4wtV04AAAAABJRU5ErkJggg=="]],
                                [ -7, ["Does not take less than one hour", "data:img/png;base64,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"]],
                                [ -6, ["Not recommended for kids", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAIpElEQVR4Ae2dA5DsShSGp+qVXtl6XNu+tm3btm3btm3btm3bOm//1O2tTLbT27nZqZeZzF91LjLRfEm6+yA9Dp5ap/z5++CowOEzY4NurksM/rw3OeTHkZQQspPhO+O7gwFYgEmqObSWbsHgqKBBGxODvzjv0GtgAjap5lBb2j+WlC//24TooMNeWGIDI7BKNQfMwf5hDJ4XYqo5YPhDeWy9YIwZe5yVDkPU5s2NC6IEHx/y++dfW1mcjw+VD/KjOXFBum0i2DnQw2REe3R0IAXYDCAz/1TrEh7A5QJ2DnTT2g/2J3shaiHy7kSwc2Cso/2gTog/pS53KcTI0DAKDw5xG4h4nLU8wM7BGyTj+U/09XEJxOZNmtLVK1fp+/fvil2+dIka1a/vDm0id7Dt4DzbbKNMhzhuzFjS07AhQywPkcdKADBzIZYuUVK54/T09etXKlKwkMcAzHSIkydOpIw0asRIjwGY6RB3bt9BGWn9unWeC9AsxDmzZ1MGwl3q2QDNQKxfpy5lpGqVq3g+QDMQN27YQHpasXy5R/XCLoEYEhBIUyZNom/fvjn1vuPGjKEgP397ATRzJ0aEhFKl8hWoQtlyam/EfgBlIIYGBlHvHj2VHvb4seO0f98+2rB+PS1auJCmTJ6sDKBbNGtGWRKT7AlQBHFGjjh69OAByejz5880cfwEewIUQbzeoy0RPBA54a60AUAXQkSnkjdXbnsCZBDXm4Q4f+48+wKEtahamU6XzZ8eYs92UhA/fPhAMRGR9gW4ZNFi+vzogSmIA/v1tyfAQF8/evHiBUFmIN67e5cCfHztBxD+LJNZiI0bNrQfQHQAaj169Ega4pPHT0itw4cO2Qug/78+9PTJEyd406ZMlb4TR48cSadOniS1ihYqbB+A8G/V6tW9hzIwZvr88D6dLpNPF2L3rl2pRJGiTsGGpYuX2AfgrJkzienBgwdK9GX2rFkEyUBs1rBRuv18+viJEmJi7QHw4cOHxIS7CcsQNIBkIM7Jm6IEIKLCwp3aw+FDh3o+wHKlSxPT/Xv3KNg/QFmOQCkkC3HUzyhOy+bN1W0p4oWeDZB1FlDXTp3TliOMBf0KRIS+mADUowFi4AvdvXPX6W7ZtnUrQb8CsUDuPEqYCzpx/ITnAixVvAQxdWrfwemzPbt3E5QRxBMlc3Mhjh89hpiQnJc5n9zZc1DFcuUpKjzCPQBOmjCBoNu3b8OVc/rsxvXrJKNLB/bR+gROZDs2mO7cukXQ6pWrhOcRHx3jdMHQg/fp1dv6AG/euEFQ+7ZtnZYjovLjxw+S0cEDBynJ14cLcX6B7HTh7FkaNGCg8Dw2b9xEPNWuUcPaALMlp1C/Pn3SOf+1qtcgWe3asRPb6EIcGYWORVwup1d7s2rlSqsCFNvI4SNIVpcvX2bbCe/E5YsXc8vhkJTSE8pK3BIgTlxWCKJiGzFEeCzt6VPqurwqhltoKznCo++WAJ8/f05GlBgXLw3x/du3VLZUKaf1q1SsSO/fvyeVkEqFS+l+ADGUMCoGRBbiqxcvqGSx4mleDyxn1mxKmdzC+fMxpGKjAvcD2KpFCzIqbINtjUBkobBPnz7Rs2fPlMf43NlzdOjgQdZWuidARFTkJQ4ayELU6uPHj/DR3RMgAqN6eV+4ZzwhGYVtMxMi2uE8OXO5F0C0SXqQNm/anBYk0OrA/gPYPrMh4rFGTNF9AJYpWYr0VK92HSVlyRECEdjeJRBPnjiBQif3ANi7Zy/i6fHjx4q3UihffuIIoXz0mi6DuGXzZuRtrA8QTj9PE8aNT1sHIX+ecmXLjs/NQezVIQ3i3j176M6dO8SEFIO1AQo8AlVjjlB/ptRJA+KWLOG6EBHcTYqPpwvnz6urHqwLMC4qmphEOd4mDRsRT106djJ8zMr58yEoy4VYtEBBrKPEBjE2hBAhwitnlgRYp1Yt4qld6zbq9fCFMKQRPObyBm9EL7I9QlVuDJeOhbzOnD6N9th6AMeMGkVavXnzhsKCgtOf0OHDpNXaNWsMHxMlwpAMREDr3KEj65GtB3D3rl2k1YJ5/Ho/1EdrhAG4qXISMUQ3GAe+evWKtELOhLcuqhC0gj9r9Jh4fRaSh2hRgCjN1QrvA4u2QS2NVngNQvaYCbFxxCQP0aIA27ZqTVr17S1O6ixftoy0Kvyz55SxZo2bCLN9x0vk4kO0IkDtC4Xwh5EpE22DhLlWDerWM35MAcRt2aO4EP2tBhBDA4Ovr2LciGSQ4K4VG5oItZBGRVBCrcXjx9GGxGA+RKsADAkMpC9fvpBayMrJbAtHX61ZM2ZID9q1adOO7dujphAXxSmklTXAXwDRAgDLly5Dat2/f1/acUdhpVrbt22T2q5RgwakFvxrlJXwXMXaNWtSsp+PCYguBoi8sFpjR4+W3ha5EH6KU2wzp08ntdRVCEhQvX37lphWrliB5SYguhggPAgmPFZI7hgpDX758iUnxSm28+fOOz2mWm9n8MBBxPTu3Tt8bgKiiwEiGMqEiLPhC7B6jTDFCdOWjajbueFDh3HfT1aHslo0bYblshBdD1AzmDVVy9euTVtxilNjGOow4VGNjuBXYjVt1JiYtm7ZgmXSEF0PkDMfAlw59MhG94GYHR592YuAgk7ZySpY0ALjUty58hBdD1A7IxEGtuL1xW2adF302TNnWAkb4IvDXUWL4eJo442yEF0PcN/evcRUvEiRXwaIWCDT4kWLdNdDETp7FWLenLlS+162ZCk6KnUBqDxEEUCdycf+tzJajONgiNsJAqgo+YVJ9/ZoI8XzM4ghxutNPsab/g5TvdlxnkARxFmc+QPBjjcBIyYbZLetLS3FNw2i0MBOdwpQTHtpd4gbM4AIdsJJaHEn4nGOs+kktPVD/OmAYGJusANA7zTIJqZBBjyYdyJuMxNxw7xTwZucCp6Z98cIjP8Ygda8P4dh4Ocw/gN0AogooQkvjAAAAABJRU5ErkJggg=="]],
                                [ -1, ["No dogs", "data:img/png;base64,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"]],
                                [  1, ["Dogs", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACNFBMVEUAAAAmISEjHyAkICEjHyAkHyEjHyAjHyH///8jHyD39/f7+/vq6eopJSbr6ur5+flCP0BMSUl8enr+/v6dm5yUkpOPjY47Nzg1MTL19fUoJCV5dneAfX7o6OjX1tbu7u4wLS3d3NwlISJiYGBvbW2hoKCLiYm0s7Ps7OyioaEsKCny8fHEw8PGxcb09PT6+vrs6+uGhITQz88qJidJRkfS0dHk4+Pp6elUUVFkYWLNzM3Z2dmBfn+9vLxYVVZ7eHlHQ0Q4NDUvKyw6Njewr68vLC3T09OjoaKDgYH29vYtKSqura0yLi9ubGyfnZ1BPT5mY2TIx8fh4eFlYmO1tLTFxMT49/gmIiNXVFU+OzvV1NV4dXZ+fHysqqskICEuKitVUlMnIyTDwsJDQEG/vb6UkpLGxcVVUVK5uLlCPj/Ozc74+PgpJiZ6d3jT0tLY19c1MjOZl5eVk5RPTE3f3t48ODmtrKzt7e2enJ1raGlqZ2hgXV63trZKR0gxLS6Qjo+op6fl5OSamZl1c3PHxseSkJCFg4M0MDGIhoeWlJUzLzBIRUZ9e3vx8PGcmptWU1SrqaqEgoJbWFhzcHGzsbLZ2NiNi4uHhIVhX19dWluBf4CzsrKgn5+Jh4jf39/z8/Ognp7Avr/Av8DLysrn5+dQTU5ua2yTkZFAPD0/Ozxtamve3d10cXLc29ypqKiOjI1cWVq6ubny8vJEQUKqqKk8OTr8/PxjYGFNSkqHhYZ2dHRPS0x97HoaAAAACHRSTlMAPeay/Xr+e7TLcqMAAAMMSURBVHhe7dljj2xZFIfxatyZ519q2rZtXNu2bQ1t27ZtfLm5Sae7uusU1oudSSap3wdYeV6clZ2s4/P50jLS5UR6RprvliW3yZnMJbf6MuVQZpovQ05l+NLlVLpPjv23A1OFqcJNuX1OC/s7Wee0cAdQ5LDwBYAz7gpLLwH+g+4KCwA6DzkrnAwAcLHYUeGyMLO+2eOkMNTLnIpnEhceGrlfyX1PRPexhIUFXK9VMrksVFFXm6DwANQpiVNdLOYfa6qOV9gC+UriUbzK4hU+DqNKovooHpvjFb4F/iNKZFtIte8S5bm+eIWXgWuK79hJdrRKU50s8kr8TamBHxRPqPAcMPCVdHnjOWi7UB4GyGpMsCnPw9Y+xZRdGASAtg2SfnuxMltaW39z+dU9iTblZWDlqo35D1956sRjha83PvnGS2+XPztVduHBQSI6cuxPwFks8j7edtA48DBGh42FS9uwuctYmI/RuK2wOAujL2yFq7F6wFZ4GqtGW2ENVj22wiBW39oKv8Nq2Fa4BaunbYWvskhzx6pKYmqWrbCHhTZI0uT2AF7vGAZ6VjmgWUUFzUTbZyw8v4aIbs0JjbRsZZEbhkLPI35WC2WPf+RnzqCsA+8m4oCi3MOce80D7yOiXNHCzOKEuTCHeTvXK1oFUALwiLmwnnnr5OEHjgPsNhcuZ94pRVsP0JMHzFgLn8gCmoIAlfL4B2C4BPySfVPgzSGA/fL4HMgKBaHKPHAAoHgI6Fwqj/eAXr0P3dbC813ABxoCLsqrBfhQeyFoLZwGGNQAMCav7UC9PoFPrYWfAbymBoAv5bEFOKOj8JC1MAegV18D3CmPGmCX2rEPrJ4tXNEF7JyJ+V336yTcYS1UGPCXqj1mYivApex24EfrwJ8A6rQZ4OfWWIWETwN5Hb/YCvcB/CqtBOhXrBenJBeABlvhiiqgapeWNQVgWlGOrD4+OrFbDQH4/Q9bocoA/pRU9Nd+xVO6qSgk40D9vXfNxNr/95klVZgqdH52dn4Yd3+6992e6fTngvPfH/8CokA2tpyaeuIAAAAASUVORK5CYII="]],
                                [  2, ["Access/parking fee", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB6VBMVEUAAAAkICEmISEjHyAjHyAkHyEjHyAjHyH///8jHyAlISL9/f3Av8AnIyQxLS4vLC2fnZ1NSkrU09TFxMSzsrJIREX+/v4sKCn09PRtamsqJidvbW12dHT7+/s3NDREQULj4uMkICFpZ2fMzMxVUlPc29z19fXDwsKamZns6+uNi4x7eHlXVFVLSEmDgYEuKis5NTaRj48yLi+joaJoZmY/Ozy9vLy7urrJyMgpJiawr6+TkZFyb3Dx8PHy8vLl5OTGxcV1c3PT0tIvKyyFg4O4trdAPD2ioaHo6OjR0NDr6uqtq6u5t7jX1tZubGzMy8vZ2NikoqPNzM2Ylpbe3d02MzQ9OjvZ2dna2trCwcFRTk/T09NcWVpPS0y5uLnu7u6SkJDV1NVOSkv39/c7Nzi+vb15dne2tbVdWltgXV66ublua2zd3Nw0MDF+fHyhoKBmY2Snpqbn5+f4+PiUkpI4NDVqZ2jQz8/y8fFoZWWBfn9kYWKUkpOop6dJRkelo6RBPT6gnp7b2ttHQ0RUUVGPjY6/vb6WlJV7eXqLiYljYGE1MTKpqKjGxca0s7OMioqbmZrg4OBYVVZ4dXZST1Dl5eWura0mIiN9e3vt7e1saWp/fH13dXVKR0iysLGenJ0pJSZFQkLs7Owr7XlZAAAACHRSTlMAsj3m/Xr+e3//bV8AAAJkSURBVHhe7dnFr9xADMDhLLzWTpb5MTMzQ5mZmZmZmZmZ+5e22sTKKMoeMuND9dTfMYfvkMNY49E0ze8LIEsBn1/7W9EMZCtYpGn+IDIW9Gs+ZM2nBXjBgIbMTROwqy9fOxvYB/li3GATN/iAG9zJBtaY4Fke8GDv6gYwq4+1K4Nlr0Asc7hSCTy3CZzlliuAXWvBpePSYPYouGWclAVPgHvNETkwnoEC9cqBS4AqH2ppPbXRBvdEZMDoGQKqtuU/jO0AqkMGfEze6R402/ubwEYZcA2BpUgdor/aEJYAl1reO7RLglWlBDhkgQMCOJfArRLgMgscFMB1Y1brJcAVFriSa0htt0DjFxO4CqxCOg9YCtTIMAt4LAPUhjoOEENgN9DGAG4GsS37s6ogHTfUxIK0IliyCygaUbuVQKxIgLN9cRUQOw+As/LRsBRIFU+Cs6lOFRDDs+qd4uw5ciBVXZN0jKt50iA1/+pCx6yXBim9eJEALi5RAanzVbbYwQFidBCoCywgVocINHpYQIxcJPESD4gxAi8zgVcIHPUMjqTMrqHYdQJveAab6TDQRfAmgbc8g7fB6o4I3iXwnmfwPoHdIthC4EPP4CMCx58Ik3CcwLhnsA2oZBipp+RN6J5BfRKoZxUml00B9VxiBLwACnIv6yJ6f6twy3gtAdL/cishNQLeFPSMt1IghgqBTbJXs1p3L6VLghhtdPPef1AYox9zTu7TZ7ULePRLwrA1o/ZrVn3nMPztu8n9SP9kWmJ0m2AZ4j8D/gfTR/L1T5cNJ3Psa2f2xTj/6l6bGWR9XGB//vgDiykZlJPS4lMAAAAASUVORK5CYII="]],
                                [  3, ["Climbing gear required", "data:img/png;base64,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"]],
                                [  4, ["Boat required", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABxVBMVEUAAAAkICEmISEjHyAjHyAkHyEjHyAjHyEjHyD///8rJygvKyy5uLn+/v5bWFjs7Ow8ODn19fWpqKign59mY2SNi4y2tbVYVVZhXl6npqa4trdeW1xGQ0Pw8PD8/Pzh4eFiYGCvrq48OTqEgoJAPD1CPj8sKCmVk5RgXV4oJCVbWFm/vb44NDWkoqNPTE2MiopTUFApJSZPS0ybmZpST1Dq6epVUlN7eXpQTU6ura35+fnFxMRUUVFVUVK0s7Owr69XVFUkICFZVldaV1ctKSqmpKSSkJCXlZb09PQ3NDTGxcWUkpLy8fHa2trl5OTc29wuKitqZ2hoZmZnZGUvLC2fnZ3v7+/W1dWysLF0cnPX1tazsbI5NTZFQkJcWVpdWltIREVfXF3s6+traGlhX1+tq6tCP0Cxr7BIRUb9/f2rqaopJia9vLzl5eVDQEE9Ojs0MDH39/eNi4vS0dEzLzCIhofj4uPo6OiioaFjYGFkYWJlYmNWU1SQjo/6+vrNzM27urpOSkuamZnAv8BEQULCwcHEw8O+vb37+/tRTk/d3Nz29vbe3d3Hxse5t7iKiIg/OzwyLi+dm5ytrKyGhISHhIX4+Pj1HxnhAAAACHRSTlMAsj3m/Xr+e3//bV8AAAGwSURBVHhe7dnlbuQwFIBRJ5nZvU4yzMxQZmZmZlpkZmZmhudtXW1W6jTVqLF/VFp/D3Aky5audI0QEgUJmCQJItrKfAiYZTIjJJqAYSYRCcA0AUlsQQkB4/5XkIMc5CAHOchBDpa8cN2rGAg4L5xuSZxd6/QG1WeXyl6+fhM2CkJdJIq1LPhfbTRHzq5vdGGSq+eicqv86pljtSfwSbpLKXcQsDWpAbfxZZkKhMeY5NSA/kWcowPluwSMXtEAD/6TKQKeq2x+X1/d3tHY+Kjb19tnLT1yNHQ87z8Vj99/8NA9l8Aktfpv+Sf4aVVhz3eAFZi2mzU7wFcWSs9mL7iUt3TeOysUgKV0YGr3LS/ReMuwG1yh8FZlHbCkwbAXSes+bI9R77wfdMFr1w2CN0AfhAABYnf266mwF5gdsg17R+yjW4BjLNRADlPnHidAcAKTJm063tR00REQnrEqADWzVU0ZgPmmhcF66B/88PFTTk6XWTD+XPmFQI6v22eJfaObKd9r7QDg+/HzVxKUVFD9rRzcqcdBDnKQgxzkIAeZr52ZL8bZr+7RYRPTzwXm3x+bEsf6usvZ93sAAAAASUVORK5CYII="]],
                                [  5, ["Scuba gear required", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAFlklEQVR42u2dPUwbZxzGH9xKzuILquQsvih2zGIy0Cz1oaaFoT7UVGTArnBwh8RRokzgqKRZECE0HQCjQKeqVQ2tlBQkuwtVq9gZHIWIc4ZSUtW3APbgm8xQnScmOvijxtz5PmzAH++zwd29w8//j+d97967joODA1Sqy2qzAggA6AfQg/bWFoA4gIXtdCpdebCjEmCX1bYAYAxEUlrcTqcCkgC7rLbOAukewkkxIvu306l/AcBA4GlWD4B4gVkeIIApAk8zxCkA6LBfsFoBpAgTXbIZCt2WSJ8ChoJVIdKnfgOpfbXVQgNhUJsIQAKQACQACUAiAvC09K7WC0YDyhMXIZNBJBwmAOXgzATnFM9LcBwymUzLA3znvc7OKS0X8MkkhIwAF8tWPY86exaxaJTUQClFwmE8GL9f9Zwhtxs0TZMIrCUS2yEKa+rCSpHYDlGoOwLVRiJ9/jx+W1sjEagnEnO5HBafLJAI1BOJPM/DN+zFXjaLEZ8PI1/4QNM0/trcbCmAHfYL1oN6Duj2eHDjlh++YS8sNI1nqyswmUyl428SCdy9fQeiKBKASvruh+/xict1NFp5HoOfXiU1UEkURUn+3+FwwO3xEIBKqjaVG70XkAVMABZT9Z+k7DGLxYIbfj+pgUop/PL1+qEmUmlz+j680tQNpW42Rkr7+/vYy2ZlTbbRaIT53Lmmnu4d+4JqJBwGz/MtO9071ggsandnp2rX7b50SXIB1sWyWPr5JzC9DMxmM/ay2YZL92OtgWo8YVE+73UkOO7/OTRNI77+6sh5giAg9jyKBMc1ROqfGEA5IHLm2u3xqFr5fhGLIbGRh3kaK+AnksIACqnXASfDSB43m80QMgL4ZN76jN0L4KLdrjjuRbsdH/f1QRRzpesoiiqN0/RNpFzLoRByuZwqc23R2FgSHAcXy2LI7cZMcA6z88HWAyiKIh4/mlZlrpd/DKkeN5fL5QEOsIe6u6O7u7UAqrE1N2/5QdM0IuEw+q98hG+mv8aLWEwx+miahsViUTUXb2qAAKpGoclkwux8EC6WhSiKWAqFcPf2HXRZbfB5r2M5tHTkB0hscJJmvdzy3PT78Wx1BdvpFNb++B0Tk5N1AXxiXVirrSnqTSKB2PMoOI471BhomoaTYeDsZfDtkwVMPJw8NN6vkQi++nIcFEXh6eoKHA6HZOqPDHtrajinBlDJ1sjVulg0WrIt5RHm6O4uRWH5kxGz80EMud2q7VPTAATyj4mMBvRviuJ5vmSqy014eQ388+2W4jiVJr7ha6BaW6Mkh8OB0cAYnq78gs2/32J2PnhoXq22C8t504YHqGRrtMhkMmHI7UZ8/ZXm1e5amsmppnBRL1+vH7EgterB+H3EolFVKQwAg1c/09VMTmwqp+TjBq9dg9ForNuYLpbF7s4uhIyA9y9fVjz/zJkzuhYnGuIBSz6ZxMiwF4Ig1HXcmeAc0qlUVeNebEZ6S0lDpHBlQXexLJy9jKR305vOAOD+PF8buQ0OOVHEUOFv37BX9zpjwwGs9IpOhoFrgIWTYWTvraiFKLVoS1FUTYu0DQ3wiG0pmGXXAKsrOuUgNuVUrlZRFFVKdSfDqO7i9YbYtAClopMppPsHTueJQWwZgJXR6WQYzM4HZetmvSC2JMDyqKx8OqzeEFt6o03RX8rNt2eCczU/5NTyO5WOG2JbbPU6TogtXQO11kQ9CwpttdlQKRIZHeuCbbdbsxrE8tuiBKAOiHoeDWmrGii1WDHxMH97M5PJ4PGjac0LC20NsB4iO9YJQAKQACQAiQhAArCJAW4RDLq1ZUD+7b1E+hQnL6GtTTZD4fXmi4SFZi1up1Pp8vdIk1qoofYVmOW7cOG15v0Eomp4pVfBk48RaE9b6Y8RVEC0gnwOozzi4pD5HMZ/k0SAdf/ciTgAAAAASUVORK5CYII="]],
                                [  6, ["Recommended for kids", "data:img/png;base64,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"]],
                                [  7, ["Takes less than one hour", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACK1BMVEUAAAAzMzMkISEkICAjICEkHyEjHyAmHyMkHyCAgIAjHyEmIiNBPT5RTk9bWFlhXl5WU1RKR0gxLS43NDR0cXKsqqvc29z6+vr////s6+vGxcWOjI1VUVIkICFubGzBwMD8/Pzm5uaXlZY+OztjYGHY19f5+fmdm5wzLzBST1DJyMiZl5d0cnNeW1xIRUYyLi8pJiY/OzxVUlNsaWqFg4PAv8Dy8fGJh4iSkJD+/v7W1dWIhodDQEEuKittamuzsbL7+/ve3d0sKCm5t7jh4eFCP0C2tbXx8PHX1taBf4AoJCWVk5TNzM2Bfn85NTbo6Oh/fH2joaKNi4wqJifS0dHCwcEwLS18enppZ2ezsrIlISJcWVr4+Pj19fXIx8cnIyTk4+M1MTLi4uI0MDGbmZqrqaq4trf39/f9/f1IREVCPj+9vLzMy8vt7e0vKyyioaFXVFVaV1eCgIE1MjP09PTEw8Pq6eqYlpY7NzinpaVOSkuHhIVZVldhX1/l5eXDwsIpJSb29va+vb25uLlLSEng4OCcmpuDgYGGhIQvLC2hoKCMiopvbW2amJikoqM8ODmLiYnf3t7l5OSamZmqqKktKSpEQUJzcHG7urpAPD1QTU5PTE1iYGDp6emmpKSRj4+npqZGQ0PR0NDv7+/Qz8/Lysqlo6SEgoJFQkJTUFDy8vKAfX7T0tJxbm9dWltHQ0RraGmtrKzu7u5bWFjFxMSysLF5dndkYWJ6d3hvvgNIAAAAC3RSTlMABVWl2fP/UdwCigIZxugAAAM4SURBVHgBrMEFAcQAEAOwHoN/vw8jA2uCg6h55AvhpoJHdRJ04TSbJDv426RZ/FQSFSCdRC3QpFJYUhk8qRyRVIEk+2rUQOyAm4eXj19AUIgqBgqLiIoBSK8HLjmaMIrjh3X0Mpr/2rZt27Zt2woXse18xjhZ1ExXzeQe7I5+7e77mPgRO3sHR6c/Ap2cXVw5HTd3D9tBTy/k4O3jaxvo5w8AlwICg4JDQsPCIyKjvAGIjgm1AYyNA4hPSBQnkpSckgqQlmgtmJ4BkOkspGRlA+QEWQd65AI5efm/N7+goOB4XxQCrkXWgMUlZzarFDhxXpYBlOuDFZVAVbWQwV+pMUFcrTZYB1ysFwagaGiEpv81wXKguUUYgiIQaG3TAhNTob1DKEDRCXRpgd3QEyyUoFMV9PZpgI5AgVCDot8EAxrgIAwN64BiBBhVgmPAuNACJyZhSglehOl8PVDMQO+sAsyfhDmhCc4DCwpwEVjSBcUyrCjAWJhc1QZHYC3fGFyHDaENLgGbxuAWbAspbVPAjvx8SgSSDUEnV9iVfrfXCsBl6YMk4IohuAdc/fHv3HEGAQD5QpuEa4bgLDD241/kyOueBtcNwRvAokVwXwIPYM4QPHe8yfbHuQQA/GdukzsNwZY4iJR+5msHwIDZg+JgCIpDODLz6CyE1Ju3pPdvA3eMwSm4K8zk3t/VFk7s+8pLrylU6GYETOnG4APgoTa4DIPCGBSP4LGuNw88UYFPYVp3m2eAZyrQE9jV8yYm4bn6IZULL/Z0DwkRatATKNDx+k3wUudB/wrW/ld7TlXAog4YbqG1yFWEAb2y9Brwb1F4gUB0lh7Y4n9c5+Qc1znXf3X7YVsrsGI0ONWYgDf6lXizCTh4a3FUGwHoEvqgeDcNvP8gdZLj0s7jFmtAMfsRoP2Tk4WxIrXU2sGnog4ArwWzg8+Lf2wYzQIPASDt6Mumr1svBOyabYB1zTI29pPVeWww2SSBDZgKkt29zZPG6I+Kz9hMWQdc2XOLONy0uVu3JVNhiCDeZrvO6uU75GQ06DKIMWog1QfTqD7cR/UBSaoPmVJ9UJfaw87UHhin+tA9DSYXqD79AQCnYzDyOUr7VAAAAABJRU5ErkJggg=="]],
                                [  8, ["Scenic view", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABMlBMVEUAAAAmISEkICEjHyAjHyAkHyEjHyAjHyH///8jHyDt7e2DgYHT0tJua2yHhYb+/v53dXXLysotKSqKiIgnIyQ4NDWenJ1gXV5kYWJ2dHRTUFCamJjc29x7eHlwbm5dWlv4+PhCP0ApJSZvbW3r6uq/vb5PS0wkICF/fH02MzRKR0hraGl+fHyfnZ2zsbKPjY7m5ub8/PyXlZY9OjteW1xyb3CTkZGmpKTGxcba2tr29vZWU1QyLi+rqapST1BmY2R0cXLx8PGHhIVfXF26ubnOzc5xbm9RTk8qJif6+vrJyMjY19fX1tZGQ0NZVle4trd6d3iNi4yura3BwMDi4uIlISLz8/M6NjdNSkrf399tamtjYGEvKyzu7u61tLTs6+vn5+eLiYllYmOnpaUpJibl5OSYAyp1AAAACHRSTlMAPbLm/Xr+e+5HUUkAAAFqSURBVHhe7dlFbwQhAIZhRraFWZequ7u7u7u7/P+/0N2kpB12MnwknKa8J05PuHD5IIRYtsO05NgWKRarYNpyY4RYLtOYaxGbac0mjl7QIUxz/ww0oAHrKS/FgVrKq4sGaMBuj9fLwQ2P1xG1l9Ly5auZZUqHEVZDfcVhcJz6amLxElAtgicwmMXAThRsb8VA2gaCCxQEMyCYR8ElEOxCwTsM7FlDQdoHgf0UBgcgcBAHhyBwGAcTEDiKg2M5AJygOEgnAXBKBZwGwBkVcBYA51TA+YIUXEyrgHRZCq7QAHC1sVg+CFyXgg1B4E8B4KYU3CoHtzm4Uw56MnB3T+TS+7nf6x8ciuKRBDwWvSrmTwRPJeCZKnguAS9Uwctw8OpaFaQ3oeAtVQaToeC9OpgKBZORAA1oQAM+iF76UQCfRDATChaeX7y/vb4xofdswtfHpxkxDKieAbXPztqHcf3TPal0tX4uaP/++AaLafccbi3X/QAAAABJRU5ErkJggg=="]],
                                [  9, ["Significant hike", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACRlBMVEUAAAAkICEmISEjHyAjHyAkHyEjHyAjHyH///8jHyAuKiskICEmIiPx8PEyLi/4+Pj8/PwpJiYoJCXR0NDn5+clISJ9e3uHhIXS0dHs7Ozj4uNcWVqAfX7r6ury8fGVk5Tc29ySkJA+OzspJSbo6OgvLC3g4OBTUFDs6+vi4uJAPD2Zl5c2MzSvrq749/i/vb7Avr+sqqu9vLzZ2NhqZ2hLSEmjoaKTkZEtKSpaV1erqao8ODnGxcUwLS1YVVYnIyT09PSFg4P+/v5DQEFRTk/u7u6Ihod0cXKmpKRKR0j5+fl3dXVCPj+Rj4+Bfn+pqKjp6ek/Ozzz8/OenJ1jYGFua2yfnZ3NzM1oZmbh4eF6d3jl5OSPjY7Av8Df39+6ubnm5uZzcHF2dHSQjo9WU1R7eHmzsrK1tLTw8PBdWluhoKBnZGVIREVJRkdkYWL29vZ8eno8OTrW1dVBPT5UUVHY19draGmCgIGkoqP9/f3Qz8/b2ttlYmNubGxpZ2fy8vJfXF36+vqKiIjt7e1wbm47Nzjd3NynpaWLiYleW1w1MjPe3d1PS0zV1NW7urrT09Oxr7COjI1HQ0R1c3NZVlcvKyxST1DT0tJVUlPa2tpNSkrZ2dnHxsfEw8P19fW4trfX1tZsaWpxbm9FQkJOSkvf3t6UkpLv7+/LyspiYGDMy8ucmpvq6erl5eXPzs5VUVKgnp7CwcGBf4BtamvGxcZXVFWDgYEqJifU09T39/csKCkrJyh5dneura3KyclbWFlyb3C+vb1k5QwLAAAACHRSTlMAsj3m/Xr+e3//bV8AAAMPSURBVHhe7dlVk+M4FAVgB3r33jA3MzMzM3MPMzMzMzMzMzMt7z+bkWQ7ST9Kqqmaqj5v5+WrRLYsS1YUxWgwoZSYDEblRyJ+Q2kxRyiK0YwSYzYqBpQag2KSC5oUlJyfDE6A9SlSwdhSAHu/Rxq4C2hmyQIde4BluiRwM6gpkgRu0cD1ksByDZwsBqYn2WsO0bKEeUtrxcD9ABA9TOkS4s2tRiHQHU+U3Yiek5meZQsmz7egGBggXrbN2pwFkBApPvX82fTOc/8PNBXC4EHCzPDcATXVouBdogTiQMtiQXCMIL42pw4+sYqBTwkyUAfBZAqBCwnxcieEpF8IpNe22RsKvhYBVxEhay+EZptDACwmQkc+hGWSADivB6B9XUE4WCwA4obcTXGLIDxDNsEloBDGxdsqBFY5Q6xsKq5ZKwKOhXhF3S5WCvP4wcSg51qJy9USvYIbvBkEuxBxdZRaBqs4wSzdGznOxkAlMzbygT06OFMfVi/trkobDzhNB7einmfbibjDwwPW6GDTpaDYCwAtV5EHrN2ni+91wHEACjojkQvMAT2HdeAIHVE+8CgEc0wFLrfAiVRe8FQIeJoB/jMAscgJtoY9XFMoEAdwFnnBcxCaXALkJYCdfy6XhoHtbkTMBwggL3gewnMB8SKA18oNJqvQHBW8go3XwHUducEk5tzALlXM7BB6g+3WVzrbRwbeug1pFn4wkSlJVkTHbFBzD/lBFblPyoMEbd/DDz5kxCM/bY9pKcgRAHMZ2MlaGS35KADGUCLDxlofbc8FwDag6dV6E2kjAuAL6sU0an0K7QJj+Cp87+lmy8tUbvANsB3AuGmYzA2+pUBAq31OdVrzgtY0AvhStf4OXGxMecEGIBnQ6geAUR8V0znBCuINudVmSQOfpYSCn/hAfzwBP2t1FKAMK9mP5gPrMwAg/ovayl1QiDiVgoN8IOZ9BYgM3tPfhhFTKBjFCaKlLvoPtfz519/0j9rB+U9iLC+Inn9xXP5rSP0lT+cmQOnHztIPxuUf3Su/m6V+XJD++eM748Y0tzPScAIAAAAASUVORK5CYII="]],
                                [ 10, ["Difficult climb", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACLlBMVEUAAAAmISEkICEjHyAjHyAkHyEjHyAjHyH///8jHyAnIyT39/ckICH9/f349/jr6urk4+O8u7v7+/srJyj+/v5ST1BWU1STkZHs7OxIRUZua2xsaWpHQ0Q9OjuQjo+XlZbV1NVXVFVMSUlkYWJ8enre3d3My8uVk5QmIiO9vLzGxcbKycl+fHz8/PwpJSZKR0hvbW2UkpM3NDSDgYGtq6uJh4jNzM0oJCUlISI+Ozs0MDHd3Nzo6Og8OTq2tbV6d3g2MzTy8fHT09MsKCmzsrKCgIF2dHRVUlO+vb3f3t5eW1yenJ1GQ0Pj4uNLSEmioaE5NTa4trfDwsL09PTJyMj29vZDQEHHxsf5+flfXF13dXUuKisvLC3h4eFpZ2fs6+tCP0C5t7impKSWlJW5uLmzsbLq6eqBfn+7urpxbm+Bf4Di4uJPTE2npaVCPj+EgoJYVVbb2tvx8PGLiYm/vb7MzMxraGldWlvCwcFoZWVAPD2Zl5ejoaJTUFCwr6+pqKhmY2TEw8M6NjdBPT7GxcWOjI1tamuqqKmMioqHhYbX1tadm5z6+vq0s7PW1dVoZmasqqvU09TPzs5EQULt7e3z8/NNSkru7u7f39+amZnAvr9lYmOkoqORj4/v7+9UUVFhXl5iYGBqZ2iKiIh4dXbc29x0cnNZVldnZGV/fH2rqaopJiaop6e1tLTT0tLZ2Njp6el5dnefnZ01MjNhX1+Ni4wzLzCysLFbWFjFxMTq6eStAAAACHRSTlMAPbLm/Xr+e+5HUUkAAAKPSURBVHhe7dnTkyxJAMXhaszuL5sY2rZtXNu2bdu2ba/9393pW9PVHbvzcjPz6e6cpxNxIr6nisqITMMwbHaH0BKH3WYMJe47oS3OOMOwOYXGOG2GXWiN3XDoBR2G0JxvCxwFk9LCGasN9KwBYLk2MAnN4ETdYEAzuAnNYLYk+Hfy1swRh0I5cCowc8IIQypS4F4AOlr+u2TJgSsBIONfQ13BjJAc2AgAJ2KHk9lFXkAO3OIGKIsd5s8DpEGRnwJzp5m9qrqmdlWhFyVQuPIyhWhOTUue3l4JsLFDGpxQ8DBeuDLSH3dtD2EmJ2uKmCwN7oYl1W4iqZxV3zo0HEAaXAzbFmDGFxzTZg7d8uBsmHMaAAb6rWG1NLgQWLQCANZHh6XS4DLwiSAAtFpDKtJgLgREHwAd0WFQHkyHG8IPwA/RISgProV1rgQANlhDS688WAybOwEgzxoSkQfPQvJTAHZ4rGGnArgLKvYA0BUd/lEA98H+QQDGWEOVTwEUbRklBwE4dNg6sZADrRzBjP/osfjwUKsKHseKu7S7TjSpgqeIDYkhVfARsfGeQRUcB1BWnHXufP0FaL+oCvb7gEudkS/w8hVV8CrANbNfh4kJqmAD4L1p9gA0oAh6bsX8um7DOFUwF+CO2V1w954qeB94MNx7YDyqYFhIGu6T4Ik8aBmUR4axkKAKNgLPYk4YVMEm6Iv0573qYI8XXgz3l17UwVfw2jxM4gdAAxiEN19KZg46wHg3gZJweZuCFvAdvA+XihB6wA/4PwrR/An0gJ4U/EU//vQzWsDEX34tx4o6+BuATvB33eAfusFSveCff6EXrKn/uuT/Dy/TRkHt187aL8b1X90b3zu1Pi5of/74DLlQPj5rt3wwAAAAAElFTkSuQmCC"]],
                                [ 11, ["May require wading", "data:img/png;base64,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"]],
                                [ 12, ["May require swimming", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACSVBMVEUAAAAzMzMjICEkISEkICAmHyMkHyAjHyEkHyGAgID///8jHyBPS0z+/v4nIyQmIiNUUVH8/Pysqqu9vLwzLzDHxscvLC13dXVVUVI1MTLy8fGxr7CFg4NjYGHy8vLf3t5IRUY8OTo+OztmY2SEgoJoZWWDgYHAvr/4+PjBwMApJSYuKiurqaqenJ0rJyi3trb49/h1c3O4trfr6uo9Ojvz8/NZVleIhofJyMjCwcGgnp6WlJU8ODm8u7tGQ0OhoKAyLi+pqKja2trOzc6KiIiamJjo6Oh4dXZgXV6wr6/U09SnpqZaV1fIx8fAv8CYlpbn5+dwbm5BPT5CP0CioaE/OzxiYGDt7e1OSkthXl5RTk+vrq5VUlOfnZ2ysLHp6el2dHSGhIR7eXpbWFm/vb6MiootKSovKyzV1NUoJCXj4uOHhIXv7+8xLS6mpKRXVFVoZmazsbIsKCn5+fn6+vrk4+NbWFhQTU5vbW3Lysrx8PFHQ0Tb2tubmZo4NDWJh4g3NDSXlZb29vZPTE1pZ2clISKNi4xeW1z9/f319fUpJiaBf4DW1dXs6+tYVVZqZ2hDQEHh4eGAfX5LSEm+vb1yb3Clo6SjoaJsaWrS0dGRj4+Ni4uZl5dIREW2tbWUkpNNSkr7+/s7NzjEw8N0cXK7urre3d1+fHzu7u5tamvg4OBlYmNua2yqqKnMy8tMSUn39/ezsrLNzM3d3Nxxbm+1tLTc29zT0tK6ubnw8PBnZGXFxMTl5eVTUFB9e3vGxcZCPj/Pzs40MDH4QKDzAAAACnRSTlMABdlVpVHcivMCTJXbAwAAAsxJREFUeF7tmVWP20AYRR3YbPabMC0zMzMzMzNzkZmZmZmZmeGXdW15anebbOvJvFTKebtSdOyZ+I7kzwyHTKGUq5ETqOVKhYz5hZsKUUDlxus83BEl3D04IfbRMHLrRRSZW7VMRVOokjEKRBUFo6QrVDJyukI5o6YrVDOIMi6hCJfQJUwL3bO9MoGK8IDGM6feB1iO5zkp3FaV6VtiBIFIYqE+6FV59mGYzz4bmTChMADsYyETZoMDDpEt+Qg4YEcGmdAP7FJhOknYlFmYR1SNKWzUQt6UIBAYbLjUfFnvbFMasC7fm071Cq7jtYZQ6nIb8DxHAoa7ZckhhELLBl6o7cGCnk3AstxCVr0w4FnP+7biSqd6EQl1gdi4i8trtIBZHUsiRKFYEKhjyz0DAkuIhOgjFhycC+dARNIKIuFOLOi0IRQPYpaSCP1LAFOOUC+ICZcu1FjFTU5DZ527wxBfLYgZQEPO7OHizVHwO9q1RenE/3LM8Hv4gyw0C4TP4boZsEc4ygGSptSdB/vc0aOOQcld3mgGh5xASLc3YlzKabOl1giO6ZyUeB5OXNgPC9IoSbh7JBX+QlKwFGHEIuBYFenZ12q4dXslcPiYjmqO1UV850KvpCXruuNTTtV6FvHRdvpMfkq//zQfg8PixkwX9f8kzBv2tZoLu/GPNbmJWVeuXsOX6WgzW6v9buAKVZpuRhc3TzgUtvtnlvKlvVd836AJbXyAD9XchxqvR4/5jdA+8at6Ojoyxm/Es5ShjEm7wjggZtn/LPR5kRj9UhA0WV/XVwjxTXRiaQBgot6+M08ZFxIGVH+IYUPL+BQr+BT/GbF49TexsaasnU0x4QPp3DOabGOj95evRgfCby06IXh3GcRdCDZ0/RDSdGtfwQohxgZZXK9m0nAJXULqwzTq4z7qA0nqI1PqQ13aY2fag3H6o3v6Hxeof/74CTdXabdjIWdQAAAAAElFTkSuQmCC"]],
                                [ 13, ["Available 24/7", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB71BMVEUAAAAkICEmISEjHyAjHyAkHyEjHyAjHyH///8jHyBFQkLc29zu7u4lISL9/f36+vrs6+v29vYtKSr+/v6dm5wyLi+Rj49iYGDY19fGxcXz8/Pi4uJEQULZ2Njb2tuWlJXr6urDwsLOzc50cXIpJSZpZ2cvKyz39/cqJidTUFA1MjPR0ND4+PgmIiOysLGIhofFxMTo6Oh1c3NST1CzsrJ6d3jKycmMiooxLS40MDHNzM2Bf4CrqaokICGPjY7S0dFRTk9tamtDQEGNi4v19fV4dXb5+fk2MzRbWFnv7++koqP8/PyamZnp6enx8PH7+/u8u7suKiuamJi5t7h/fH3Hxsc9Ojtyb3BJRkcoJCXk4+NIRUZBPT6pqKi6ubk4NDVcWVpNSkq7urrl5eWAfX7Av8CBfn9VUlNfXF3n5+f49/g8ODlnZGWgn5+KiIheW1yjoaKGhIQ6Njc5NTbU09STkZGYlpZ0cnPq6epwbm7e3d3s7OyzsbJZVldHQ0RhX19bWFjGxcbBwMCwr69+fHyOjI2npqbAvr95dndQTU6Fg4NmY2RAPD1VUVKura12dHTZ2dl7eHnT0tLj4uOVk5QvLC2xr7Dy8vLW1dW2tbV3dXVgXV63trZOSksnIyS4trff3t5KR0hYVVatrKy1tLS+r6GTAAAACHRSTlMAsj3m/Xr+e3//bV8AAAKvSURBVHhe7dlVj9tMGEBhZ5Ntz4RhmZmZmZmxzMzMzMzM9H0/tG5AO5Gyzladi6rKuXovnEf2OFaisaZpcSazUJLZFKfpxa8SyrLE6+dnEQqzxGkmoTSTZlYLmjWhuL8VjIExMAbGwFmrnkqwC0hRCTYBCQpBrwtIVggmAy6vQjABaBIKwRSgSyE4DPBYIXgeSKv8DXBjXXt+hgHYAcyIFYOl3QDUnFwStg5A6hKwE2j/dSRSa5cDk4cIdK5ehNqMDPYBXFkpWGYnVHpBaAmcYeAtYFKsFMwGcu7dH8wBqoPCbsLAeeCJ0POWBqsCrMuAG4C9+pDhgswAcJQw0DEF5Au5DVAuIoPDhJwaGPIPne9wZklgD8AJ2dsG7FoG7PN4PA3+aQdM+4c66JiXwGYgS8jdBFdr1CclEy4KvZL9HDgog9eBw7JXVAxbRDRwO5Ar9PphQkhgSQXwUAYbgcJoYGUesEcfytKYSpTBfcB4kQy2wej6aGACYPfqwxgcETI4B7TJXgZwTEQBjwP06oN1mtqSMPAUcFoGzwD1UcCzPmBO6M1Ao5DBVh/wQ/IctXBBGIOHxoFLQu8y2BxhYC8wIK/YVaDfGLxWASz6P3QDcpP0bOBuuC307gB3hdT/4FtjCPakAd2B+5iHlP8c04EHkpdYAYvCCFw3CqQkisjgI4DvErAAPDUCrW4gqyyoDyYFegbpSfk68BxwC6kX4Jk1Al8CvlcLgV5LC5UaGqiSrwd4I4zAt0htCoHvg2CnHfgQ/gDw0RC0RwQ/BcHPANI9/eKGSYchmBMR/BoEq4Fv8jcWmPiT3+VcYEzhH86CYqBQITgCOFsUgtlAuVAIlgPZCsEWJzCiECwEigsUgs02m+2/2BbBPwzGwBgYA5VvOyvfGFe/da+ttih9uaD89cdPhL4mwx2HT04AAAAASUVORK5CYII="]],
                                [ 14, ["Recommended at night", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACNFBMVEUAAAAmISEjHyAkICEjHyAkHyEjHyAjHyH///8jHyD+/v4xLS4lISLo6OjHxscpJiadm5wkICF4dXa2tbUvKyyAfX7Ozc78/Pw1MTLZ2dn4+Pjg4OCwr68uKive3d2Bf4AqJifp6ekpJSZCPj9/fH1ST1DAvr+UkpJJRkfAv8CamJh0cXJwbm7m5ub5+fkoJCVZVldPTE1UUVGgn5+DgYGkoqPR0NBCP0D7+/ugnp7w8PD9/f16d3h7eHlfXF2EgoImIiP6+vqRj49ubGxgXV6fnZ3My8s9OjtLSEm5t7iamZk+Ozvz8/N7eXqqqKlEQUJIREVGQ0P49/impKQ2MzTMzMzt7e0wLS2npaVBPT5iYGDn5+d8enonIyRIRUbx8PHFxMSVk5RhXl6Zl5fk4+N0cnOpqKjy8vKHhIXd3NzY19fi4uJkYWJRTk9oZmaSkJBtamvc29zS0dF5dnfU09S7urqHhYa3trb19fVaV1dMSUk1MjOYlpb29vZXVFXV1NWMioqKiIi0s7ONi4vb2ts0MDHs7OyioaF1c3N+fHy9vLxlYmOFg4Pl5eXq6erGxcUsKCnDwsKenJ2PjY5eW1xHQ0StrKy4trf39/c5NTYyLi+npqbQz8+8u7v09PRbWFktKSozLzDs6+urqapoZWXLyspqZ2isqqthX19DQEGQjo/v7++lo6RbWFjh4eGura3r6uqcmpvGxcZYVVY3NDTj4uNdWluysLF2dHTl5OS/vb4rJyh1w94kAAAACHRSTlMAPeay/Xr+e7TLcqMAAAKySURBVHhe7dnlcttAFIZhxXbab2UOMzMzMzOXmZmZmZmZmZlvrklqpVtp06ys/dNp3gt4LHlmpTNHkiT5mE1ESCazjzSY7wQiLIuvJPlYiMAsPpKZCM0smcSCJokI7h8Hx0G3aNBvaYxYMLLM7uclaFvNFNcArVO8AtNjnSwwJBhYkesF6I5CNGHVBGDXbv1gBmCPY4H7AKAjUS/oPgggkAWmYKg5KfxgyPSCwrmZAJC1fMu8RXnqnwrDUKFObtBaBCpZc5nLMFwpN0gCJmGk8gqiLhXDyXe4QXLXoXjB6UTTVPyqiB8kMRs9YCUZHcR8fpAoN/2YAT5RwCAd4BIP+JwBRkCphxtsBvD6TS3gzwBToXSAG1yJGTNnkWkR5esYYCaU1nODG046h4HZ/tkaz4rfDYh4BeRQ4DYR4AIKrBQBLqTANgFgHqgiBICLQXXZOFhcAqou4+B+0N0wDK6SQZdsFAwIBx3WGgX98We9BsFqlddXYwwMlFXgJmII3Ax19UZAZynUbf1hANweCk1dxGvQmpwFTWHNfKB2VtuxswOMXIQPfLVnbzylXetMCgOrskOcIHEBhx1Hoiv8jh5zHY+SwU4+QXhBZyg4atMxzrWfwpg5anSApPg0xujMWX0DZ48dfy3JqXckDjmH0ZPPZ+sf2t0XgsEO9osUcIn/pHRfAaurjdcpoOGmnqOXeKsWqm6nDRC6IFTpOsv3Oh19GOn+g4eq50sD8IgHpLP11telNRa6Ep4+cxN1QQByBK0IAnIz6loBIDw/sKrdbRjsfQG6l4ZB0jKZ8vpFrAh63kIpX8zOoTvW470TtcR47wE/iAKVfzFBEPgRQMknAP2CwM+Qv8Tbvn5DkyCw+nvLEBBXEC4ItCpApO0/XKaNg8LXzsIX4+JX99JEi9CPC8I/f/wEEwApwbzdgB8AAAAASUVORK5CYII="]],
                                [ 15, ["Available in winter", "data:img/png;base64,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"]],
                                [ 17, ["Poisonous plants", "data:img/png;base64,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"]],
                                [ 18, ["Dangerous animals", "data:img/png;base64,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"]],
                                [ 19, ["Ticks", "data:img/png;base64,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"]],
                                [ 20, ["Abandoned mine", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB7FBMVEUAAAAmISEkICEjHyAjHyAkHyEjHyAjHyH///8jHyD+/v79/f0lISL5+fkkICEoJCUnIyTQz88pJiYqJicvKyz49/jU09Ts6+umpKTHxscmIiOPjY7u7u6Bf4DGxcaQjo90cnMrJygwLS0tKSrR0NA6NjeOjI2Ni4w+Ozvj4uNPTE1NSkr4+PhWU1QpJSa2tbW/vb5bWFhZVlc3NDTh4eGLiYnMzMxmY2Q1MjN5dnczLzDY19e1tLSrqaqamJj29vYxLS42MzTc29yura29vLy3trbBwMBDQEHCwcHAv8DEw8M4NDWUkpOysLHJyMguKitHQ0QsKCmUkpKNi4uSkJCTkZHm5ub8/PxkYWJxbm/7+/tST1D19fVtamvi4uJIREUvLC2gn588OTq0s7PNzM1FQkLo6OjMy8tIRUZhX1/X1tYyLi/Kycm8u7vy8fHFxMS5uLnDwsKXlZbT0tLy8vJsaWrOzc67urq6ubmkoqO5t7hVUlObmZq4trc9OjutrKz39/ezsrJ/fH1cWVqwr69APD3Ix8eHhIVdWluYlpZpZ2fb2ttvbW1bWFmtq6tjYGHr6up6d3ivrq59e3tPS0xLSEnV1NWFg4NVUVJubGxMSUloZWXv7+9gXV7W1dV7eXrZ2Njw8PA1MTKRj4/zGcPgAAAACHRSTlMAPbLm/Xr+e+5HUUkAAAKZSURBVHhe7dlVj+NKEIZhT5LZ/coOwzAzMzMzLTIzMzMzM8M5f3RbViu9kGSSuO523ovIV49KLbXklDVNS7HZiSW7LUUTpS4jthypYj4HMeZI0WzEmk2z84J2jZj7x8El0M0NbsrLPHk/wHqG1TtyaiYKgpxn6CmoRKinlgFUZG460NbOeVOKy04DJVWcN6U0EzAuFPGB5M7XgfR2zptSsBHQyxlBWn8dQH0hH0i3XADSOvhA2mIAGCrlA+kBRC0VfGArRFg7zgV27IXZ8/08YNdByHJec4CH3iLc0ffWwYE0qLC50SpYdAq/FTpgETyDP3I9tAaWQ7Yu/LDBCrgKsso9k5AZnUmDytt6leoaINNzkwSV17JTAJ4jkKE1GVCdX8m2UhPwHofsblbioPJ820nmHYVZW3EyE5ZJ72yQwmXtgsgXpIRB5e0Wnso5C6QVUcKg8vbNk0yKL7u7KAkwW3qH/zot9wAlDCpvbgXPq0i+9DKFZx1U8+UVEgOo5jsWIBbwf+mdCBADqLwxP7GAq6U36ScGUHkNdcQAKm/EQyzgGumd8xADqLzzXmIBV0rvYjTv0mxV/KDyRrMic/7LBnBlIU5QeT1RPBqCCMa1ivjAGendiOYRZK6bi4PKm3XSYiC64wCbpHc7uncHMuiDi4N0z/SG3dG45qlHCPfY/Jf1xB8LpFwAT6N6zwyokCGAF0BoajoGSK/03kie8w2J+vBrnXIA9MYCqYki9Q7pASIfVOifJ/pQA5HxMfGdQx7QZ/6qhok+6Sb9+Uvi4PTMWCGRN6Okvl96XxeIvpne3KClrUj19x8Ztdm+Ea8AGl0QNVtds3gUMD4BPYd3b/Ofc2lVtQRaj33tzL4Y51/da8sdrB8X2D9//ASBpx1bm2+QEQAAAABJRU5ErkJggg=="]],
                                [ 21, ["Cliff/falling rocks", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB7FBMVEUAAAAmISEjHyAkICEjHyAkHyEjHyAjHyH///8jHyAkICH7+/v6+vpQTU7GxcY+OzsuKiv8/PwlISIvKyxFQkK1tLQqJieNi4w7Nzjh4eFRTk9qZ2ifnZ0tKSozLzAoJCU6NjdbWFnz8/P5+fmwr6/q6eosKCmLiYkvLC2amJjg4ODw8PDm5uZlYmNxbm/y8fGJh4j19fVCP0ApJSa5t7g5NTbb2ttvbW1jYGHT09OUkpL29vaHhIVubGzs6+vy8vLMy8tUUVFtams8ODlTUFDx8PH9/f1CPj/Ix8fs7Ozf39/Z2Nidm5xPS0x/fH3e3d1XVFW7urqcmptEQUK6ubna2tqMiopVUlPY19dcWVpMSUknIySPjY6sqquVk5Td3Nzf3t7l5eWqqKkrJyg/OzyWlJVpZ2e2tbXv7+88OTp0cnPJyMirqapOSksxLS6Zl5dIREV5dndZVletrKzKyclVUVK4trft7e17eXrZ2dm/vb6joaJBPT4yLi/n5+ehoKAmIiM9OjvMzMwpJiY1MjPHxsfLysrk4+NraGl7eHmOjI3Ozc6op6fU09S0s7ObmZqura1eW1z+/v5bWFipqKh4dXaBf4CQjo+5uLlST1CzsrLi4uL4+PjV1NXEw8O8u7t2dHSnpaVAPD1saWpjJn3HAAAACHRSTlMAPeay/Xr+e7TLcqMAAAKJSURBVHja7dlVc9tAGIVhxXbac2Q7xjAzMzNzU2ZmZmZmZub+0VrmpJItOXvRCz8/4J1dzc5q5ltJklLMJgphMqdIPqlLKIwl1bc+CwWypEhmCmWWTBTKJFGwZDAZTAYFBzcLDh4rzRUa3LMDJV6RwacAOvLFBfdDcUBYsOgg/PoEBeU0BLhaxASbEFS+RUhwzoag7RQRrFiBoAmHkOBuhFymiGAuwupJrilcZDCrFiF1bpK3L6z2LiYo30PYVpJOK4BliwhWIszaTrIewPRo4kG7DWFt9Jlba3MVM+Fg/gyCIhstWMnEg0cRZbCKERkJBf9gniZlzV4qTk5nuo0HR2sxT3kruWqdsraiXcCTFqNBeQoLDHMfcIV0boRP7waDwfVYII3sA6xZoU+xyVgwx4oF8kjmTTSQJ+DnMBKMnJiI5gJSLiaZBoXNbSi4Df/qYUANFDtpJDgCFeMe+u29BMxWjxkJHhqHmkoGeA5nGTvY8hGoGshI8ILNhIb3DDhu73IYCH6yQkNdIf16gNkM3UFnDTSdol8egBEqqk7b4wbPQNuMO/TjOiuT585nA9aLcYL9iKWTivTBtKvktevwu3EzVvBWI2JpzrxD8i4VbQgqixF030ccDx4y4BFCSj3awceIb2qSPt5ehPVrBses0GE5ycJniHiuFXRmQ2/wBaKUtGoEX0Jv8NVrROtSD3ZCd/CNDdHeqgYdjfqDfIdo07JK0D0EA0FWI4ptUiX4AXoN5JKUPyIsO0dly8Mu6JdeQFZ0I+iz2sH2fIEBX9tJFn3r6B76/iP9J6kSLIMRv+Le2A0wwvU7btBebEROckSQDCaD/1VQ+NhZ+GBc/OheWmoR+rgg/PnjLyNVG7y6nmNAAAAAAElFTkSuQmCC"]],
                                [ 22, ["Hunting area", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACClBMVEUAAAAkICEjHyAmISEjHyAkHyEjHyAjHyEjHyD///8kICE4NDX+/v4tKSouKislISI7Nzjl5OQ8OTr39/d7eHnS0dHZ2dns6+u6ubmlo6QzLzAqJif8/PzY19fW1dXq6eq2tbUwLS00MDFbWFmJh4h5dneNi4xhXl5VUVK5t7gyLi9WU1SWlJUsKCnGxcVzcHE1MjP29vZtamt1c3Oop6cmIiOCgIFRTk+9vLxkYWKRj49pZ2dCP0A+OzsvKyybmZo5NTby8fHR0ND49/itq6vU09StrKzo6Oj5+fnl5eXs7Oyxr7DAv8Dp6ek8ODlTUFBXVFV8enqNi4vz8/Pt7e2qqKnu7u4xLS5UUVGnpaUrJyjX1tZYVVazsbLr6urj4uOfnZ2PjY7k4+NVUlOamZlLSEm3trY3NDTy8vI2MzRcWVp0cXK1tLT9/f37+/s9Oju8u7tFQkJAPD3c29zLysrQz8+KiIjV1NVJRkeUkpKDgYHDwsKEgoKHhIXn5+dsaWqBfn8vLC2Vk5RDQEF3dXVdWlvv7+/x8PHT0tLAvr+/vb6Zl5eioaGenJ2ysLFGQ0M/Ozy5uLlubGyura1qZ2jw8PBmY2RbWFhoZmbGxcZEQULg4OChoKByb3BHQ0Td3NxgXV64trf6+vq+vb1raGknIySnpqZPS0x9e3vMy8spJSZ7eXqBf4CjoaIoF1MrAAAACHRSTlMAsuY9/Xr+e/kjz/sAAALKSURBVHhe7dlVs6NMEIBhkpOz2wNxO+7u7u667u7u7u7u7m7f9x+3e5eqUCeBDGTuNu8lRR5SRXXBDJIkpdjsICS7LUXCUmeBsByp+P8cIDBHimQDodkku1jQLoHgkmCkJLitUCy4wZm9QCSYlc3YUpGgwjDrYBLM3Hkmn8DdCzv6EwdX1tU6WaTDJb0JgTXVi9iMApvd1sGHZ1mM8posgln5qjBWUUxQafukSlbUWAGVQUYFRqsQV+9y0ZpxRo14zYNzJxg1pQBEQDy8lVFjfrOgK5eMtc8AtCBVtpjEHLc5UN5PxCo/RINw8BCJ0x5TYCsJx9wQC4RlYRJPmgHrB+jmeiE2CD1pCA7sMAEuQcC5HPRAWE3TM8wP9tD5K0CTHwNNw3TFfdxgJ3rXKsGg+u0odnKD6xBcD4b9j+BGXnATw+4Zg1sYVs4JnkYvF+IURrCVE3yEYEY8sBnBUU4wB8Fd8cASmr+4YF2OD9vDIkVLg74/pTE1X7E+2L9XZYzAOWxm83XBA8wS2KgLQoYVMJSlD0KBHzuC0NF5f4sG1Z+XIZVGZxz3gB6onYITEKdSBKc5JyWI4Kl4YDqC1ZxgG4KBAmOvtwHBc5ygPIHieWMwSBe9wAnCRQTDsiE4guAU8IKXGBY08i4z7Ao3CO0IXs3UANcxjVdAg5cL/GD3OIo3PHrPFPmmOnHcINwi4bYeeIe8u2AGdIWJ6JNjgXIfeWOKKRDuT5KR7ooGXQ/Ia/gG5kCoGifE1zUTfDxBnrMLzIJQ9IRRtU89EbDl+QtGBRrBPAgvX6nvm6/fdJPytikjT32HbQMrIGSOOlms0r2WVwHlI9Hcu/eJLCvkjg8ftVr2p89fEl34FAa/hoYIGwo1f1cELc1aCPSKXIATqPxbIM1hpUgwn7EfIBL8+es/t1BQWxJMgsK3nYVvjIvfupdmO4R+XBD++eM3DiQSUqjc4dAAAAAASUVORK5CYII="]],
                                [ 23, ["Dangerous area", "data:img/png;base64,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"]],
                                [ 24, ["Wheelchair accessible", "data:img/png;base64,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"]],
                                [ 25, ["Parking nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABTVBMVEUAAAAkICEjHyAmISEjHyAkHyEjHyAjHyEjHyD////f3t4kICH+/v6joaI0MDHb2ttqZ2iwr6/9/f3HxscvLC0mIiN0cnNdWlvW1dUvKyzFxMTs6+tKR0glISJTUFBXVFXGxcVBPT76+vouKiuUkpI8OTqUkpNcWVqPjY5zcHFWU1RIRUZxbm/BwMDCwcFQTU5vbW3q6eqEgoK3traNi4yrqapsaWopJiakoqOamJj5+fno6OhoZmbl5eXm5uZnZGXj4uNlYmMyLi/c29xjYGFhX1/V1NWcmpt7eXpgXV6trKxCP0BeW1x8enpua2xfXF3Ozc7S0dFtamvR0NDu7u7Z2dlVUVKioaEnIySsqqvAv8D4+PiYlpZLSEn39/eysLHT0tLT09PZ2Njh4eHi4uLf39/d3Nza2trX1tbU09S+vb2TkZFoZWUrJyiRj48sWPdqAAAACHRSTlMAsuY9/Xr+e/kjz/sAAAFrSURBVHhe7dk1j8QwFIVRB2bXGWaeRWZmZmZmZvj/5W4TJxNrmqfbrOTbftJpEz0zxgxN55DpmsH+5qvisJk+xgyTA2caTOPQaUzHgjrj4KFABSqwsbbCOsI0sMaqtODKaicIFIvH6kGgWMM2ChQLpcCgNYgGrRY0aB2gwUIODFrjNLDuR6zp3O8GL5tJYLostLrJNhLYXl5Gx5zkJ4FdnhTocVovBezztnC/aAMUcEeKQ6INU8ARKRZFO6SAUSkGJuw2SQGn5DpttxkKOCvXgt3mKOC8FBeCdlukgEtSTIsWo4DL3laKiLZGAde9bcNpmxRwy5NCTkpwCphxh9LunuUsSgL3u53ljyzXjlPYT0DwhGPBU44F82dYMJvjUPAiyZFg/CrAkWDiGvk7d3ObEQAJvLvPPkT8j0/PL69v7x+fX0kBEEE50kEFKlCBClTgd1HsX95tFKhA+NkZfhjHn+5ZtQl9XIA/f/wCHBnsrKDib/wAAAAASUVORK5CYII="]],
                                [ 26, ["Public transportation nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB+1BMVEUAAAAjICEjHyEkHyAkICAkHyEzMzMmHyMkISGAgIAjHyD////9/f3c29zGxcWioaHl5OSIhocvLC3Av8ArJyhgXV4pJib8/PzLysotKSpRTk/5+fnPzs52dHSvrq7Y19eNi4v39/fy8fH+/v6mpKT6+vqop6f29va4trfr6upOSkv7+/u5t7iDgYHp6elIRUa6ubmHhYZpZ2dqZ2jS0dEoJCXo6OibmZp7eHmtq6t4dXbR0NDx8PHV1NWVk5SMioo3NDQ9Ojtua2z4+PjX1tbMzMwnIyTk4+M+OzuzsrKysLF7eXrT0tJZVle0s7OenJ3q6eqrqapvbW3HxseEgoKamJi5uLlnZGWamZlIREVPTE0vKyyqqKl/fH3j4uMsKClFQkJ9e3taV1e2tbU8OTq8u7uzsbKSkJAkICExLS7W1dV0cXLe3d1NSkpiYGBWU1TJyMg0MDE4NDWFg4OkoqNubGza2tpoZWVcWVrZ2NhdWlugn5+gnp7t7e2sqqvu7u7d3Nzf399HQ0Tg4OB+fHz19fU1MjOjoaJCP0DAvr9LSEkpJSbBwMBmY2Rxbm85NTa/vb7Qz89JRkeNi4wlISKhoKDT09Pb2tvz8/M2MzRraGmLiYlsaWrU09RjYGFEQUKnpqa3trY/OzxbWFkzLzDi4uKZl5dAPD1ST1BFWElSAAAACnRSTlMA2YrcpfMFUVUCULvJcQAAAn9JREFUeF7t2WVvIzEQgOFNA01nwkxlZmY+ZmZmZmZmZmb+mTeytidFreNJ60+nvD/gkey1pdXYEDmcNosdppDdYnM6jH/lW0FD1nyTK8gDTeUVCJA8baJYL2iMVu2w6gStDsMJWnMaNr2gzbDoBS2GXS9oN0BzSjB+r83vLdp5JDivYmVr+8HAlMC1PUvd5ZheV41/YWQy4Kxz52ejpOqWvpEswbi/FjPm2r4uGzDchKLpMc/4fKZZEWKDPWMbF55wMxaYYkeECSaSaDYHJmoumlUxwUU4Vmp+4fjWuNCs/i0LjJcit0YWmEB2RSxwGVKbFg9lblUlgTNZYAl5S9aDqkYCm1jgBgK9oCxAYHmEAy4ncAWou0ziFg7oI3A1A+wn8BAD7HQR2MwAdxG4kQHeQWozAxwisJsBhsmrBUZ9BNYwwK3ifDHaRuAgA+wWN4DRDgLLGGADgbs54J4kiXvV4D4C9wOnAwTWqcE3BB5mgUEC3ynBo0gdY4FeAluVYIK8UmB1nMATSvAkgad44GkCg0rQT2CKB54h8KwSHCawdJQFXiDQrQRLkLp4yavOgyxwGNnlwByYdg4xGeuPZoSutFzNBoyNAFy7LudchQTc4IM3bwFVJwdvC6CXDd4FUXGZrLZA4D5AO/ujPDBBlPVQAI/YS65+DFRzVPFf+IQN4tNRgGdulPf8BYReIh/E+levXZipgeLK3NWbFJgDfT6fRwGmodNA1gwUAfWfgO9R9EEKfhRelA1+QtFnKfhFgCk22NmB1FeQ9m2APNd3Ngg/qrp+/gqBvN+9gw1/QALqTfswTfu4T/tAUvvIVPtQV/fYWfdgXP/oXv/jgvbnj7+lBkQs4/e64gAAAABJRU5ErkJggg=="]],
                                [ 27, ["Drinking water nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACK1BMVEUAAAAzMzMkHyEkHyAjICEjHyEmHyMkISEkICCAgIAjHyD///8kICH+/v4qJiclISI5NTYnIyTy8vJoZmbIx8dgXV6gn5+UkpKtrKzn5+eop6cpJib5+fmHhIXKyclbWFl3dXVKR0j9/f1TUFCRj4+XlZZ6d3j8/Pz09PQoJCW5t7ifnZ2WlJUpJSbf3t6/vb7Avr9CP0CVk5RUUVGTkZHh4eE1MTJDQEFtamvi4uK7urrw8PAvKyw+OzuqqKn4+PjQz8+lo6TT0tItKSrJyMhnZGVZVldVUlPs6+twbm7v7+8sKCmzsrKioaG2tbVBPT7g4OB+fHzj4uOcmptbWFjc29y6ubn29vY1MjM0MDGPjY4mIiPb2ts2MzSwr6+8u7tPTE07Nzjx8PGCgIFdWlvZ2dleW1zMy8tqZ2hraGlhX1+IhoeKiIjBwMCkoqOGhIR7eXp4dXb19fVkYWL39/dJRkeenJ3Y19czLzC1tLSSkJCEgoKmpKRMSUnu7u4wLS0yLi9GQ0Oura3W1dXa2trAv8BzcHGdm5xaV1eUkpOhoKD49/h5dnfX1tZvbW1FQkJOSktYVVZhXl5IREWLiYmAfX6npqaJh4h0cnOOjI3Lysp7eHnFxMRXVFXt7e2zsbJ8enppZ2crJyhlYmPV1NW4trfl5OQuKis8ODmHhYa9vLzOzc7NzM2rqapiYGCBf4DMzMzy8fFEQULHxsdua2wvLC1LSElQTU5APD0NySXUAAAACnRSTlMABfPc2YpRVaUCzm9vdwAAA0xJREFUeF612VWPG0sQhmHD7tpbbfYiMzMzM0OYmZmZmRkOMzOfn5etUitSIk93jdJ5r3xhPdbcfLJqHJTT441zwTvkivN6nERRCW4wkDtBconxYKj4RALRMyXS84LBFp/a6TYJup0ODxjN4/CaBb2OOLNgnMNlFnQ5wHDvG/QlY5M8ILwK8ylB2CwWe8wD7wusSw3+hOALHliMXjuowV8Q/IwH1iHYoQH3ILiWB6YjeEsDfoVgaSbHuyiwNg1YL7CNUC79JxIIZlQD1QoyWErgJQ0YzELwEHxe2VgePHbcX/M9AV+miaRNqOSWFYNsC3pZazQgbEMwBXKFbOK3lVC+dRl+qvoib8OiMbQ9DNXRfuhB8GvQgTOo5MA68Tp/pFe8WelYgUiDAQQva8FUNP4AOC+odGnMHX4LXR08iuAPWnCcgG5IIeCbwHoCckJLI+QMFEtw/AG5yVrwIQHDAHk5V+vyACD/aX/VTQBoKUoaqhgGeDmGUFl+G4EhLTjppwcC6zKjTak7A9CAXidjvr5FsAK0/YhgEgPch2CzHqQfvs0AKxH0f6fzLgishAEeFNioDnxEYCEDHCFwXgc+kw+iB1cS+FwHZsh11YPQiWCfDuyjdWWBvyO4wqf2fCsQTGWBPQL7Uw22ynXlgNnyu8p2yXXlgEcIbFCDTej1rmGBswTWqsEOua4c0Ed7mq4GF2hdeSCcENhJlddFm5TNBE8RmKsCR+W68sDTBJ5RgfMEhpjgfQLTVOBZ9CaACZ4j8IoK/JnWlQsG/AhmhRVgGYIpXBAWBJZv7c3KdeWC1wi8bg1G5bpywRsELrEGi+S6csGPCPzYGqyQ68oFPyHwU2twDsHlfLBFUCErb9BP68oH5T+l3VZgo1xMPriDwL1W4EG5rnwwg8ApK3C/XFc+eIDAZVbgDrmufPBXAksDFmBEjgcf/F9Q/8X2ugWWbQf03SHwbmxwWK6rDRDuETgdG/yAwJAtcIrAD2ODM3Jd7YBFBEZigzUI/mUP/FtQ9eEY/VNA62oP/FfoKrEHZhbowEJ7ILRrPP+gTbBWAzaDTXCJBlxuFxyZVhdVgEYzDxo/phk/9xk/SBo/mRo/6po+O5s+jJs/3Zt/uWD89ccr3MxXA0HuQbgAAAAASUVORK5CYII="]],
                                [ 28, ["Public restrooms nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACDVBMVEUAAAAkICEjHyAmISEjHyAkHyEjHyAjHyEjHyD///+HhYaRj4/l5OQlISJua2zr6ur39/enpaXy8fGJh4hIRUZPS0xPTE1VUVInIyQpJiZgXV7g4OD49/irqarGxcUzLzDOzc7BwMCCgIEkICEuKiukoqP6+vq+vb2op6fKyck8ODmwr68mIiNyb3DLyspqZ2hFQkKLiYloZmYtKSpnZGWqqKnt7e3+/v6ysLHFxMSOjI1raGlvbW2dm5yhoKBlYmOlo6R6d3j9/f0wLS1fXF1jYGFLSEmBfn+8u7taV1fw8PDMy8vJyMgpJSaxr7B8enqWlJWpqKjT09PIx8fPzs4xLS7Av8Df39/X1taamJhXVFW4treenJ2UkpP29vbi4uL7+/tVUlNRTk8rJyg4NDXq6erl5eXY19fp6emKiIjZ2Ni3trZTUFDm5ub8/PyzsbJsaWr19fVZVlempKTk4+N/fH1bWFmtq6s5NTZ2dHRMSUmUkpJOSkuDgYGBf4B7eXrQz8+bmZo/OzySkJBmY2QyLi/n5+fMzMz09PR0cXI0MDG0s7Px8PFkYWKAfX5dWluvrq5CPj+gnp7j4uP5+fmXlZYoJCVwbm7h4eGsqqt9e3t+fHzc29yGhIStrKwvLC09Ojvs7Oz4+Pjv7+91c3NKR0heW1zZ2dkqJid3dXWZl5diYGC5uLnU09S1tLTx6yW+AAAACHRSTlMAsuY9/Xr+e/kjz/sAAALxSURBVHhe7dllb+Q6GIbhzLTdfTzMVGZmZmZm5i4zMzMzM/P5jRtZ1ijpNCdpk28799dIl15LjiI7HMdF6PTQJL0uguOL2gTNiozi54sENBQjOB00TcfpoWl6DhoXBmlh8GZhBmi77hZrAJ4sjSGJoE0QR+1FdWBOdSbhC4KENP3u3DgYv2MrISKQNvHDvyGwjV8rCQFpH04dXy9ozu+hVAjISutbUg6ytUqCrARLjkKwbZCtVRJkXS2MlwfN+cOEdiAU3EZY5Q3uFI+dJ20Zrv8H450mKtjONKMgXRJspEA/xSvrkyXBrAwbE/ZToFIC7GFAHqFFJ6VIgLmEtRM0r8S2qWJgFWEZ5cB9oKVITJjEwCTF4AhoXyTACgZWKAb3LlHALrHkBQ8FPAuKQWKaAnyXJLeNtQRAiZUoAlnRmQ4iBfKVXSsjRDE4nLubdrCwbA2w2xk4GrhTZMk90T44rwh8iGAr86vBpnYI6n1SLg/u8SEYSlbvwwsQVycPzkJQslU84Zwf4pa7ZMHTEHZIPGE3VpcoBx4GcAS0Ai/QIp7wWAhYKwfOAO87QMtKB3xdIjAWeBALFmbcwKQcOAWcPQcazhcDbwVLpqA7GiwkBORBazIQl8XAgWrgskrQDlwZAsubDfivqwMDwI0BsMzjOcAtVeBtHzC9CBay7wEWVeB9wG8yg4WaOqA4Rg1YBNRnI9joIwAdKsDHy0BpDYIh0w00qgC3AE+3jApA5yTwTAVIZl0NeRDkmuuvfi54U14AnnWBfE4IM4nf5QkzXgrAV8C0LOiCsFQxSP78l0bBIvCNOIz2cjnQBFG/Qr96FCR0QiXflFSI+m5TC7ZCXLpa8KfRaPQC7wwALAaDIVEVyOKxldcA4igQBsNgGAyDrFRg0eEHotc8BXxsBgqIC+j9pBRMq/o8TsZqKiROAXlfW4bIt9bOMeXHCmXnZSIH5m+XqA+0Sqnnb/6xu68wqPm1s+YX49pf3XObIzX9uaD574+/YH1hRlBmpQEAAAAASUVORK5CYII="]],
                                [ 29, ["Telephone nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACFlBMVEUAAAAmISEkICEjHyAjHyAkHyEjHyAjHyEjHyD///8nIyT8/PxEQUJ/fH1VUVJHQ0QpJiZWU1TMzMyHhYa4trcwLS39/f1pZ2fAvr80MDHz8/MlISIkICH6+vq7urozLzD09PTR0NAuKiv4+PiAfX4xLS44NDXy8vKxr7BOSkspJSZ9e3uUkpNVUlOpqKj+/v7x8PHu7u5jYGH7+/uBf4BCP0Dp6elbWFiamJgmIiNtamtBPT5YVVaioaHa2to6NjdLSEm+vb08ODnU09Ryb3CUkpJbWFnn5+fKyclFQkKenJ3t7e3c29ylo6S5t7hXVFXf3t6MioqrqaqRj4+Bfn+mpKRxbm9APD11c3M2MzTe3d2joaI/OzyDgYHi4uLNzM3GxcZ+fHxubGzCwcHj4uMyLi9iYGBnZGXOzc5CPj+Ihoe6ubnl5OQ3NDR0cnOamZnS0dHV1NXy8fHg4OBZVlezsbI1MjMvKyzw8PDT0tK1tLRNSkq9vLzFxMTJyMhmY2RfXF2CgIFUUVGSkJBraGmbmZrX1tYrJyj29vZoZma/vb7k4+PDwsItKSp8enqtrKzIx8c5NTbm5uaysLGkoqNKR0jq6eo+Ozv49/h7eHlgXV7My8teW1x6d3ihoKCKiIjs6+s1MTKYlpa3tra0s7P39/fb2tvh4eHl5eVQTU7f39/v7++sqquwr6/Pzs62tbWcmpt4dXbYatv7AAAACHRSTlMAPbLm/Xr+e+5HUUkAAAJ7SURBVHhe7dnDsyRBEMDhHrzdzKGNR9s21rZt27Zt2/wPt2qmeuuwx8zLRrzfIfP2RU3UYSKqDcOwWG3Aks1qMUR544Ate544nx0Ys1sMK7BmNWy8oM0A5sbAf3MF14bWs4EzN8JeRNzCBFZ1REIwXYAxHnDxbsQ9yagAy1Mc4IFpKPKEnWJWMoCp4yibC5vEXM4AnsZsK+GsmDPoYFVbDnSG/WJOpYPVqIp2JsT0ksFrqJoPGTFvkMEpqFoHJWLeJYMjaNbqEmMiGZyMZm7YJuZCKpgqQFUG6sRcRAVhEqoSji4x51BBfSvYkx9BnEUG9a3UwGHEiWRQ30ohzD4WXEYG9a2kfSx/AfpW5gEHqG9lKzCBCxS4hgscUmA7FwhLcmAJG7g0Bw6zgZcxVxMXGI6ovxUuEAox1wQusEaBq7hAL6o8PKD+zTEucDWqKpnA0mIFhphAOKLAei8TuAFVFUxgcoUCnZt5QPiNqjom0GEeMT3EA+oj9vKA+oiPtvOAsANVO5lA2KXAgnwmsBZVowqIDu4jgbBfgQ0HQVYdwUPdJLC/QIkdEjgq7b4iCghBVJ1wnzwFvVLMkEBHH/6tvskRkHuUAsKZiBYbusva5D5HAeE86i5crE2LdWmAAiavoK4C3HJdjRNAuD6Muha4KdctBwGE23c02Oz3Zf17FBDuJ7T4oOxho9yPKSA8adbiU8czefFpPwWE56h7AS/levWaAsIb1I3AW7m6SCC80+D7gaIPiMX5NNAX0OLHUlf5p89AAyH+RYuxVE8cqCC0NqLq67d+lsc0z/fBwI+fv1raO/+f574xkP3Zmf1hnP/p3hhvZ/24wP754w8pRA3NPWkJtgAAAABJRU5ErkJggg=="]],
                                [ 30, ["Picnic tables nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABm1BMVEUAAAAjHyAkICEmISEjHyAkHyEjHyAjHyEjHyAkICGrqar////l5OTKycmUkpOTkZFhXl6Rj4/8/Pz5+fm3trZQTU6vrq65uLk6Njd0cnPDwsL+/v4vLC03NDT7+/u6ubkqJifj4uPc29zZ2NiNi4slISKHhYb6+vqSkJCfnZ2UkpKDgYFbWFj9/f2MiooyLi81MTLx8PGAfX7X1tbT0tL29vZvbW1gXV6mpKSura21tLTo6OjJyMjf3t709PR3dXWsqqvMzMw0MDHAvr+/vb5ZVldVUlNGQ0P49/ignp64trd1c3OysLEoJCXs7OwwLS1BPT7k4+NlYmNubGxiYGBMSUmKiIiamJjPzs739/eenJ2npaV2dHSzsrLNzM2Ni4xHQ0RKR0iJh4ikoqPg4OA5NTZwbm7y8vIsKCleW1wpJSbu7u56d3i2tbWamZnT09NdWltCP0Df39/FxMSqqKlsaWonIyTr6uqzsbKWlJVaV1c/OzxWU1SPjY7d3NzAv8CCgIHl5eWEgoJoZWX4+PgzLzDR0NBtams4NDWyISUuAAAACHRSTlMA5rI9/Xr+e7mmSL4AAAIJSURBVHhe7dlFj+QwEIZhp2G3kjQyDDMzM88yMzMzM+PPnplP05vuVTpx3Jbm4vdWPjwnS4nKjDG/TyMpaT4/2yy4i6QVCDLmD5DEAn7mI6n5mCYX1BhJbidBBSpQgQo8YXB02gN43uQo7AQqcKKzMxrt7o5EUgD6IvHNovUYVuLbXRS5NgaMVUL7MRSquYe1YzCOE5rAUHO0CnAYREgnpDdhPFMF2AKhtTi2Yjx8SBhcB9BRV5z/1kMcFwanAE5bB1mAs6LgwF6AvRYYM9EeQbAHXjNZ6ccA7hMEmwF+pZKuABxqFALX4J07UgreSkA8IAQeBGhQWQ0Az4qAy0mA6XLwpIlOCYDt8EapPD0EcJILzF8obQbgiPFfcwDn46X1VAANU7CQAostGP9aTABYythUMFHKOulyvza98BI5sqlxCGDe0z28BDBLtnUBvOwFHEwCjNmDV010zQN4HV6TTvaFAd7wAN4E2E8Vug3wzl1u8J71LbHt/gOID7nBFMBHVLHHAJ/wgnUdAJ9WBp/VQExzgv3wnpNDLwC+5ACtH4R2J/AVwLFaLjAGLznoBL5+A3GYC2wA+JYcewewhQfMJQC+dwY/9EH8yAF+gveZXPoCMOMOtn0D+N0N/AHw5y9XMD261e8BN7AtPLLVH7Ui2BlQgQpUoPS1s/TFuPzVPdsdkPq4IP35YwM3JP08YcueAAAAAABJRU5ErkJggg=="]],
                                [ 31, ["Camping nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABPlBMVEUAAAAzMzMkISEkICAjICEkHyEjHyAmHyMkHyCAgIAjHyEpJiaVk5SUkpNGQ0P5+flHQ0TKycn////Lysp6d3h7eHk1MTLv7+/w8PA1MjOxr7CysLFdWltfXF3f39/h4eEqJieXlZb6+vpIRUbNzM19e3vy8fE3NDS0s7NhX1/j4uMrJyiamJj7+/tLSEnPzs4kICGAfX7y8vI5NTa3trZkYWLl5OQsKCnT0tKcmpv9/f1PTE38/PxNSkqgn5/S0dHo6OgvKyyCgIFsaWrz8/M7NzjAv8C5uLleW1z39/dAPD1oZWXg4OCLiYnm5uYtKSra2tonIySfnZ3+/v5YVVarqarT09MlISLu7u4zLzCFg4N2dHT19fU8OTrJyMi8u7tqZ2ji4uKhoKAoJCUvLC1PS0wmIiN/fH1oZmYwLS0EVW7AAAAAC3RSTlMABVWl2fP/UdwCigIZxugAAAH1SURBVHgBrMEFAcQAEAOwHoN/vw8jA2uCg6h55AvhpoJHdRJ04TSbJDv426RZ/FQSFSCdRC3QpFJYUhk8qRyRVIEk+7ZnV4ltQ0EUht/mRcYTZigzN8zMDGam/S+gYJ4xSNeacr8F/KGTxB79D/7BQctSDnq8ukGf3x9QDQaBPs1gPwAM6AUHhwBgeEQtOIqyMa3gOKomdILWJKqmplWCHtTNaAQDftTNPlAIBtHkoftgP5hHboMjw2AeP3EZHIXw1F1wHJCeGQflBIXnL1wEPWjjZe/BwCzaePW652Af2nrz1jgoJyi8Mw7KCQrvPxgHxQSlj+ZBMUHpk3FQTFD6PGcc9ICZnwezYBoUE1xcWlpEs+UVw6CY4CrRKpi1t0ZBMcH1DaKNdTCbJkE5wS36ZgvM9o5BUExwl8p2wew5D+6DOTikssMDMEdOg9YxmBOqOgFzeuYw6AFzfkFVF+dgLp0FxQSvrqnu+oqPcclRUEzwhprcgLm9sw/KCd6HqEnoHkzYPignGCEmAiYaswvKCcZJCIJJ2ATlBGcDdv+4kjLYfYIe21Gtb3QNesCkpkmi6RSYdNtgJluWk1/PizaSYBavs2V5FizAteK/HhzMuVb6d04E/4PqxzT1c5/6QVL9ZKp+1NU+O2sfxvVP9/oPF9Qff3wF4LwId3e5X5wAAAAASUVORK5CYII="]],
                                [ 32, ["Bicycles", "data:img/png;base64,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"]],
                                [ 33, ["Motorcycles", "data:img/png;base64,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"]],
                                [ 34, ["Quads", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACEFBMVEUAAAAkICEjHyAmISEjHyAkHyEjHyAjHyEjHyD////+/v41MTLe3d0kICF5dndyb3AsKCn5+fk4NDU3NDQqJif9/f2xr7D09PSXlZb49/j6+vrOzc6sqquamJjX1tbT0tK7urrU09Tt7e02MzQlISLS0dHq6eqzsrKIhoe9vLygn5/p6ek7Nzj4+Ph6d3gpJSYrJyg6NjfPzs5IREWKiIhoZWXv7+/Ew8MxLS6+vb18enrGxca4trf8/Px0cnOGhITKyclpZ2ekoqN1c3PGxcWJh4g9OjvDwsIuKivNzM0oJCU+Ozuwr69LSEkmIiMtKSpQTU5APD319fV/fH3Y19epqKgnIyRBPT6hoKApJiaDgYFYVVZRTk8yLi8vKywwLS3y8vL7+/tXVFVGQ0N9e3ubmZqamZmHhYbf3t5CP0B4dXaQjo9kYWKop6fMy8uBf4AzLzDBwMBoZmZua2wvLC3R0NDAvr80MDE5NTbHxsdPS0xFQkLh4eGCgIFnZGVOSkvl5OTCwcGjoaLi4uLx8PFsaWqNi4thXl5dWltST1A/OzxbWFlKR0ifnZ2gnp5wbm6tq6ttamunpaVVUlNhX190cXLV1NVbWFirqaqqqKn29vZIRUbs6+tlYmPIx8deW1yWlJXm5uaUkpOTkZFEQULr6uqBfn+HhIVTUFC8u7vFxMQ1MjNPTE1iYGBWU1TQz8963r4EAAAACHRSTlMAsuY9/Xr+e/kjz/sAAALJSURBVHhe7dlFj+Q6FIbhFMzM52JsZmZmZmbmYWZmZmZmvnz/4rRPq0opSleNvGrl3R0pehTZzsaRJEmn0UJIWo1OWm7deghLv06SdHoITK+TNBCaRtJCaFoJglvLoAqqoAqqoHl6JZso8ABbyd0wLAasZp7qi4WAcDp4p6x2NsfHoX2dgjYlkWW5gJpkxgSBxjH+im1MGEivCJNA0JjK5lAmEARGrbAIBDc21QDYeU0YGMXiDltOAqURgHe6o9MSKksQrMeM19ixzRk+aMxnvNhcSzr8c1Rxj+duOVgQJpjNPBniK7bCpxNMlqG3uT8M0FjfyGTt2r4lA57qmH+ZnQXKIJFFlzfLzbSEIzbydo+xwMZaw9nlxfZaO/NGC+pMP5rmZ0WbkpdLWB2kjjXFM6Wqi5wRn8O7ppBc8vxvHWxXRwhvsg+RgRnpLhpKTgf1dgCRgIf2JrkZy99/kYtlQbxac0Tgnk2eg/vKBZTHBR4U2o2l6zdizo+EAX6SAcd7gMkA8CuAxQd2Gkytq4HtTF4KcMbfMxQAZ895xxmzIrixivl0Acj3AzOBvy/J5hhFMIcY+xVrzlUC4oEGPzAPGJDPhhElsJcrcfMAlpLoaQfy/MAKTBv4UDiQmEliihIYzZUoGm4ScAu3x30rx0/6kO8BuE8fui00OEtIDg1OAh8isEfepeujIzYYGkQhR57Q8JTAZwgshSvPaXjBwZcK4ASd3FEAQ90E7kZgr2lv+NDzhoNvFcAYUt4VDb7/QJ4JQRqnnfsIzGbTahYrgF2FzKdxBKmUPkdDS/ZnxouCAogvPl7SFII1w2Rt/qYImnNl3vd+BG14Qgb+gCKIqTavl9qFEDn+93Dun1ACqT/+jCXOkoGQFTdn0Tr+tYDVQcD2z7//OaCcecFaV+lUrwjWDqiCKqiCwq+dhV+Mi7+6lzbohf5cEP774xfRjR0i/B9VxAAAAABJRU5ErkJggg=="]],
                                [ 35, ["Off-road vehicles", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB5lBMVEUAAAAkICEmISEjHyAjHyAkHyEjHyAjHyH///8jHyAkICH7+/v39/dFQkInIyQ+Ozv8/PzOzc45NTb+/v48ODlCP0Dn5+c0MDHMzMzc29yRj48vLC39/f2UkpLd3NyDgYGgn58vKyyura3LysopJSbGxcZUUVHv7++Ylpadm5xaV1doZmbj4uO9vLzIx8enpaVraGkpJiaHhIUmIiOXlZY/Ozz6+vpRTk+tq6vs7Ozt7e3y8vKBfn/x8PGVk5R7eHna2trw8PAtKSpPTE1lYmPFxMS6ubl7eXo4NDX09PTU09TT0tJKR0iJh4iEgoKjoaI9OjufnZ2Bf4BEQUJIREXf39/5+fnHxscxLS4qJieqqKklISJsaWpQTU749/icmpvs6+utrKxJRkfCwcGAfX7W1dVOSkuop6deW1y5uLmenJ2Fg4O/vb6Ni4xdWlukoqM1MTK0s7P29vZnZGUsKCmPjY5HQ0RgXV5tams2MzS7urpBPT6gnp5ST1BhX19oZWXy8fGNi4usqqvEw8NzcHGysLErJyjh4eF9e3s3NDSxr7DV1NVVUVLNzM2rqapWU1SWlJXz8/PPzs4uKivZ2NgoJCXQz8/m5uZCPj+5t7i+vb06Njd2dHSOjI15dneHhYZDQEHBwMC5IB0yAAAACHRSTlMAsj3m/Xr+e3//bV8AAAImSURBVHhe7dnlquRKGIXhtOyZtZK0+3Z3d/c97u7u7u7u7nrOnU5IE4ZmkmqYLpg/eS/goaDgo/hKURSvx0cp+TxexahoHqXlLzLO56fE/F7FQ6l5FB+l5lMouX8FuqALuqALuqALbpYMtiS3yQUXoCEqFYwvxl6pIFcA+6SCW5dAD8gEOVOKpUGZICuBMqngSSBcrwa7zlVtSl2OxkNXE4F1qi1443+7Zplbcwx/VmILTsCu5HSO9+AhCgSxMwdcjYJBbQ9/96y0cBA1tGJtOf4G7E8PHmkazMDq+KpFZtFlpy1hR3FOtSJwankVzWaOwbGVzE0ATvbRimtisE8L0UzND+prydS19Rv0jbMku2FfNY0CW8r7R9q25wFHybO7YLZ7mqyBXbELJCuyFx7uVUXgfvKAZgEHyUOw6zDJhbA6KgKLGXwHaJUto8MATlAdhk0D5Kkx4Mx45/lbgJ4QgAO8COASyVArcIWss/HmsgfUrpMM6ECjA3gzEpkjbwMZazYn6Vg10GYCd4C7wvHVC9SZwD2ggY7dBzpMYBxoF4KPgJHHNHoCPKVjTUCmh0bPgRdCMBQGIiVUuyGczC8BdHSxpxFApxDkKwCv34wBaH1L59oBTKWHAEyqYvD9B2TTmyko+hHZhj5RDDJYpsEonaCw1OcYjL70MR9Ifv32vaKeeYv/+Dnxn/vgdEErF3RBF3RB2Wtn6Ytx+at7Zb5f6ueC9O+PX/+9JEnvKRAYAAAAAElFTkSuQmCC"]],
                                [ 36, ["Snowmobiles", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB4FBMVEUAAAAkICEmISEjHyAjHyAkHyEjHyAjHyH///8jHyD6+vopJib5+fnx8PEkICH8/Pzl5eWIhocsKCldWlvu7u40MDEoJCUtKSqUkpJqZ2gnIyTf3t44NDW2tbUuKitCP0CfnZ39/f3LyspcWVrd3Ny8u7vs7OzT09PV1NUmIiPAvr+enJ3X1tbj4uM6NjdvbW1bWFmCgIHKyckyLi/v7+9YVVZoZWVPTE1VUVL19fU8OTpyb3BRTk9+fHyNi4wlISLPzs77+/tNSkppZ2e0s7M7NzinpaU3NDTs6+taV1eura2Fg4MzLzD29vabmZr+/v6vrq6Rj49OSkvT0tI8ODnw8PB7eHlTUFCmpKRMSUl8enrm5ub49/i+vb3a2tqysLFoZmaAfX6zsbK7urpKR0jR0NC6ubnr6upBPT6lo6SsqquMioqhoKBjYGGgnp5kYWJubGwqJifi4uLg4ODy8fF9e3vz8/P4+PjJyMhPS0yQjo91c3NDQEH39/dXVFVhXl7Qz89xbm/W1dU/OzyJh4hGQ0MvLC1zcHGcmpuPjY7U09TCwcHMy8uHhYZfXF1APD25uLlgXV53dXU5NTbOzc7h4eGTkZFwbm6UkpM9Ojvt7e29vLxbWFjBwMB2dHSDgYHLbUPdAAAACHRSTlMAsj3m/Xr+e3//bV8AAAJCSURBVHja7dll09pAFIbhIG/7HNyd193dte7u7u7u7u4uf7WEJoQCCQ2cT22uH3BPZvbMZnZXEASzyUIsLCazkFIxi9hYK1LfZyVGVrNgIlYmwUKsLAIxM4JG0Aj+T0HX4i3dU4zBYC2A6YV8wT0Q7WULhhwQ1YS5gn34bT5XkOoh8hBTMEx1NgDuk1zB9qU0Z2fzvHFiCs4FVtk5B7sJwNp1fME6iBbdYAsuQVoHV9A3gjSbiyk4BkmCKdgKyThPsGUEkiilDTSUFxyC7Cel7cNEWcEeyHoPkSiB5VXlBJPIsG3qJKIYMD1VRnArsmxbsYzICUyWHoytxB8urK6MA7Y1JQdHkSuwHkDcX2pwI2S3Np8IQLF/sLRgFLIxolB0uxsZOx62FA/uAmxDlGU3JI0hEiWqoeiYsBcLhvqBeJgUzyGpkeb6ALId9FZqB+kwgCOkOIqMY+L0HUcOZySoGRxGyinK8ELR4KPTZ5AnqRmkswDOnd8gSyJLUyKCfPWaQV8zNHguIp/brrUol6DfZY3gFZTgqnrwmgP6XR9WD7ZBP8dNUg3GGqHbzCCpBwegW7+fNIK3odedu6QVvAd9HJEim4MXuvTeJ4mr50HBYBf0eEQZj9FVMGgf/WtPgKedJPG7n6lvDpVtCwp7QYqXk04AM69ek+iNw/NWPUjdThRS7SKS2+8ge//h46d21FZp/lM+t9qQ48vXb5SCQgLff5R8eAwW0Gecl42gEfxHg+zXzuwX4/xX98JsK+vjAvvzxy9WGSLUkBcvqAAAAABJRU5ErkJggg=="]],
                                [ 37, ["Horses", "data:img/png;base64,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"]],
                                [ 38, ["Campfires", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACQ1BMVEUAAAAmISEkICEjHyAjHyAkHyEjHyAjHyEjHyD///9PTE0rJyilo6QkICH+/v4mIiMpJSb39/dzcHGfnZ37+/s1MTI6NjeJh4iysLH8/Pw1MjP9/f08OTqop6clISK8u7szLzDx8PFAPD3k4+P6+vpJRkcvKywyLi/h4eEnIySsqqs7NzikoqPr6urU09StrKyLiYny8fHp6emTkZEqJid8enrY19dWU1QsKCl6d3g3NDRubGwvLC1LSElIRUZtamtcWVr29vajoaLy8vJdWlvQz89eW1zGxcYtKSopJibW1dXOzc5aV1ehoKDZ2dmBf4B0cnPAvr+DgYHf3t5CP0B/fH2GhIRNSkru7u4wLS3v7+8+Ozu/vb7z8/Ps7OxnZGXT0tJMSUmNi4v09PTJyMibmZoxLS6ioaFGQ0Pc29zPzs5ZVlepqKhEQUJpZ2dKR0jo6Og2MzR0cXLb2tumpKR9e3vGxcVkYWJraGk/OzySkJD5+fmNi4xQTU52dHQ8ODlua2zj4uPS0dG2tbXq6eq7urqzsbKYlpaEgoJwbm7HxsfFxMRxbm9TUFBoZmZ5dnetq6uKiIhbWFi1tLRRTk+IhodiYGBoZWVST1DMy8u6ubnV1NVvbW3CwcFHQ0SBfn89OTpbWFlXVFXR0NB+fHzs6+u4trdhX1/m5ubr6+uenZ2HhYaHhIUuKiuUkpLT09NlYmN4dnagn5+9vLz4+Pjt7e1fXF20s7OXlZadm5woJCVhXl6vrq5UUVFFQkKura2Zl5eyQzp/AAAACHRSTlMAPbLm/Xr+e+5HUUkAAALASURBVHja7dlVc9tAGIVhxU7a75idOMzMzNQwMztQZmZmZmZmZmb4aZUdx5Gc9MKr7UWnfi81o2d2tDur0UoQBC+VmrikVnkJYj5TiFvePuL4vIk4il6CirimEtR8QbVAnPOAHvDvgUbeYH0qZ3DprDK+YDmWLOAKzgYKoniCvgDqkjmC8yGWxRFsgJg5hhvYGwpbkdzANNgz9HIC/c0YzY8PqO+Co+wiLmAunB3mAc40wFk1B1BThfEylIPD6ZAUXKQUTFgMWeeUguch74JSMAnyfCm5UAmYCJeKqSQ6XgGogUsraBpWBbCCiRPBO9QKfGMEtYG0CC4F0CYgdCcbuOUpmUIhK5YoH0A/E1hWs55oLWQFEc0BcJ0JzEI30UHIqiD6DGCukQXswTqi45AWbSKKhNhyBjAVmEdEOZC0kIisECtnAH1HB+Qn8baGkWPetzOAgQB2EA1b5ANsg1hcAgPYAeAqES1zekMhRCuDIbaBGMDC0b2AVmfD0Roi013Y2sUCUjuAms1EGw1wvpVPwdZ+YgIHzAAyBom2wVbBc6IXsPUyhA2kS7sB7BHFvQD2hZFeB1sHtMzbV+OhWKBnGuXVoUpDMUcAS5IuXtmOHd8ddPSYMarlBDWeLG2NMf4TnxVRRkYw4PSZibeG9bcYzhqZwKZmYCjzonRK/fsuGyCWyQRWwJ75Smci2dJeG7HA0Q0WMBBjWRpu3rqdMh3j5bOAefeaMXlJHSbGWR7wuw/X4h481CtYNtrcRwZIevzEX8k61LRZ4Vq6rpZxHZY8a8fkWcPrI9wG9SPBEmKG7tXrrjjphTchboKD0gHVRtgvdb59B2fhboJkhb334R8kjyyh9OPYckxxF/wEICetcsLD+vK1OhZile6CTUG/vtMf+tH3s9hzbuMB/yuQ+7Ez94Nx/kf3wlRvrj8XuP/++A3YVR9PVIFkoQAAAABJRU5ErkJggg=="]],
                                [ 39, ["Thorns", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABI1BMVEUAAAAzMzMkISEkICAjICEkHyEmHyMkHyCAgIAjHyEjHyD///80MDGamJi5uLm/vb5hX189OjslISLW1dXx8PGWlJV0cnPDwsLZ2dnb2tv39/d0cXJmY2TS0dFiYGA+Ozvi4uKioaEqJicpJiZgXV7My8v9/f19e3u9vLz29vYnIyRaV1d/fH0yLi93dXW3trby8vImIiN2dHTf39+zsrJzcHHc29wkICFubGxqZ2hJRkf+/v65t7hPS0w8OTpEQUJUUVGSkJAxLS7z8/Pa2tr19fWbmZo3NDT49/ign587Nzj09PS6ubmzsbLd3Nydm5xdWlsoJCVFQkJ+fHxAPD06NjdWU1Q2MzS0s7PFxMRVUlNTUFDAvr9PTE28u7tMSUnR0NCY0fhgAAAACnRSTlMABVWl2fNR3AKKw76XCQAAAURJREFUeF7t2VVuAzEUQFHPeCDxhLnMzMzMzIz7X0Wll6q/idqrSq18F3AkfzzZelaS42rPNz/I97TrqK+C0ACFwScXixuoeExA8SBRzmvAAqWckARDR7kGzVWaBbXy6gCalqslaoOe8usAk1G11dqgrwwLml8GLXhyCYNR7/QiCEpLqRUSlNLrMBhtZ0CwMX3Vxh25vSPTaSelLtCCXd09IJjt6x8QjAAHh5IVgRBwZHRsXBQKnJicijhQys3MgqA0N18hQWkhT4JScwsJSq0N/3mWLWjBNRosbGyCoLRVTICgtLO7B4LS/sEhCx4dl0Dw9Oz8gjtyefjajt73wJsUCOZui3nu1rsr3RfIiz77QD9FzGOZBKWnZxKUXl5JUHp7/9uTYkF+meaxoKc0uz/U+MoUX+rSa2d6Mc6v7vnPBfz74wMVTRRdDwtd/gAAAABJRU5ErkJggg=="]],
                                [ 40, ["Stealth required", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB7FBMVEUAAAAzMzMkISEkICAjICEkHyEjHyAmHyMkHyCAgIAjHyFbWFnh4eH5+fnZ2dmzsrKOjI1oZmZDQEElISIsKClRTk94dXafnZ3FxMTs6+v7+/u1tLQoJCX///+PjY5cWVqcmps+Ozvb2tt/fH3Avr99e3v49/grJyi9vLxlYmMpJSb29vampKRfXF3m5uZLSEne3d2Ni4s5NTZ0cnO/vb7Y19fv7+/6+vrKycmtrKyJh4j9/f3HxseQjo9VUVJAPD2TkZHg4OD8/PxzcHEqJic8OTrz8/Pf39/r6urNzM1iYGAuKivx8PHGxcYwLS1HQ0RdWltoZWVubGx7eXqBf4B+fHxxbm9raGljYGE7NzgmIiOdm5xua2yMiorGxcXw8PCHhIWYlpZNSkpFQkJBPT7JyMiWlJUyLi/4+PgnIySUkpI1MTKbmZrc29zk4+Oxr7BOSku2tbU8ODnBwMCLiYk6Njf19fVPTE3n5+dgXV6ysLHZ2NhkYWI2MzShoKDo6OinpaWEgoJvbW16d3iRj4/p6elIRUZEQUKgn59UUVHl5ORJRkejoaI4NDWkoqPT0tLt7e3DwsKUkpOamJg1MjNIREXMy8s0MDGtq6v+/v7T09MkICHLysp7eHlwbm7u7u7i4uJ3dXUvLC0tKSo+rHbwAAAAC3RSTlMABVWl2fP/UdwCigIZxugAAAJESURBVHgBrMEFAcQAEAOwHoN/vw8jA2uCg6h55AvhpoJHdRJ04TSbJDv426RZ/FQSFSCdRC3QpFJYUhk8qRyRVPEVAxuVAQPbqIGjBnIDSKUHJemBKAzDxS6szW9t27Zt27bt3zZvdO10euacPMXoTcvSytrG1s7ewdHJ2cXVzd3D0VjQ0w3PeBkLeuM5a2NBH2j4Ggr6QcPfSNAXWgFGgoHQCgo2EAyBRCg/GBYOiQh+MBIyUfygC6Si2cEYSMUygnHxPgmJSZBLtkxJTfP2pAR902FSBiUoMpNhgmUWKSiyc3KhLy8jv4C+KYX5yUXF4XgqvcQSpWXlzF2uqBSiqrqmti6+vqHRuam5xam1TdSgnX1sihMlNzvQyQ52dUtu9iCfHexFn9AIQD83ODCIIfHc8AjSRlnBgrERoGhcPDMBYLKGEbSbwpVp8dTMCK7MzhGD9vO4tSAeW4zCjaUFT0LQccgK91wcxL3lFdyLWTU/WL6GR9Y3xI3NrWQ8CHemTLkBj23v7O7tHwzm4ZHDI9qmNELt8Ji6yydQcT8V1GBYIhRiGQc7EvrOPOnB0Rdn0PXyFS04l//6jRWU3r57X1ZuXnDmQwzM456y+9Fk8NNnUIy4hKmDXypA9FUd3AHVt1NVsC8dZN9/KII/wfBLP/gbHH+G9YJtf8HyQS/oDJ6lj7Igf4DAhDz4D1zhm7JgmyXY2mXBH//5LrZ4ZPXoRw2k+mAa1Yf7qD4gSfUhU6oP6lJ72JnaA+NUH7qnweQC1ac/AHoobHKB+Q2BAAAAAElFTkSuQmCC"]],
                                [ 41, ["Stroller accessible", "data:img/png;base64,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"]],
                                [ 43, ["Livestock nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACN1BMVEUAAAAjHyAkICEmISEjHyAkHyEjHyAjHyH///8jHyDg4OBiYGDk4+MpJSa4trfe3d1oZmbv7++HhYYyLi9nZGXMy8uVk5QqJicrJyg4NDX7+/s+Ozv49/jy8fE9OjslISLV1NWUkpOhoKAnIyT39/f9/f3p6elFQkIsKCmYlpZBPT7w8PBRTk/KycmTkZEmIiPi4uK/vb5QTU6GhISBf4AuKiu+vb27urqura1cWVqgn59XVFWkoqOCgIGAfX7o6OjU09Ty8vL6+vrl5ORDQEF1c3NVUlNhX1/09PSUkpKWlJUkICHs7OyIhof5+fm5t7hjYGE5NTZeW1wwLS3+/v7t7e2pqKjFxMTr6upqZ2g7Nziop6ff39/x8PFlYmOjoaLAvr/DwsLa2tpYVVZvbW3d3Nzl5eX29vZKR0jAv8C2tbWysLGFg4N0cXLm5ubX1tb19fW5uLm1tLS3trbW1dWfnZ2amJhNSkrZ2dk1MjPs6+stKSpST1A6Njfb2ts8ODmEgoJ4dXZTUFCsqqtkYWIpJibh4eGNi4u6ublmY2T4+Ph7eXrq6erHxseXlZZsaWrQz8+MioozLzA3NDScmptua2xEQUJ7eHmZl5eQjo90cnOxr7DMzMzu7u7Pzs48OTqtrKyqqKm8u7tZVlfLysqrqarIx8ewr6/8/PzGxcXS0dFIRUZzcHHGxcZVUVI2MzRpZ2fR0NAvLC18enpoZWWPjY6bmZqnpqZbWFhubGzY19dwbm5WU1STNhVQAAAACHRSTlMA5rI9/Xr+e7mmSL4AAAJ6SURBVHhe7dlVjxtLEIbhMWzylXmZmZmZmZmZgszMzMzMzAzn/LjEq9VqLcdOtdLK1bwXc/ncVKtHqlYURafVkJQ0Wp3yK48FJC29h6Lo9CQxvU7RktS0ikYuqFFIcir416mgCqqgCoYnBdi/e6WA8Tf8vTOAI+s3GB5KATfDcxMQVJLYtIukgLuXw56njTWU6ELjgeDD5FyC8WhTzvFl3kNZaUswU5DxT2D8ZINpFPZCrb75BVGJ11tXlZaVlbY2RlnWBsGp5GD3YMJiCGaocQuehHCede7AJyHbIFqMj2uweelKXwjXZnYJJmF/KISbIJdgMQ6BX09vCBBacazQNegDH7DzDSbaaXZ/DhcN1ILb6XTGbXP23Hkw23GRGKAtLw3MLhMHHGvfB14riAXWR6wGqzXePLBvXT04xU4TBzRvREMKOJUQC4wEttSB01YemIeR7f3gdIEHZiPHC78r1mRNxrz2EA/8H10dcCxmYvxg4lg3EcVnzmot+eNhTLCrMjfgBIAfc96pLJqrcxY8w//RD04TTQHt3XGA5TnKcSmB5lWNmSL5oL0J4ApdBVJqrjUXBdL8pgATgGwx8CZuEfnfhpGcuoOeuwagWAy0oIiI7uG+M/gAGTSIELMY2A8vIqpFm/Mkh/GI0ketJAYOoHHmAKHPCXyMVKLUCDEwEHhKREPPUNVJjkW34AXRZJwY+BKotgOvAEu0I5gbg6pAeo03QiBNAl52oByoeOsovgPeh2Ui4oPglBH7kYg+ff7ytcMRDBiJq+z9ZoDpuwho8/Pziwwn1/0XNVzgr64I/j2ogiqogioofe0sfTEuf3WvLNRLfVyQ/vzxE3JJLuCGA7aiAAAAAElFTkSuQmCC"]],
                                [ 44, ["Flashlight required", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABy1BMVEUAAAAjHyAkICEmISEjHyAkHyEjHyAjHyH///8jHyD8/PwkICEmIiP7+/tiYGApJSbV1NXk4+O4trfIx8dST1AvKyzu7u6DgYH+/v46Njc1MjNEQUIuKiv29vZ0cXKEgoJzcHFqZ2ihoKBhX1/U09TGxcV7eHlvbW2npqZBPT6pqKg8ODnf3t5kYWKQjo9pZ2fe3d1bWFlNSkrX1tYyLi9tamsrJyi0s7Odm5z49/i3trZWU1Ta2tr19fV5dndMSUlbWFj9/f3Avr/09PTm5uZ/fH0oJCWAfX7s7OzKycmnpaXNzM3Y19dZVldyb3CVk5T5+flCPj96d3hOSkvDwsLMy8vc29w4NDXh4eGysLFfXF1jYGFPTE3W1dWtrKx2dHRsaWo3NDSkoqMvLC2UkpOjoaLp6el8enrx8PGLiYnS0dHy8vJDQEHHxsfEw8OamJgxLS74+Pg0MDFCP0Cop6erqao8OTopJiaKiIg+Ozs5NTa6ublHQ0Rua2xTUFBraGng4ODR0NDq6ep+fHwnIyTy8fGMiorCwcGamZk7NzizsbJFQkJQTU6ioaHT0tJeW1w2MzSTkZHo6Ojt7e3w8PCJh4gqJicwLS36+vovb47RAAAACHRSTlMA5rI9/Xr+e7mmSL4AAAIeSURBVHhe7dnVstswEMdhBU67azvMeJiZGcvMzMzMzMzcx209jTtxkyiSvXf17wG+C3s8nr/EGPO4XUiSy+1hv6tZhGR5axjzeJEwr4e5kTQ3c9GCLobE/c+gAzqgA6rrt49RgvVTAL4MGehvAr0wEdi/BgpFKUCtDf4WoQCXQVF+ArCvGFyr2gY3gam8bTBhBkMBu+B5MFdrBQxsbpgreNmNYC5+RBrUZpYCKOv+gL3wbxtkwXtdoLdPRb39JWBuhxS4J2gAB3Tv4DyUtFoCHNhmcEpHJ+KWrVAmX0YYTOUKQHL0LGL7riSUbUIYrC8AC7OI6YafUKmoKNjp04FVk4jZniVQuYgoiMcAmhoRl69YCdz8omD69DAitu6EKg2qEl/K7iBUr04Y3NsMIoUCYuCV0SSIVSsCHjrsA9Hisapg7Og0SNRbBQwk4jLc8RMqF1TrQjLcyVMj/LfsH+QDZ3q6E+cUgxu/cJG/AqIRPndp7LIODOXD+kNWrqb4KyAT5nPKtetodKP7ZuIWfwXcblP43p27ciughc9F7suuAK2PwwUbLayABxW5h63WVsCj8tzjJ0/RGthfjnv2fMT6CnhRwo2/HLKzAgaSZk7peGVzBbw2eRNvbM+K9qL/ZfNbip3yzuDef6AZPh+nQa9rmGxJfQKAzy0akoGxL1+/fSfdepM/nHnrgA7ogOTHzuQH4/RH92yxl/Rygfz64xfMgQr4ssjakAAAAABJRU5ErkJggg=="]],
                                [ 46, ["Trucks/RVs", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABsFBMVEUAAAAkICEmISEjHyAjHyAkHyEjHyAjHyH///8jHyAnIyTY19eamJh1c3PAvr87NzicmpvCwcElISLKycmRj49wbm7t7e3a2tr8/PxdWluqqKmMioqKiIi9vLxPS0zw8PAuKis0MDH5+fmkoqOfnZ2pqKhubGyGhIStq6t4dXZxbm/Ew8Nyb3BJRkeura1tamuZl5eysLHx8PH+/v5eW1yUkpJCPj8pJSagnp5BPT6Qjo/MzMw9OjuTkZHZ2dmSkJBbWFnJyMiEgoJ7eXp9e3t7eHktKSrBwMC0s7NWU1R2dHR0cXKsqqtNSkp5dne1tLSFg4NpZ2eIhof39/fGxcXf3t50cnNIRUbl5eVKR0jb2tvd3Nw5NTZvbW13dXU+Ozt6d3hzcHE4NDXZ2Njg4OAyLi/GxcZua2zX1tZOSkv29vbz8/NVUlOzsbJgXV4oJCXv7++npqaUkpPq6epjYGE/Ozz9/f3o6Oh/fH3l5OQ3NDTp6elsaWq3trZ+fHyHhYagn58vKyzn5+empKS2tbW5uLn19fX6+vpCP0Dy8vJoZWWtrKxcWVrc29yxr7CVk5RkACqaAAAACHRSTlMAsj3m/Xr+e3//bV8AAAHhSURBVHhe7dlFjxwxEIZhD2zyVfcwLzMzM4SZmZmZmZn/clrq1exh3eBRzSQHv1dLjywfLKsshAgGQsRSKBAUVlVriK1wlRDBMDEWDooAsRYQIV4wJIi5fwhqUIMa1GBT/9Lg05lEa9fW+liy9+Dl3i2x+k97hgfaW9uGMp0bsg8bTqb8gsc23lv3AN49fpKM9D3yAuNDR6FUfu9mNzB6AMq93+YMHimghD7HHcFulFSnI7gJJRVxBM+WCUxnJKWLQG5lYdYD3G2D90nSnyJ4nIpF/IHj7mDeP9hdJnDeHVzwD57mBrfb4KI7eME/GC0TmHEHTf/gYW5whw02XpTUWARbVhZGPMBzUK3SYB832MMNZv978BQ32FE58MT+hubJM9GrTOBoXYrm9nX0kzHTwgLW0nQaVrO7qEcJvAJppnHtug3cuEm3GMDbd0zgbs3OEeDQZPMXBXAMsr4Z34Fnz4niL4CXlIRDmdWgEYOkVzQOvCarN8BbalMAid6dX10TtQODy7fRB5Y3dh0wTFYfgVo5Ur1+TgWcLgCJia9TwOiE1MsCuUsKIFmUXYKk/QBQrQKmumyvxiCeHRL9HPhl/h6zAc8z5KnCoAY1qEENso+d2Qfj/KN7sTbM+rnA/v3xFxaiHjL6WV+uAAAAAElFTkSuQmCC"]],
                                [ 47, ["Field puzzle", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACTFBMVEUAAAAkICEmISEjHyAjHyAkHyEjHyAjHyH///8jHyDp6ekmIiPy8vLy8fHT0tKRj4/g4ODQz88/OzwnIyQkICEpJSb49/goJCWGhIT5+fn9/f37+/uzsbI5NTb+/v76+vq8u7udm5y5t7iPjY7X1tbv7++amJhcWVqYlpbDwsLm5uY3NDQuKislISIzLzCcmpstKSpZVlegnp50cXLc29z4+PhAPD3U09SBf4CQjo97eXq5uLn8/PzT09MwLS2Zl5eIhoetrKyUkpNgXV4vKywpJiZNSkqpqKgsKCnx8PHj4uNHQ0ShoKDS0dHl5eVbWFnIx8dOSks0MDHk4+P39/eOjI0qJiexr7D09PRaV1fs6+uNi4xtamubmZqmpKRFQkJPS0xRTk9hX19oZmagn5/W1dVPTE1VUVLLysqBfn9ubGy+vb1/fH1MSUldWlutq6tCPj+HhIW2tbXn5+dTUFBpZ2dxbm+op6eura2Ni4tLSEk8ODmjoaKsqqt0cnNBPT5qZ2hzcHG7urpXVFVKR0g1MTIyLi/29vbZ2dleW1xbWFiqqKljYGHt7e1nZGVkYWLBwMDAv8BGQ0Po6OjAvr/GxcZUUVGwr6/JyMg+OztJRkeAfX6amZnf3t6koqOLiYnY19eFg4M2MzSrqari4uK4trd3dXVIREVlYmOUkpIxLS6vrq5fXF21tLTz8/MrJyhiYGByb3A7Nzg4NDWlo6R6d3iysLFraGnq6eqzsrLEw8O/vb7e3d2Vk5THxsf19fXZ2Ni6ubl2dHRwbm7tqhE/AAAACHRSTlMAsj3m/Xr+e3//bV8AAAMaSURBVHhe7dnVjttMAAVgZ5Ntx2FmWGZmZmbmLTMzMzMzMzNzf3ixji3HSmxXU2fmptKeuyNHnyLZOonGFEVFKZQ0kSgVURRM9DSaWFTR8PupaIJRRVEKmmgUlJIsqKRowpkCuUyByR36tV2m2IWEwAWVgMuidhLgEg/gY6/HB3NdICQvmnDBna0gLOp0TNALBJmHB+53C8GDjVhgPhBlDhaYIgadWOBRMViNBXaIwXgssEQM/o8FLhd5/q1YIF0sBFMxx2FU8CAWNmGCdGk4uAx7HKxLQ71NBOYrM4XfL/tNMovdzXmeWWQWe1UB4JJQFAmYlRlWc2q0gI92c0MYYMlCgpnlwN7ZXPKq19c4lOPb+34N5EIzELP4sLmvqsG87oSzdr4LDKPAXUBmViDAbLngOALcLhfMRoAzpAD3pTxD9p4RSbAOAaZIeJUz2UsHVkqBtxHgarFXa+HvmB81j2Jwh8jrz6H5xIrBZAR4TASuZ6QNGwf7IGjrF4FbEOBsoWe3QWgbLMaXUEwSgT4EaBaCRshUsSv7GoK7hZ5bgwAdbgGYAJl9bCmD4EchmIYch0MsU+E9UjRxj90stVp9nAHczMNTwyo93eaTpwCbGCQ4yCinzzAl/azo9/gcU85rGOCCiX1qkKAm/uJkcEjLQrwkBrlcwZQrHDCaN3xV3sBm+XnvGkukMuU6xmKnBT0vW2+wJQ4DvMV5ujtMqwNs7mKAbRzYzBQnV+5HDtoKOeMBLA89XCmOHMwFXB7B8phfxycRg0+DxjNYnoNgnDJBR0ZwKDyh/6tjeHAsnWbT0p7xJ+BEItDnO2DpTeMJo16v1wE+pjcQ8FXrQGIuGnzrYgT1O0N5APw22g9Jcezn2qxIsFQKmAsvxEnS9UjQJA+cRIKf5IHDSDAgC0TvoQ1I5bPBYCiQBFNRYAaQly8ocEgm+BUF0i6EIPumfJMHfkeCsfLAZCTYMu79kWBU6wYCfsDHHbD/HOGi1bUmjqm7jP909vw74z9Z82XVWBwOh0Vj/cvPvqZA4sfOxA/GyR/dU9NVRF8uEH/98Qv/NDj91owBUwAAAABJRU5ErkJggg=="]],
                                [ 48, ["UV light required", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABy1BMVEUAAAAkICAmHyMkHyEzMzMkISEjHyEjICEkHyCAgIAjHyD///8kICGZl5f+/v5CPj+lo6Ta2tpBPT6Qjo+Vk5RHQ0T6+vqMiorBwMCRj4+ioaHV1NXX1tbZ2NgpJSb09PSFg4Pr6uq2tbXj4uO3trbW1dX5+fnKycmOjI2LiYk0MDElISK4tre9vLz9/f1iYGDy8fGTkZFEQUJ4dXY+Ozuop6eGhISKiIgrJygmIiOpqKiamZmNi4vs6+tubGxNSkoqJidDQEHe3d04NDXGxcVTUFDl5ORQTU52dHTZ2dkwLS34+PiPjY6Ni4zg4OBbWFhFQkK0s7Nua2zn5+eHhIVdWlvz8/ObmZo6Njfl5eWtq6t+fHwvKyzb2tu/vb7o6Og2MzTY19fNzM3U09S1tLSdm5zMy8tCP0A9OjtpZ2dKR0jp6el9e3vT0tJhXl5bWFnGxcYzLzA/OzzT09N7eXpyb3DDwsKfnZ0xLS7w8PA8ODmjoaKtrKy5uLnQz89MSUmcmptqZ2hraGn19fV5dnfS0dHIx8eura3Ew8NXVFVgXV6Bfn9aV1c1MjOgnp7m5uZRTk88OTrt7e3i4uLf399JRkdST1CIhod1c3PEUrcOAAAACnRSTlMApVHzBVWK2dwCcohuAAAAAm1JREFUeF7t2VVv40AYhWGnSZr0OFxmZmamRWZmZmZmZoafu+oZyyMn2lgaz9XK71XPRR4pquREXwwWCgciQXgoGAmEQ4ZdQRQaihZYXFEhNFVYRJCeJpHvFxorMIxQFBqLhowwtBY2AtBawIhAaxEjCK0FDWjuPwR90Ad9MFWzVIUE+qvYASCzgjXA2WJPS0vTia1r/gFWmEutkmClyZYDaOZfe+Gs2GSXFMASYa+Eo7X0GrsVwFIB7nZ4W0x2Gwogqgk2O8ANAlytBO7IfTFq6S2DErinjyMO2ZDJOtRAXOHYBFmHADOK4LAY8xI8Su8YFMF16zlKbG/RZPtVQfRk/Qs2cpd1KYNnxToHqxrOXiiDdQNcg853vE0dxBTXQYhmuHYteAA3i1kK1sqxDx7A2HbOYo7TQt/pBcQ0Zy1HOb3zMU/gY7GH5MPiCTyBSHPPAEgKe94jWM5dDaCTXhp5wUMED0twUIBHbHAkQScJHCdYnh9sIlgvwZMCXIDdKTrjyNBLnMkPPiCYmLTBUXplkF0gdBHjBNuRH5w22eWsJ/IsZFfLKF27TvCGC3hTgFVZz6dbkKGXUope2x0XsFQAd+9BdF/sSsgwRypB8CFcQDwSQusI1xhH1mfxRL1p99QVfGYRz0dfzI29tMYrOHptewN1rmDsjZlT31s4emeDU3AF0ZXOAd/DWXejafXBBWQf251cohjZfbK8z3AD2WS8zZTN9iOnLxYYdwdFX1PfLO57wwRyww8B/nQDZbFfw50lv/8k/S/tPuiDPqgt7cc07ec+7QdJ7SdT7Udd3Wdn3Ydx/ad7/T8uaP/54y8pujR/xj8oJgAAAABJRU5ErkJggg=="]],
                                [ 49, ["May require snowshoes", "data:img/png;base64,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"]],
                                [ 50, ["May require cross country skis", "data:img/png;base64,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"]],
                                [ 51, ["Special tool required", "data:img/png;base64,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"]],
                                [ 52, ["Night cache", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACBFBMVEUAAAAjHyAmISEkICEjHyAkHyEjHyAjHyH///8jHyCRj49CP0DX1tZKR0ja2to0MDGfnZ1aV1fg4OAkICEyLi88ODn+/v5BPT4lISLu7u4nIyT4+Pg2MzS5t7iDgYHGxcX39/dXVFVhXl5DQEFAPD18enrJyMgmIiObmZpMSUkzLzA3NDQ9OjsxLS6/vb76+vrh4eFUUVHFxMRZVlcwLS1yb3Cgn59QTU6XlZb7+/vY19f09PTU09T8/PxRTk+lo6RVUVJwbm59e3umpKTl5ORsaWpCPj+0s7Ps7OyCgIHr6uqVk5S1tLSKiIhcWVpraGmnpaWgnp4oJCXf3t53dXXm5uY5NTYpJibHxsc4NDXIx8eenJ08OTrGxcZFQkItKSpHQ0S3trbT0tKQjo/y8fFEQUJxbm9GQ0PLysqTkZHCwcGysLFlYmPW1dXi4uKIhoe4treGhIS8u7ve3d1ua2zT09PS0dHd3NzZ2dnBwMCura1kYWKhoKBLSElubGzt7e3Avr91c3OnpqZdWlvs6+srJyh7eXrb2tuioaHf39+vrq6HhYbPzs79/f1+fHzOzc5IREV6d3iZl5eop6eWlJWAfX7Z2Nj29vasqqvn5+cvKyytrKzMzMx2dHTKycny8vJPS0yFg4PNzM0sKCkuKivp6elfXF1oZWXv7+81MjNST1BIRUahi3bAAAAACHRSTlMA5j2y/Xr+e2X2yfAAAAK0SURBVHhe7dnljttAFIZhB7b9xmHGZWZmZmYsMzMzMzMz0022yY5WHiVdQ6f907wX8Ei2jnVGY0EQ9AYd4ZLOoBd+lbSEcMuYJAh6I+GYUS8YCNcMgo4vqBMI5/4BmADXFHEEe/Ju9u1ukwJhUbRpBsu3e4H1VUSaBcjUCu6rB2B1EyaT2bxSGziRDACl+dzG5iQi3Se8wNOIFCpUZPgmj2TJgAWNiLSXKGoLsFoCMjNRPA/cQLRsZaBNOksCOxO+ecCJaLVEfQI7E54okI752AkxWcIMELZkKh2bexT8xgANEBlAhFUp+JCCaxnAHAM+VgruoOBOBvD4ihmg2OdRCrZS0M5rBeyhYJmLEzgKWjcnsLCUgtZZPiDpBc3OCXSAhn4+IDkGGjb44wCbnM4sdWBBF2jYmh8LWgCTLOgQsyXi9xAWOltNv0HprnLLgiLMRFJLFyQFGna1qx2bDvM6Is1dAkkHHBz2cvl1+tzeQ1N+PicHW8btvJrhzTP/1WEpAfot6bGd0ghWZWyraEScmv3qwcxz54968buCqsBLlcP7A1gsb65i0HNw/HA95EohSsBgbX/vNGQbOA4EZUHXibqcNMh3ZmzEv0wJ2A0F9Y1diLw7RWAK5LrYOUJnhQc4XVPpooBC8PIi2pW6FkqpAG1XB3AtObYAknuoIw+ypWIFiS0HIvnr4AyQqxlcHgfMwi3CFRzEHZ7g3SGgWjs4x4IToyXNSMsmnMD88QAQelBE/gBctQC6HzUBsKYUEMIBdGUMhYAnT9tULKmKuGBqBDQNPgPQ1PFc1dZ7gdY44EvkvXoN4E3nW7Vr9B3KgjFeYRoivZ/6oH4vf/yEuc8Wti9WAF/tP7QtekcAcZprn9V8ciiyT25kc9pNidNXtATI/dqZ+8U4/6t7YamR688F7r8/fgIT7jIBzG3qKAAAAABJRU5ErkJggg=="]],
                                [ 53, ["Park and grab", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACGVBMVEUAAAAjHyAkICEmISEjHyAkHyEjHyAjHyH///8jHyAlISL9/f0pJSYtKSq/vb5IRUazsrIqJicrJyh5dnfCwcH6+vopJiby8fGRj4/39/dKR0i9vLxpZ2fBwMCioaH8/Pz+/v40MDG0s7PGxcWQjo/7+/smIiN2dHTKycmgn5+4trf09PTFxMTs6+unpqY2MzQ6Njf19fVCPj9QTU6EgoJxbm9qZ2g9OjtVUVJUUVF1c3PR0NBIREUsKCkzLzA7Nzi5uLlPTE1LSEny8vIoJCXe3d0nIyTMy8s1MTLZ2Njo6OhnZGWAfX6koqPX1tbz8/NHQ0TOzc6Ylpbx8PHLysrb2tv4+PgwLS1FQkLp6emjoaKcmpvu7u749/h/fH2trKympKQ3NDSLiYmzsbLt7e1oZmbQz8/v7+9gXV7l5ORbWFmdm5xoZWVubGx0cnOOjI1kYWJ7eXp7eHlJRkfk4+N4dXbW1dW6ubm7urrh4eGFg4OWlJU4NDXY19fJyMjj4uPw8PC5t7hcWVo/Ozx0cXLc29xaV1ckICGura19e3svLC21tLRWU1S3trawr69hXl62tbUvKyy+vb3Av8CGhIQ8ODlfXF1APD3Ix8fq6erEw8NhX19GQ0NzcHGnpaWysLHNzM1RTk9+fHwuKiv5+flXVFVOSkvl5eWNi4tiYGDg4OBDQEHm5uaHhYbS0dGsqquNi4yKiIgyLi9TtdaOAAAACHRSTlMA5rI9/Xr+e7mmSL4AAALPSURBVHhe7dlVj9xKEIBRz+xsUj3IsMzMzMzMzBxmZmZmZubcX5hujeLsbKwdu133IdJ+j344slqWqtQWBCFIqyEoabRBAi14HUFLF0zfT0cQ0wUJWoKaVtDgghqBIPc/gmvgULmlEg00brV6gJaWWmrDAAv2gFjrTr1a0HQA/Ir7Tx3YfBRWdLBIDVifzIzxjbTjAyd84r4KFeBmYCURXyXWBCZe4AdzXSLo656BgtE13OA1+A2aQi1VDNgOtNu8oDtHBDdQpyGUkEZ2kIYYTnAH+IHQQgEz0LZxgvErwBwKPGdgJCc4vQK8TIEmBqZyglf/gMWdnf2H7YRkJzDwGCeYKYJiTmCdVH+GvmI6ANSc4RZY9h3u7j7Xmwa+HJygPUQEN8GyDFmcIImVBuMILzgcJQkWc4NkVAqMJfyge/FvcOCmCpAcaaDEfq93SvS+5KqbKUNO8KtnRu3U0+8aAbHx/HqEuWzfGzbBNJfz4iWszUGfXfOyKnFt+8IGhx0pkRIV8oCJeYeq50G6ZKVgxan49BwGYIDNC2NlCbB6D+SCp89knoXAzbfJAM/XTlpbQY6WAREkAGi8Mmv2gJzqpq4nhgUEbSMgq5Ab4W4KBAbL5WiuWwUmCsgCQwNqUekOtnYjgdFN7WykKgCLVuPK7tyliDKQTPbAoFeiWID7VFAOEi94iEQLABJPrfxguCSYCWZccA6qUUHjQ4jEBLMfATzGA5+kTACYCRJoe9oPtGdGHNCS0se4uBJKqP8O7aUvmNbVYSEEAawd9TCu5dVrEVFxhibHItPezL1VMJfzweCWANsB3k13Me79hyxFg74Q4KMEmA4siHa26RVuDjEe+PTZz9I3Gmd6gbU0lsuxinwFgIyM+aW+urSQQVcUiH1LsvHtNrMGqan0PY9/Wer+YY7wL/Vn5T+7H66B6NfO6Bfj+Ff3wnod6s8F9N8fvwCrJTiqQ3UvegAAAABJRU5ErkJggg=="]],
                                [ 54, ["Abandoned structure", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAsVBMVEUAAAAmISEkICEjHyAjHyAkHyEjHyAjHyH///8jHyBoZmaRj4/X1taHhYZaV1fGxcWrqapXVFVZVldTUFCenJ1hXl5gXV7Ix8d2dHRkYWK5t7hPS0xYVVY8OTr6+vpbWFhKR0gxLS61tLTu7u7o6Oi9vLxoZWXPzs4vLC3KycmpqKjf3984NDXDwsKtrKyWlJXr6up1c3M3NDT+/v5FQkLk4+NbWFnh4eFGQ0N8enqnpaUqLI91AAAACHRSTlMAPbLm/Xr+e+5HUUkAAAEvSURBVHhe7dlHbsMwFEXRr+KETc29pPfe+/4XFgqihAwkW5ZfAMLgXcCZEJy8T0SeH3BIge+RrrfDYYU9Ii/kwEKPfA7NpwALBsTBOXDtHOjAGWMLNDi+O4aCunPrwdMkwYK6/wHTPCRoaNtB075tYJb3FxxK2SgI8bYEbK4RZEyuAt/nRWcoMDX+3FgnkY7njZIhApxWwJRdo0GV6cpHj2W8MZhXCZJJ68EnpbCgbmvACyHEpQEnP2WT7uABW54GrgY3WHDMWEvwNk3T15VgxNqAbcODUt53Bx/EY53ZHYz4bEPwqOjZACP+IoqMMDBAa9D4ewZc8DLbwL71YGw9eGg9+AEDVdFnDQj4y1sGOrCvavuqQFXbt9sc1s2BDoTPzvBhHD/d024IPS7Azx+//mzqxh5IDfUAAAAASUVORK5CYII="]],
                                [ 55, ["Short hike (<1 km)", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACEFBMVEUAAAAmISEkICEjHyAjHyAkHyEjHyAjHyH///8jHyBFQkImIiP+/v7Ix8dsaWokICHc29xKR0j49/j6+vqioaHZ2Nj5+fkoJCWZl5dGQ0MyLi80MDEqJifX1tZNSkrz8/MxLS41MjP9/f14dXZXVFX7+/vQz8/My8vHxsf8/Pz4+Pj29vaHhIVEQULo6OglISJlYmOpqKhua2w9Ojvi4uKKiIg1MTJPS0zOzc5TUFDv7++Rj4/KyclYVVYvLC3s7Oygn5+lo6RqZ2iSkJBgXV7BwMDGxcWLiYlLSEltamvm5ubJyMh1c3OsqquNi4vn5+fDwsIzLzBraGlMSUmtq6s+OztubGyop6fb2tuhoKDZ2dnU09Q/Ozzk4+OBfn+xr7DW1dU5NTbw8PC0s7OFg4OnpaXLyspmY2R0cXLV1NWnpqaUkpKbmZosKCnS0dHl5eVzcHGQjo9pZ2cuKitJRkdbWFmEgoJhXl67urpCP0D39/eXlZa9vLzCwcGwr6/Ew8Pa2tru7u6Vk5RIREWMiort7e2amZmenJ2rqarMzMympKTx8PHT09N8enpPTE26ubmdm5zR0NCCgIFnZGVeW1x7eXq+vb22tbWgnp5+fHw2MzRaV1crJyhfXF1cWVp3dXUtKSqBf4D09PSOjI3Pzs65t7jAvr9BPT44NDWfnZ1yb3AnIyQ3NDTY19c7NzhiYGDsooYTAAAACHRSTlMAPbLm/Xr+e+5HUUkAAAKXSURBVHhe7dlFj1s9GEDhO8m0PW8YhpmZmaHMzMzMzMzM+DHz9xfrWtHMjbrpWF5NcxbRu3rkyF5Yvo7jpHm8YiWvJ81RTZkq1kqfotaXLhZLT3M8YjWP47ULeh2xXAr8rBQ4G93AVwRuzsjIsAnqJj84d5VN0L98gJn2wPw588EeWLQoBtZA/7xqdAtCfgtg1+IlANSvidrY5e6VdQB0NJRYOTa7AAgsbQlbOoezgOJ1jWqyCY6usAf2ZwHQs7DAEiilPzcBsP3PXAugzt9WjS64OtsCqCu6GwNgOOcfC6BuWecRAP6yAuqaj9cAIVug7uT++hZ7oK6kVJLz+Xztk+AqkgILVef0tDMSidT8LRsLdV0JYO/aq+szM//9chAgKqrSYqBcxIduegLYgs4AHAU2hMfAkQSwyRT0VQIVMgZuFd02TMGzwA5R5QJxKCvRQAiIm4AVQKxdEivcDezRwB2I7TMBq4ADkgDJqYODGqiCYI8B2AY0HRoD+4NwWFQFcZhhAGZ3AEdlHDwGtScUMAicMgBPA1XiAiuAMwrohKyCiYODfRDodYPZ5+GCAi5CtUwcvARcFjcoV+CeAq7BdQMQ4IYkytXgTYh/o/FvDcA+YF0y2At8J99D5Q8G4I9AbVHSX/b/BDOkFX4RAzD6K9CTBMpvEJQI5BiBv2cB5UlgA8T+CMD/RqDcBm7lucFuIAfKhszAoWHgvmtTJPwAiuGhmIHyCCh77FqhPAHgqSnYnAk8C7vA5wC8MAXlJcArFxgFCOQZg/Ia6MsfB+UWUCjmYGMl0OoC3wAjxqDqLRDoHQffAdMnDvar3usp79MYknz1+0FU/6lBH81yNaQuSynQUtafna0/jNt/unempVv9uGD988dHIa8vHAr5k0kAAAAASUVORK5CYII="]],
                                [ 56, ["Medium hike (1 km–10 km)", "data:img/png;base64,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"]],
                                [ 57, ["Long hike (>10 km)", "data:img/png;base64,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"]],
                                [ 58, ["Fuel nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABvFBMVEUAAAAjHyAmISEkICEjHyAkHyEjHyAjHyEjHyD////z8/P+/v4lISJ7eHnT0tL6+vr8/Py8u7v7+/vy8vIpJiZxbm/39/cpJSby8fHU09Tu7u41MjNCP0CenJ35+fkkICGnpaUzLzBPTE1EQUI4NDVAPD1hXl5KR0hXVFXW1dX09PT19fW7urpraGnq6eotKSrw8PDJyMjs6+svLC0sKCk8OTrv7+9VUlM7Nzjs7Ox5dnfGxcbo6OhgXV6YlpYxLS749/hTUFCDgYHKycmop6eFg4MrJyhwbm5ST1Dx8PGsqqumpKS+vb2ioaGwr683NDSamJibmZrIx8eEgoJua2yQjo+5uLnl5eUuKivl5OQ6NjfT09NaV1dvbW2lo6Td3Nx1c3OCgIGamZl0cnMmIiM/Ozzb2ttOSkvX1tbh4eHLysrEw8Ognp729vY0MDGJh4iNi4svKyxsaWqgn5+1tLQyLi+XlZbe3d1VUVJnZGV+fHxiYGB6d3jR0NCjoaIqJie4treGhITj4uOAfX5WU1SUkpOhoKA2MzTNzM39/f1qZ2jS0dG2tbU+OztkYWJfXF34+PjV1NVIREVHQ0TOFnvvAAAACHRSTlMA5j2y/Xr+e2X2yfAAAAJgSURBVHhe7dlFrxtLEIbhMZyk2szMPszMEGZmZmZmZoZ7/3CquzVqS45HY1UvosTv6qvNI0uWvGgbhuF0OUBLDpfTwNqWgbbcbfj53KAxt9NwgdZchkMv6DBAc38q2AJb4JndHlbf4JMiAtnU6s6mwW3s921GoIoj0N0c6GeNigPEenF41yw1A/Y0BC8hsEms0fX2wWsIBPJ1pZHxFgFuHpf41qJdcDuCO6CuPFf4GNsZFGL/Optge2PQK2dXWohPs2SwALLnYSH2jFPBPvNIXhDiPiq4Ecz+TwjxHhGcUedaJtpDA+fVOeQR4OgYCdwPqhITXSGBg6DaIMFQFwXMgMrXJ8UtFDAKNe2SYJgCJmrBRc4FckABI7VgnINVsAfOraprhGF7H8fArIK3B2yBVkXzSyA7IH7PqCB2sAqyeTwOkUHsMMjmcB+hg9hRCRzD6SeCUyc8OAISOInzFBFsh9Pqu+3E2U8Gs3yUBXAW1zky6OPjvAB8EcYKPioIIRwrJXARZwcZLCjwMs4FMnhVgSWcs2QwqsDrOG+QwUkF3sJ5mwxmFFjBeYcMphR4F+cIGexVIKxg7D4ZRIQ9AFmQsRQZjOB4KIFxhsWooBfHIwlMc3CCCg7jeCaBAQ52UME0jsmkAF5wsEwFF/l4CVh3ENcroIK5EA7vax+8yXD6LRmEd2J5Zhhv+D0dTH5Q98dPQAdhKGyeiTiQQdHAZ34Ev+TADjhhAVZM4Ou32e9lABtg/gez6udUs08EJWad/+8D/1uwbvqffGZpgS1Q+7Oz9odx/U/3xnK31j8XtP/98QsC7RJZBqJ1AQAAAABJRU5ErkJggg=="]],
                                [ 59, ["Food nearby", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAABFFBMVEUAAAAmISEjHyAkICEjHyAkHyEjHyAjHyEjHyD///9oZmbl5OT+/v68u7soJCVsaWrBwMBkYWLv7+8sKClKR0hbWFloZWWzsbLGxcX09PT39/dgXV7c29z8/Px2dHRlYmO9vLxqZ2hMSUlpZ2dnZGVmY2TX1tb5+fk2MzSNi4uOjI08OTo4NDWCgIHPzs6fnZ3b2tvo6Oi0s7OqqKlPTE3Y19epqKj29vYnIyQ7NzjZ2NjKycltamv7+/tEQULT0tJOSkucmpsvLC3k4+Nua2wzLzCop6fIx8dbWFhZVleamJhraGnl5eVhXl41MjPW1dV0cXIxLS7a2tpJRkfR0NDx8PGJh4gpJSZeW1x0cnM5NTbp6emdWT/OAAAACHRSTlMAPeay/Xr+e7TLcqMAAAFCSURBVHhe7dlFb8QwEIZhB7adCS0ylJmZmZm5//9/1ErW2o16i6eS2/qVcvkOjyLlNmGMGZYJJJmWwXipLiDLTjFm2ECYbTALSLOYSQuaDIj7YVCDwRjA2joR6MwG4G/vwKJXgPHGlJgHyu68f54EdDELDaxDhj9zmIao9CjyvOkE4Cc6AuTwVjROVjGsuSQJijecwFYrsuBlNC4IcIYI9AU4Igv2R2OfuuCg8qCjPFiiBocowOXKKt5WcrixWaMBOxtWHuxVENyNgXvy4H6nlwvkwYPDtucdgTwIxyduxFVPz0ASjH+YLMDfAjWoQQ0WisULKlDU8x9ADWpQgxrU4FUIXse2erhlkoFl5NVuYlveRd5dMvD+AbFZgniPT97zCyQD4fXt/eP7mv9l1zkNkp+dyQ/j9Kd71m2T/lwg//3xBcCE99Ak5ERiAAAAAElFTkSuQmCC"]],
                                [ 60, ["Wireless beacon", "data:img/png;base64,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"]],
                                [ 62, ["Seasonal access", "data:img/png;base64,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"]],
                                [ 63, ["Recommended for tourists", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAw1BMVEUAAAAzMzMkISEkICAjICEkHyEmHyMkHyCAgIAjHyEjHyD///97eHlTUFCHhYbAvr+9vLyrqao7Nzg0MDE1MjN2dHSVk5QvKyy5uLlnZGWdm5y7urpXVFUuKiuSkJBoZWXGxcU2MzRIRUZhX1/BwMCBfn9+fHzFxMRNSkpoZmZQTU5ZVleMiop/fH2Rj49fXF25t7iUkpNYVVZVUlOnpqakoqMkICHy8vLv7++DgYFEQUIvLC2enJ04NDU6NjctKSpAPD24ZCFrAAAACnRSTlMABVWl2fNR3AKKw76XCQAAAS1JREFUeF7t2UVuA0EQheEetqsHzRRmZsb7nyrqVhQ5intk17xFFvUf4JNq+0rZPD8II2pQFAa+p36KEwKUxN9cq02g2i0LGg8l2nsJWKyUlyDBxFM+QfNVgAUDFWLBUEVYMFIETkABiS7Oq1+t7zQCu4X+0+ZWA3CkF7TLB4/1wk7Y4NliMGeDAwN0aa4XA77WggJ2NtK0R9t9W2nAvf5c+wY8SG2H1EvTo04tOKwMkVGul+iUMsNXwxqw0KuDunCDY80B9dgJTnjgxAlOeeDUCZY8sMSDAgoooIACCijgiAdeOsEBD7xygtc88MYJ0i0HvCM3eJ8/rAo+PpETtD3PZmv0li3RO31k2adMBP8RFBA+psHnPvggCZ9M4aMuenZGD+P46R7/XIC/P74ADSgNjeVbaYYAAAAASUVORK5CYII="]],
                                [ 64, ["Tree climbing required", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB+1BMVEUAAAAkICAkISEkHyEjICEmHyMkHyAzMzMjHyGAgIAjHyD////49/jt7e2ioaHY19fg4OD9/f08OTpST1DDwsIzLzCNi4woJCUvKyxIREUpJSb7+/vx8PFTUFAnIyTh4eH8/PyDgYGNi4tYVVbe3d00MDFCP0Dw8PD6+vqBfn9saWpQTU6GhITd3NzHxsc9OjvBwMC0s7Nua2yUkpLs7OxPTE1dWluura3r6uokICHk4+MmIiNeW1zv7+9HQ0QlISLQz89iYGB4dXbAv8DZ2dlDQEHU09T4+Pg/OzzR0NB9e3v5+fnu7u7V1NWzsrKJh4iPjY65uLlCPj9xbm+WlJUrJyiFg4O3trYpJiZLSEnKycmysLEtKSr39/eTkZF2dHR0cXJ7eHmvrq68u7syLi+trKzq6eqQjo/y8fHf3t6wr69oZWVGQ0NAPD2bmZrT09M1MjM4NDU6Njd6d3haV1fs6+uxr7CenJ1OSkvW1dVnZGV+fHyMior+/v7My8umpKRNSko2MzSnpqZbWFi1tLRzcHH09PQxLS7z8/MuKitpZ2dFQkJwbm6joaJvbW1tamtWU1SamJjPzs7Ozc6dm5zMzMzGxcbb2tvf3981MTJMSUno6Oj19fW9vLy2tbXn5+fm5uY3NDSHhIWZl5eVk5SRj4+KiIh8enpUUVEffl8XAAAACnRSTlMApVXz2VHcBYoC4Kp8lgAAAodJREFUeF6t2YVuIzEQgOENNGlnwsxQZmbmY2ZmZmZmZma+x7xqZd9KjeJ1NvM/wCfZsixrrKjZzSarBYrIYjWZ7cr/SmxAkK2EcWWlQFRpmQoyj0RU1wuEzazabqMEbXbFDKSZFRMtaFKstKBV0T3PvvvbykOPuyJyoEXR84JOVHMsTUmJemBsO/KODBcLhpzeGi9qOU4AQGpFtVFwCeZ0Bs6ew0zrxdWbryx2ZX2FgTcymNuyOGplNtwpAFybRv08y+XBDpRpOiwL+uMo1XxJMJJGuZ5JgmtQsjo5MIuyNUiB1Q5pcJUU+Fra8w7IgOtQvhYdMJqcqQflqxCDWSy0lWIwXTB4KiwCg1h4W0XgQQNg704BmEQD7RKAXWik7vzgxk1GwH19eUHYj0Yayw8OGgJd+UGYMAKuF4BHdxsAFwlAqNgrBnr8WyZngwERCFM7cpWaQCcHngDAhVngHiEIcLx+/EBLX1TbTmcEyjlwDeCQB12HKzVv6JgQ1KpbwJBPKTjJvIUADb14GgCmGgMe9WJvSoIkCH63ijjRfT4YR7XR4bZLeDnGgaqrg9ERkAZhpP56881b4QnE27WodteL6Kky+vri3XOjFiYeQLEg+Do1L94NxYPwUPD2MARCK/ceAQ0418GOzQARCEOoVglEYEy7B4iWzMB5VOBTBo5Sge0MfE4FNjLwBRX4knoP2xg4TQW+YqCbCuxn4BsqkF/eb4nAd8jqJwLfc/ADETjGQScROM7BBBEY4uBHItDFwTlE4GcOxonAZmpwkoO1ROAX6j1MUB+brxxs0gctMuC39u8dP37++v3nr55nIR/3kQ8kyUem5ENd6rEz9WCcfnRP/7lA/v3xD75UN+GzYqi6AAAAAElFTkSuQmCC"]],
                                [ 65, ["Yard (private residence)", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB0VBMVEUAAAAmISEkICEjHyAjHyAkHyEjHyAjHyH///8jHyD6+vrl5OT4+PjGxcX7+/v29vZkYWLp6eloZmb8/PzKyclqZ2hiYGDy8fH49/hgXV6lo6T5+fmnpaV7eHnX1tbv7++5t7jOzc4lISKtrKxpZ2dmY2RnZGXS0dGJh4ju7u40MDEmIiM9Ojtua2y2tbVTUFD09PTh4eH39/dtamtjYGFraGnz8/NhX1/d3Nxwbm6Qjo/t7e1PS0yMioonIyQ8OTrg4OB2dHR/fH2Rj49KR0jBwMAvLC1oZWWvrq6amZn9/f1ubGyKiIhvbW1ZVldLSElBPT44NDWhoKC1tLRzcHFfXF2xr7B9e3thXl5saWpCP0CHhIUkICGEgoLn5+f29fVlYmPq6urf3t7i4uIsKCnv7u5NSkrj4+Pe3d3Z2Njo6Oj19fV1c3Pq6elOS0yDgYFxbm/m5uby8vLl5eU2MjOJhoezsrKZl5dcWVpwbW7r6uqxsLDn5uZ0cXJYVVY/PD2NiovOzc2Vk5NGQ0PLysrr6+vm5eW4t7fBv7/b29v7+vrCwcGsqqrNzMzo5+fR0NAzLzDHxse6ublOSkukoqNIREUvKyyBfn/Avr+7urqrqaq/neGsAAAACHRSTlMAPbLm/Xr+e+5HUUkAAAI+SURBVHhe7dlVj9tAGIXhCWz7mcO4zMwMRWZmZmZmZmb4td0520iOkriyPbtatT43r+Yijxz5bswY8/kDkpAF/D42ubI5krAFyxjzBQGIEn3MLwmdnwXEggEmCd7MgR7ogVvTYsF0KpUWCe5IEalD4sAhlSanJkSBCZUwtV8M2M89LBsSAYayhEFscA8egJeb3OgWbIBnEpe7AxtlMGax3g0YgZc/Pe4crIdXIA44BeM6FZ3e5wwcgFds0Q4n4E54JcTV9sE+eCXFEbtgR5QsF71gD1wLz2qrttgB27dd+xu4oq7d3kshrHpqRQ4A7IMWh9kL7hEN1s56sM0VWDE182G7Y9B6Hrhx1HLNZnD3wtxaSoPjZLmkGZwv5aaUBtePWa4HoKIkC0FZUXqdvhRJWlwIVkpS9UyAy2IRNLMSORNDdmld6Oa9yJpOZF3NBp4jWhxAZhMyotWawVZahNYsRUYJGacQGi5HfilIhJbgGeg8gJiGTNC8aQWP0b5Kvv2DyEFCDtFh9NVRpEpGjtMJnpN0CsfT3cjZfPAcjS3gUw2kipCLFEb1S8igjoTpMk/Pn5/0GkiL8L/8/4EeeIWutvI1ach1Qm7QTfRWHXL7DnKX7vHcpwc4Powhj/LBLnK9fPAxPSnne/oMaSLkOb1AjZfIcDfymjp53tBbHMPvkPfT/FI+GBXox0/IhIF8lhOo8gXJDCOh5Feeb/J3AD9+Is1y2z98zeKBHij82ln4xbj4q3s2Nyj044Lwzx+/AQDPUBZU5RMeAAAAAElFTkSuQmCC"]],
                                [ 66, ["Teamwork cache", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAACf1BMVEUAAAAzMzMkISEkICAjICEkHyEjHyAmHyMkHyCAgIAjHyEpJiZmY2TMy8v29vbr6uq3trZAPD0mIiOOjI3f3t7+/v7p6emrqaozLzCSkJD////19fVVUVIlISLHxsc4NDVST1D9/f3f398pJSaFg4O5uLmamZlUUVHNzM37+/u/vb54dXYsKClgXV4qJidGQ0NPTE3v7+9IREWgnp5aV1coJCXEw8P49/hoZWXT0tJZVlfPzs78/PxeW1zq6erY19cnIyRxbm/y8vJOSkuJh4ipqKhlYmOqqKlTUFDs7OxDQEHOzc7t7e08ODmBfn/m5ubR0NCbmZqjoaJCPj/l5OQ7NziXlZbn5+fy8fGzsrI3NDRAPj9DP0BsaWqEgoLo6OgvKyyNi4vd3NyKiIh/fH10cXJoZmZJRkckICFqZ2ja2tqhoKC7urpXVFVCP0CHhIWnpaXg4OA1MTJtamvS0dF+fHwxLS6npqYrJyj4+Pi6ublFQkLw8PCtq6uioaHj4uOzsbItKSrT09P6+vq5t7hQTU75+fnAvr/b2ttcWVq+vb1WU1Sop6eLiYkyLi93dXWNi4zKycljYGFHQ0RnZGU2MzRzcHGura3Qz89pZ2dYVVZdWlvW1dXDwsJLSEl0cnP39/eYlpY/OzyAfX7k4+NVUlOUkpPLysrZ2dlhX19bWFivrq6Zl5d7eXqRj4+4trf09PTl5eVBPT5ua2w1MjOGhITGxcWamJimpKSIhoe8u7svLC3u7u7i4uJ8enp6d3hkYWJMSUnZ2NiysLGCgIE6Njesqqvh4eFEQUJIRUY0MDHz8/N9e3suKivx8PG1tLSBf4BvbW2UkpKQjo89OjtlG4m1AAAAC3RSTlMABVWl2fP/UdwCigIZxugAAAOySURBVHgB7MxHAcNQFAMwvz348+1uCMTHLwDCh6h55A3hpoJLdRJ04Ws2SXbwtkmzeKkkKkA6iVqgSaWwpDJ4UjkiqQJJdsITPimtBy5LjgCO4of/OGPdydq2bdu2bdu2bdsbOztx8oX21KnWc83vqXmfqzu1T8oX/PSzz7Oyc5RKbl5+QWFRsXuwBKP0CyVXoSJGYSXXYOUqGFStpqSqY9VwDdbEU0tJ1caq84ljsC6eena+foOG5qFRY1lN8DR1DDbD01xGi5a0aq0KbWjVVobaYbVv6BjsgNWxvpmrkA2dOktdoGs3Gd2x6jp/yz0wqvSU0Quq9DYTLaFPXzOR2w+j/wDnoAYOov3gWjKGAENlDGsFw0eYqWojRzF6zFi5Ba1x45vWajCh3sRewKTJMjQFmDpt+oyZHXo3nWWXuQZn1yBijqwWcwm1qlWe4Dwi5su3oIBQ/4XuwUVEdB2gwGIilix1DS4rILB8xUpF1FrVlUC71W7BBWvw9ZuleA2nE1g72yW4bj2BDUrUl9BGh+DYTYQ2K9EsIhZlDG7ZCmzDs12JduDZCRQsyxDM3QXs3oNnrxLtw7P/ALBmQfrgKqDfwWCAaqlEe/AcUr32sH5duuBhoO7qcEQ8okRH8RyTjreCTSdSB08Cp3Il5WGdVqIzWKPNzNnR0KZ+yuC5LIbYCazzStQF64KMix1Z3DBlUGMv2cfJVcC43EIJrmCV2NmrrV0Gh6XtsfYpQT+sK+UZba7hmaJ49etgXS9PsDaeCykPOHDDPXgVX2mu4tzEN9Q9OIVAb8W5ha9PrnPwNoHuitVwJ4E7rsGLhHYp1l2MAox7rsH7AFUeYHStoBgPMeY/Anjc0DH4BGCxKmI0VpS3sPLTnQDP3IJnAbo+934gLxTVohXAS+kVwHy34GuAN5KWA7xV1AKMPdKXfYCdK12Cnb8Cvq7mjyvrZyvicDAGfQPwrUvwu/BkYTfA94q4AHDcTFX4AajoEvwxHFhnAPwUffWlwO3wP1jl58zB+p9DQTc7nXs97kDVG6CLrL1A9czBLsAv8qwA+ivUHfi1gqzf6kCbzMG6UFpJnk+ygHcK7AIexJw6980ULKsDh2Nf0nT5KvwOhdXkO9gEHmYK/gHDGyrw51/wt3yN437o/0B+pmCtlvyriP8gS74X0GSLQp2nTppWIePP5p2iyj6HdfK8hf8V9X5XHEY74KMGUgNQfTCN6sN9VB+QpPqQKdUHdak97EztgXGqD93TYHKB6tMfAEgYV6KCqDr0AAAAAElFTkSuQmCC"]],
                                [ 67, ["GeoTour", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAB2lBMVEUAAAAjHyAmISEkICEjHyAkHyEjHyAjHyEjHyD////t7e34+PgyLi8sKCnm5ubs6+vl5eXW1dWFg4NNSkqUkpPq6eolISLn5+d7eHmamJgtKSpHQ0SenJ3p6emnpaUqJieRj4/Ozc4oJCWmpKTb2tvZ2dk0MDFCP0C4trcpJSbV1NX09PTT09PNzM1bWFjo6OgkICHg4OCPjY5RTk8mIiPs7Ozl5ORZVldST1Cgn59VUVIvLC38/Pzz8/P6+vrk4+OAfX729vbQz8+GhIS3trYxLS44NDXd3Nxwbm5oZmbU09RGQ0MnIyRQTU6rqapUUVHX1tawr6/DwsKLiYlbWFlcWVrPzs4pJiY9OjvBwMD49/hraGn7+/tpZ2c6NjfCwcGioaGKiIiTkZF+fHy8u7s2MzRvbW3w8PB3dXW0s7M+OzthX1/19fVCPj/v7++Bfn/HxseMiorY19eXlZZMSUlJRkfS0dH+/v6vrq75+flIREWdm5yysLGjoaJoZWWura339/dEQUJnZGXe3d08ODmamZlua2wrJyh5dnf9/f3h4eFTUFCgnp59e3tiYGBPTE1kYWLy8fHr6urJyMizsbKSkJB7eXrR0NBAPD3Kycm9vLw3NDR/fH2DgYEImVv7AAAACHRSTlMA5j2y/Xr+e2X2yfAAAAI2SURBVHhe7dlFj9xAEIZhD2xS5WGmRWZmhjAzMzMzMzPzf01aVmvc2mlFrtQp8nv8Do8l2/KhbRiG1+cBljw+r/GnsnnAlr/MMLx+YMzvNXzAms/w8IIeA5jjAF3QBV1wy6qNSomV/wQG1+1ENQzsDdHB/HMs0eV+MjiCJdtABqOlwVkquEgANeVKp8VtpIKLBVitbg1i4wTPc4MxbnC5M7BlWbKy2FUBbvulFBbbalvJ2/16MFGPhNrv6cBgBZJ6UKUBHyGxBRqwgwo2a8ABKhjTgGZpYOav4Fon4PZ401wxtZAMthcA4nPWpVsDNHB8v/jid9eg2lmAchK4pA9EsCKgzJMFgMYJ5+CVEfnCptcrYE5svY7B6Ca5N21WvHBIjPmIQ/DOmJwPzKDSDms+4wg0d8lx9x5Ua8sle/fFp7PZgAPw4CG5HT6CMvqLPXFULsFjCkAE64/L4UQFcoAnT1lDqA6RBcSOtBhGe5ALxHMAtRfGkQ+cvHgpZgeeZVojNFAWvlbUBnLXxReiqq+yjQiq3WgB2djN4myaRPAW2GtGq0wnQGeGBDYqYAGthsQwRAHvglLeWlPWkCKAuEYB71tjlzV0UcCGoM17GLVfZpT2lAcf14LVk6emHKeGAV5MUUBR5OWr12/eTte9U64ziDI9+B6JtWrAD1Twowb8RAU/a8BQD837ktaA8PUbxfv+A3QgdA//rHZYNuEeEfyPoAu6IPuxM/vBOP/RvTHfz/pzgf33x2/08h6MLBAO3AAAAABJRU5ErkJggg=="]],
                                [ 69, ["Bonus cache", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAulBMVEUAAAAiHx8iHx8iHx8iHx8iHx8iHx8iHx8iHx8iHx/////y8vIwLS2fnZ3IyMgpJiYmIyP9/f3f3983NDT6+vro6Ojb29u5uLinpaWEgoJfXV1KSEhEQUEtKirW1tbT0tKtrKx5eHh0c3Nxb29PTU339/f09PTt7e3k5OS9vLy2tbWOjY1qaGhnZWVaWFhTUFA7OTnq6urMy8vHxsbDwsKpqKiHhoaAfn59e3vX19fOzc2joqKZl5eYlpZAfrphAAAACXRSTlMA7Oq2o2ZjDAbq1XBnAAAB00lEQVRYw+3ZWXPBYBTG8aCq5yQaEiQkqSqK1tKdbt//azXehWnGDH09F2aa/xU3v2xnjDmxRJVyqUhHVSyVK9am8wIBKpwr7uKMQJ1dCFB4IFFcLwFLr7pSQIKFilUmaGWrhAVLVhELFi0Cl4M5mIP/FnQdGJj0w+7olpmH3st3xz0WdKpra5v9+XAUOGhytkb7CDCyeUehMeh6Uqh7z0HQ2opLU3DJ6x578gkvNqTtGIJSiEnlj7XYMwN9dcEfA5LNNHh3GNi/TnNpU4dVthqV2pBl3cPAKqc5tGnGunuS6SFqmYEL1r2qM2yo709mYG2kwVXmHnyZgTRVZ+Ql8gBd5Q0fDEEaBDZzPfCld8eqGzIAdYmfkMh5Vly9R/vAzqWoKe63+DihbHFLec057QVvOJtNmea2nmmfEOC8oU5vRoQA41s1jw4dBPZtUUNQojH96lIeZUoq06esi4T3GBEK7IlpWRAMbHPaC4HBKhBciZ8wIOi2J5M39+/g21VaQjs78T9Lfui9t2s40BlzWogD71kUwcBAgn0YGEqwAwMH9bXn1WAgTUfM3Rg5h24Un/Zg52AO5iAk+LoPvpCEr0zhS1302hm9GMev7vEvF+CvP34A4IjvVwOlGjcAAAAASUVORK5CYII="]],
                                [ 70, ["Power trail", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAQlBMVEUAAAAjHyAjHyAjHyAjHyAjHyD///9aV1jJyMiRj5AxLS7W1tby8vJ2c3RMSUo/OzytrKyEgYLk5ORoZWa7urqfnZ454p/JAAAABXRSTlMA0JAgEJEfMx4AAAH9SURBVFjD7dnbjpswEAbgJdn5fT4C7/+q1aazBoIqre25qKr+V0gRn2ZkknHMxyvPx0KTWR7Pj5YHieTB3OdCQlk+mycmHv2Kdf0k0Ty5QMESF1lw+ZBQFNCue0GrjEaLmgNTyA6XxHHQms3jGqc1f1jgu8HyrpVERrfa4xy4hUREDHJ6QdJOcZyhr0yDul19g5soaEP1qxyoMuqeaAp0xHHZVGxc3ThYUNQrO1DNpbiq1QBoNTjvxUXgAk5nhydR0GMXBQOQRMEKTZLgCiiSbTmTDHjkPziRYGXBDGclwQJs3RXGkis4/q1fwPW0fOwRDvDu/RS0tz0CXDV0ys7eD0Hzru2R9AWMnr0u8NgktGF3iJY6QOuy4mClrzTwSAd4vrv9ODlZMGjPG6Jk58GYvc/pWI05cC0OOti2usA6AvrYnje/c3HshZGWowdHn+9P7HWALep37PVpYq8f/GPdgSRBitf1+PtHwL8N2pxkQQNYUdAji1YYANmWHTaSBBOwjoOxZP0dZgo8jYD34V54jWvuB+N9uNfTo9INRtz/syvQOKgu2vYa7lMgbdVwNM+1SdDo29UqC1rjsyC4bmgbOGVnwbRXZHX6nsQBMCDw/R6o5VSUAkYqtA4cLm4UPKKO4T4Oih9Iih+Zih/qSh87Sx+Myx/dy79cEH/98QvfiYZISvhU/gAAAABJRU5ErkJggg=="]],
                                [ 71, ["Challenge cache", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAQlBMVEUAAAAjHyAjHyAjHyAjHyAjHyD///8xLS7y8vKRj5Dk5ORaV1jJyMitrKxoZWZ2c3TW1tZMSUo/Ozy7urqEgYKfnZ4GxPCtAAAABXRSTlMA0JAgEJEfMx4AAAIFSURBVFjD7dnbbsIwDAZgCrNzTpq0vP+rTishjjh4nWKhTeO/AUT5FCd1QOGw5XScYDDT8XRoOYJIjpX7mEAo0wd5UiLVK1b1CURzogFKDXGSBacDCOdlYLSINsqBEbdEMdBeQCsFZqx5HRiDt6j9spZ9JWu+5DxjS1B7wMQuStbYZVYMSCJ323hEtMY5c4EDB1JKefoOIupVtaHqHWBel2VVT0B3qfTraahLx4IlhUsp2igG3BjzLejOdQEZUlGh9ruSDWFEumiC97GbkAXRxlZxeg5GZFLuRrqQ9xgsmgPdrbdNjnXwEKQrcAkPPaseeUYxrRfq59aGpGS3R+8N3UTddOvMbQ4J6yU0wgzKOfe0XbQCDrTXGZ6R3WwIPAML+tqWqnmeAwPqxINLbSfXwDNwyQp4sKjbmztxnjOJAyn9mnBeXwEP+gYqdgoR9V6Q3xtoYuw+UCPF0jzdN56O+0Dsw/98+AlIyQMg3YY+2Ss4i4AGoJFlDIxXsJFuDDSE1LaOMiAtkOGWjQfvvmrnQZAapX+xCIBzP1w/Bupq0ITaMbDfWuv3lQBo+p+y9hbZDVKjxG7NdRYAqTmKUzAExvu9egw0dJkgOMuAVHJgkJ+CcEaclSQIqgCIgJR/BmKXN/gGXwT+3bOvXwRKH0iKH5mKH+pKHztLH4zLH93L/7kg/vfHJ8ohiCdWyy7KAAAAAElFTkSuQmCC"]],
                                [ 72, ["Geocaching.com solution checker", "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAS1BMVEUAAAAjHyAjHyAjHyAjHyAjHyD///+Rj5B2c3Ty8vKtrKxMSUrW1tYwLC1aV1hZVlc+OjsxLS7JyMi7urrk5OSfnZ6DgYHIx8doZGXYZxLcAAAABXRSTlMA0JAgEJEfMx4AAAHLSURBVFjD7dnbjoIwEAZgkZ2eKbQc3/9JVxEpi22YlLkwq/+NhJgvPTE05TKnvBZwMsW1vKy5AkmuC/dTAFGKn+BRiaG/ZL0ugTRlaCBVEzEj6Ky1DXIULwiuZ/e0DiUiQMMeMY4G5OwZRQN2bA0NyELse4IygI54UlogAZ1ZPNnQgKAXUAAJGFY2kIF+9iQAcZctDaiFXEDJdSbYM0wUGhQMF4EFORLk/xeUI79FGSJQTbCkEuY8ODawjZAnwQF2qdpMML3SVCaYXrltNqggmqrLBGUF8dSZIIdUxgww3sCJ8/nnAfr5nlXeK4sAVbwMbd+sOpQ6dQyKqMe2fZbCrlPeH4J11BPJ8tEcgVXagyECDkfgwnivXzyoIyDHgPO11HsPRA7YrJ2TOnjpEqyRk6LuIg9e6rXo4Qjku+oiXvcmRjvRhY3UAWggiDuvWRB3u3Zc3q6UQzzLeiuKyB/ap69xxaENN/z0p37JzHpYQzw9ywS7KlEOc0FmYqKWGWAQo14+yLr9OA6ndw6q2Q7fSLG3aYe5mVXdd++6+/oAsEGCFgvCZBBcJwAH4vMFv+AngQWtV5AfmZIf6lIfO1MfjNMf3dN/XCD//PELRxmG9x3OFZ0AAAAASUVORK5CYII="]]]);



function html_badge_section(bodyNode, badgeName, country=false) {
  var sectionName = badgeName.toLowerCase().replaceAll(" ", "_");
  
  bodyNode.append(document.createElement("hr"));
  
  var sectionNode = document.createElement("section");
  bodyNode.append(sectionNode);
  sectionNode.id = sectionName;
  
  var detailsNode = document.createElement("details");
  sectionNode.append(detailsNode);
  
  var summaryNode = document.createElement("summary");
  summaryNode.style.fontSize = "1.5em";
  detailsNode.append(summaryNode);
  
  var bNode = document.createElement("b");
  summaryNode.append(bNode);
  bNode.append(badgeName);
  
  summaryNode.append((country ? " Country" : "") + " Badge");
  
  return detailsNode;
}

function html_error_details(errors) {
  var detailsNode = document.createElement("details");
  
  var summaryNode = document.createElement("summary");
  detailsNode.append(summaryNode);
  
  var spanNode = document.createElement("span");
  spanNode.style.color = COLOR_RED;
  spanNode.append("Errors");
  summaryNode.append(spanNode);
  
  var pNode = document.createElement("p");
  detailsNode.append(pNode);
  pNode.append("You can help improve this tool by sending an ");
  
  var aNode = document.createElement("a");
  pNode.append(aNode);
  aNode.setAttribute("href", "mailto:entropyendeavor@gmail.com");
  aNode.append("email");
  pNode.append(' with the following errors and/or your "My Finds" GPX file.');
  
  var ulNode = document.createElement("ul");
  detailsNode.append(ulNode);
  
  for (var error of errors) {
    var liNode = document.createElement("li");
    ulNode.append(liNode);
    spanNode = document.createElement("span");
    liNode.append(spanNode);
    
    spanNode.style.color = COLOR_RED;
    spanNode.append(error);
  }
  
  return detailsNode;  
}

function html_icon_image(icon, size="32px") {
  var iconDescription = icon[0];
  var iconData = icon[1];
  
  var iconNode = null;
  
  if (iconData.startsWith("data:img/")) {
    iconNode = document.createElement("img");
    iconNode.setAttribute("alt", iconDescription);
    iconNode.setAttribute("height", size);
    iconNode.setAttribute("width", size);
    iconNode.setAttribute("src", iconData);
  }
  else {
    iconNode = document.createElement("span");
    iconNode.append(iconData);
  }
  
  iconNode.setAttribute("title", iconDescription);
  
  return iconNode;
}

function html_see_combined() {
  var pNode = document.createElement("p");
  pNode.append('Please see "Combined Calendars" section for ');
  
  var bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("366");
  
  pNode.append(" addon progress.");
  
  return pNode;
}

function html_add_basic_calendar(sectionNode, icon, calendar) {
  var pNode = document.createElement("p");
  sectionNode.append(pNode);
  pNode.append("Progress towards ");
  
  var bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("366");
  
  pNode.append(" addon (");
  bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append(calendar.size.toString());
  
  pNode.append(" out of ");
  bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("366");
  pNode.append("):");
  
  
  var tableNode = document.createElement("table");
  sectionNode.append(tableNode);
  
  var trNode = document.createElement("tr");
  tableNode.append(trNode);
  var thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append(html_icon_image(icon));
  
  for (let dayNum = 1; dayNum <= 31; dayNum++) {
    thNode = document.createElement("th");
    trNode.append(thNode);
    thNode.append(dayNum.toString());
  }
  
  for (var month of monthInfo) {
    trNode = document.createElement("tr");
    tableNode.append(trNode);
    
    thNode = document.createElement("th");
    trNode.append(thNode);
    thNode.append(month[0].substr(0,3));
    
    for (let dayNum = 1; dayNum <= month[2]; dayNum += 1) {
      let tdNode = document.createElement("td");
      trNode.append(tdNode);
      
      if (calendar.has(month[1]*100 + dayNum)) {
        tdNode.append(html_check_mark());
      }
    }
    
    for (let extraDay = month[2] + 1; extraDay <= 31; extraDay += 1) {
      let tdNode = document.createElement("td");
      trNode.append(tdNode);
      tdNode.setAttribute("bgcolor", "grey");
    }
  }
}

function html_add_dt_info(sectionNode, icon, dtGrid) {
  var pNode = document.createElement("p");
  sectionNode.append(pNode);
  
  pNode.append("Progress towards ");
  var bNode = document.createElement("b");
  pNode.append(bNode);
  
  bNode.append((icon[0] === "Leapday") ? "Leapday" : "D/T");
  pNode.append(" addon (");
  
  bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append(dtGrid.size.toString());
  
  pNode.append(" out of ");
  bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("81");
  pNode.append("):");
  
  // D/T Grid
  var tableNode = document.createElement("table");
  sectionNode.append(tableNode);
  var trNode = document.createElement("tr");
  tableNode.append(trNode);
  var thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append(html_icon_image(icon));
  
  for (let t = 10; t <= 50; t += 5) {
    thNode = document.createElement("th");
    trNode.append(thNode);
    thNode.append((t/10).toFixed(1));
  }
  
  for (let d = 10; d <= 50; d += 5) {
    trNode = document.createElement("tr");
    tableNode.append(trNode);
    thNode = document.createElement("th");
    trNode.append(thNode);
    thNode.append((d/10).toFixed(1));
    
    for (let t = 10; t <= 50; t += 5) {
      var tdNode = document.createElement("td");
      trNode.append(tdNode);
      
      if (dtGrid.has(d*100 + t)) {
        tdNode.append(html_check_mark());
      }
    }      
  }
  
  // Way to 81 table
  var caches = [];
  for (let dt of dtGrid.keys()) {
    caches.push([dtGrid.get(dt), dt]);
  }
  caches.sort(function (a,b) {return log_date_comparator(a[0][0], b[0][0]);});
  
  var detailsNode = document.createElement("details");
  sectionNode.append(detailsNode);
  var summaryNode = document.createElement("summary");
  detailsNode.append(summaryNode);
  summaryNode.append("Way to 81");
  
  tableNode = document.createElement("table");
  detailsNode.append(tableNode);
  var theadNode = document.createElement("thead");
  tableNode.append(theadNode);
  trNode = document.createElement("tr");
  theadNode.append(trNode);
  
  thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append("#");
  thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append("Date");
  thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append("Interval");
  thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append("GCCode");
  thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append("Cache Name");
  thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append("Type");
  thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append("D/T");
  
  var tbodyNode = document.createElement("tbody");
  tableNode.append(tbodyNode);
  
  var prevDate = null;
  for (var ix = 0; ix < caches.length; ix += 1) {
    var foundYear = caches[ix][0][0][0];
    var foundMonth = caches[ix][0][0][1];
    var foundDay = caches[ix][0][0][2];
    var foundDate = new Date(foundYear,foundMonth-1,foundDay);
    var lid = caches[ix][0][0][3];
    var code = caches[ix][0][1];
    var name = caches[ix][0][2];
    var cacheType = caches[ix][0][3];
    var d = (Math.floor(caches[ix][1]/100)/10);
    var t = ((caches[ix][1] % 100)/10);
    
    trNode = document.createElement("tr");
    tbodyNode.append(trNode);
    
    tdNode = document.createElement("td");
    trNode.append(tdNode);
    tdNode.append((ix+1).toString());
    
    tdNode = document.createElement("td");
    trNode.append(tdNode);
    var aNode = document.createElement("a");
    tdNode.append(aNode);
    aNode.setAttribute("href", "https://www.geocaching.com/seek/log.aspx?LID=" + lid);
    aNode.append(foundDate.toISOString().substr(0,10));
    
    tdNode = document.createElement("td");
    trNode.append(tdNode);
    
    if (ix !== 0) {
      var interval = Math.round((foundDate - prevDate)/(1000*60*60*24));
      tdNode.append(interval.toString() + " day");
      if (interval != 1) {
        tdNode.append("s");
      }
    }
    prevDate = foundDate;
    
    tdNode = document.createElement("td");
    trNode.append(tdNode);
    aNode = document.createElement("a");
    tdNode.append(aNode);
    aNode.setAttribute("href", "https://coord.info/" + code);
    aNode.append(code);
    
    tdNode = document.createElement("td");
    trNode.append(tdNode);
    tdNode.style.textAlign = "left";
    tdNode.append(name);
    
    tdNode = document.createElement("td");
    trNode.append(tdNode);
    tdNode.append(html_icon_image(typeIcons.get(cacheType), "16px"));
    
    tdNode = document.createElement("td");
    trNode.append(tdNode);
    if (d >= 3) {
      let bNode = document.createElement("b");
      tdNode.append(bNode);
      bNode.append(d.toFixed(1));
    }
    else {
      tdNode.append(d.toFixed(1));
    }
    
    tdNode.append("/");
    
    if (t >= 3) {
      let bNode = document.createElement("b");
      tdNode.append(bNode);
      bNode.append(t.toFixed(1));
    }
    else {
      tdNode.append(t.toFixed(1));
    }
    
  }
}

function html_x_mark(size = null) {
  var spanNode = document.createElement("span");
  spanNode.style.color = COLOR_RED;
  if (size !== null) {
    spanNode.style.fontSize = size;
  }
  
  spanNode.append("\u{2717}");
  
  return spanNode;
}

function html_check_mark(size = null) {
  spanNode = document.createElement("span");
  spanNode.style.color = COLOR_GREEN;
  if (size != null) {
    spanNode.style.fontSize = size;
  }
  
  spanNode.append("\u{2714}");
  
  return spanNode;
}


function html_single_find_addon(qualifies, addonName) {
  var pNode = document.createElement("p");
  
  var symbolNode = null;
  if (qualifies) {
    symbolNode = html_check_mark("2em");
  }
  else {
    symbolNode = html_x_mark("2em");
  }
  
  pNode.append(symbolNode);
  pNode.append(" You ");
  
  if (!qualifies) {
    pNode.append("do not ");
  }
  
  pNode.append("have a find that qualifies for the ");
  
  var bNode = document.createElement("b");
  bNode.append(addonName);
  pNode.append(bNode);
  
  pNode.append(" addon.")
  
  return pNode;
}  

function html_multi_find_addon(have, needed, addonName) {
  var pNode = document.createElement("p");
  
  var symbolNode = null;
  if (have >= needed) {
    symbolNode = html_check_mark("2em");
  }
  else {
    symbolNode = html_x_mark("2em");
  }
  
  pNode.append(symbolNode);
  pNode.append(" You have ");
  
  var bNode = document.createElement("b");
  bNode.append(have.toString());
  pNode.append(bNode);
  pNode.append(" out of the required ");
  
  bNode = document.createElement("b");
  bNode.append(needed.toString());
  pNode.append(bNode);
  pNode.append(" finds for the ");
  
  bNode = document.createElement("b");
  bNode.append(addonName);
  pNode.append(bNode);
  pNode.append(" addon.");
  
  
  return pNode;
}

function html_traveling_grid(sectionNode, grid) {
  var pNode = document.createElement("p");
  sectionNode.append(pNode);
  pNode.append("Cells with a ");
  pNode.append(html_check_mark());
  pNode.append(" means you have two countries. Cells with flags ");
  pNode.append("show the one country you already have.");

  pNode = document.createElement("p");
  sectionNode.append(pNode);
  pNode.append("Progress towards ");
  var bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("D/T");
  pNode.append(" addon (");
  bNode = document.createElement("b");
  pNode.append(bNode);
  
  var foundCount = 0;
  for (let v of grid.values()) {
    if (v === true) {
      foundCount += 1;
    }
  }
  
  bNode.append(foundCount.toString());
  pNode.append(" out of ");
  bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("81");
  pNode.append("):");
  
  
  var tableNode = document.createElement("table");
  sectionNode.append(tableNode);
  var trNode = document.createElement("tr");
  tableNode.append(trNode);
  trNode.append(html_icon_image(iconTraveling));
  
  for (let t = 10; t <= 50; t+= 5) {
    let thNode = document.createElement("th");
    trNode.append(thNode);
    thNode.append((t/10).toFixed(1));
  }
  
  for (let d = 10; d <= 50; d+= 5) {
    trNode = document.createElement("tr");
    tableNode.append(trNode);
    let thNode = document.createElement("th");
    trNode.append(thNode);
    thNode.append((d/10).toFixed(1));
    
    for (let t = 10; t <= 50; t += 5) {
      let dt = d*100 + t;
      
      let tdNode = document.createElement("td");
      trNode.append(tdNode);
      
      if (grid.has(dt)) {
        if (grid.get(dt) === true) {
          tdNode.append(html_check_mark());
        }
        else {
          let country = grid.get(dt);
          tdNode.append(html_icon_image([country, flagsUnicode.get(country)]));
        }
      }
    }
  }
}

function html_traveling_calendar(sectionNode, calendar) {
  var pNode = document.createElement("p");
  sectionNode.append(pNode);
  pNode.append("Progress towards ");
  var bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("366");
  pNode.append(" addon (");
  bNode = document.createElement("b");
  pNode.append(bNode);
  
  var foundCount = 0;
  for (let v of calendar.values()) {
    if (v === true) {
      foundCount += 1;
    }
  }
  
  bNode.append(foundCount.toString());
  pNode.append(" out of ");
  bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("366");
  pNode.append("):");
  
  
  var tableNode = document.createElement("table");
  sectionNode.append(tableNode);
  var trNode = document.createElement("tr");
  tableNode.append(trNode);
  var thNode = document.createElement("th");
  trNode.append(thNode);
  thNode.append(html_icon_image(iconTraveling));
  
  for (let dayNum = 1; dayNum <= 31; dayNum += 1) {
    thNode = document.createElement("th");
    trNode.append(thNode);
    thNode.append(dayNum.toString());
  }
  
  for (var month of monthInfo) {
    trNode = document.createElement("tr");
    tableNode.append(trNode);
    
    thNode = document.createElement("th");
    trNode.append(thNode);
    thNode.append(month[0].substr(0,3));
    
    for (let dayNum = 1; dayNum <= month[2]; dayNum += 1) {
      let tdNode = document.createElement("td");
      trNode.append(tdNode);
      
      var md = month[1]*100 + dayNum
      if (calendar.has(md)) {
        if (calendar.get(md) === true) {
          tdNode.append(html_check_mark(md));
        }
        else {
          let country = calendar.get(md);
          tdNode.append(html_icon_image([country, flagsUnicode.get(country)]));
        }
      }
    }
    
    for (let extraDay = month[2] + 1; extraDay <= 31; extraDay += 1) {
      let tdNode = document.createElement("td");
      trNode.append(tdNode);
      tdNode.setAttribute("bgcolor", "grey");
    }
  }  
  
}

function html_traveling_single(sectionNode, qualifies, addonName) {
  var pNode = document.createElement("p");
  sectionNode.append(pNode);
  
  if (qualifies === true) {
    pNode.append(html_check_mark("2em"));
    pNode.append(" You have qualifying finds for the ");
  }
  else {
    pNode.append(html_x_mark("2em"));
    if (qualifies === false) {
      pNode.append(" You do not have any qualifying finds for the ");
    }
    else {
      pNode.append(" You only have find(s) in ");
      pNode.append(html_icon_image([qualifies, flagsUnicode.get(qualifies)]));
      pNode.append(" for the ");
    }
  }
  
  var bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append(addonName);
  pNode.append(" addon.");  
}  


function html_make_combined_calendar(bodyNode, results) {
  bodyNode.append(document.createElement("hr"));
  
  var sectionNode = document.createElement("section");
  bodyNode.append(sectionNode);
  sectionNode.setAttribute("id", "combined_calendars");
  var detailsNode = document.createElement("details");
  sectionNode.append(detailsNode);
  var summaryNode = document.createElement("summary");
  detailsNode.append(summaryNode);
  summaryNode.style.fontSize = "1.5em";
  summaryNode.append("Combined Calendars");
  
  var pNode = document.createElement("p");
  detailsNode.append(pNode);
  pNode.append('Icons show what you still need for that day. Please check "');
  var bNode = document.createElement("b");
  pNode.append(bNode);  
  bNode.append("The Traveling Cacher");
  pNode.append(' Badge" section to see if you also need a find in another country for each day.');
  
  for (let month of monthInfo) {
    var tableNode = document.createElement("table");
    detailsNode.append(tableNode);
    tableNode.setAttribute("class", "combined");
    
    var captionNode = document.createElement("caption");
    tableNode.append(captionNode);
    captionNode.style.fontSize = "1.25em";
    captionNode.append(month[0]);
    
    for (let rowStart = 1; rowStart <= 31; rowStart += 7) {
      var trNode = document.createElement("tr");
      tableNode.append(trNode);
      
      for (let day = rowStart; day < rowStart + 7; day += 1) {
        var tdNode = document.createElement("td");
        trNode.append(tdNode);
        
        if (day > month[2]) {
          tdNode.setAttribute("bgcolor", "grey");
        }
        else {
          var insideNode = document.createElement("table");
          tdNode.append(insideNode);
          
          var rowNode = document.createElement("tr");
          insideNode.append(rowNode);
          
          var boxNode = document.createElement("td");
          rowNode.append(boxNode);
          boxNode.append(day.toString());
          
          var md = month[1]*100 + day;
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.traditionalCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconTraditional, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.mysteriousCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconMysterious, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.multiCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconMulti, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.virtualCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconVirtual, "28px"));
          }
          
          var rowNode = document.createElement("tr");
          insideNode.append(rowNode);
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.earthCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconEarth, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.letterboxer.calendar.has(md)) {
            boxNode.append(html_icon_image(iconLetterbox, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.wherigoCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconWherigo, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.photogenicCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconWebcam, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.gpsMazeCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconMaze, "28px"));
          }
          
          var rowNode = document.createElement("tr");
          insideNode.append(rowNode);
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.socialCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconSocial, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.megaSocialCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconMega, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.gigaSocialCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconGiga, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.environmentalCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconEnvironmental, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.eventHost.calendar.has(md)) {
            boxNode.append(html_icon_image(iconEventHost, "28px"));
          }
          
          var rowNode = document.createElement("tr");
          insideNode.append(rowNode);
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.microCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconMicro, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.smallCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconSmall, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.regularCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconRegular, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.largeCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconLarge, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.oddSizedCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconOddSized, "28px"));
          }
          
          var rowNode = document.createElement("tr");
          insideNode.append(rowNode);
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.achiever.calendar.has(md)) {
            boxNode.append(html_icon_image(iconAchiever, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.ftfAddict.calendar.has(md)) {
            boxNode.append(html_icon_image(iconFtf, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.adventurousCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconAdventurous, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.brainiac.calendar.has(md)) {
            boxNode.append(html_icon_image(iconBrainiac, "28px"));
          }
          
          boxNode = document.createElement("td");
          rowNode.append(boxNode);
          if (!results.ruggedCacher.calendar.has(md)) {
            boxNode.append(html_icon_image(iconRugged, "28px"));
          }
          
        }
      }
    }
  }
}

function html_attribute_gallery(node, attributeSet) {
  divNode = document.createElement("div");
  node.append(divNode);
  divNode.style.display = "flex";
  divNode.style.width = "60%";
  divNode.style.flexWrap = "wrap";
  divNode.style.alignContent = "flex-start";
  
  for (let ix = 1; ix < 73; ix += 1) {
    for (let a of [ix, -ix]) {
      if (attributeSet.has(a)) {
        var imgNode = html_icon_image(attributeIcons.get(a));
        imgNode.style.margin = "5px";
        divNode.append(imgNode);
      }
    }
  }
}

function html_add_leapday_attributes(sectionNode, haveAttributes) {
  var needAttributes = new Set(knownAttributes);
  
  for (var a of haveAttributes) {
    needAttributes.delete(a);
  }
  
  needAttributes.delete(ATTRIBUTE_CACTUS);
  needAttributes.delete(ATTRIBUTE_LOST_AND_FOUND);
  needAttributes.delete(ATTRIBUTE_NEEDS_MAINTENANCE);
  needAttributes.delete(ATTRIBUTE_PARTNERSHIP);
  
  haveAttributes.delete(ATTRIBUTE_CACTUS);
  haveAttributes.delete(ATTRIBUTE_LOST_AND_FOUND);
  haveAttributes.delete(ATTRIBUTE_NEEDS_MAINTENANCE);
  haveAttributes.delete(ATTRIBUTE_PARTNERSHIP);
  
  var pNode = document.createElement("p");
  sectionNode.append(pNode);
  pNode.append("For the ");
  var bNode = document.createElement("b");
  pNode.append(bNode);
  bNode.append("Leapday");
  pNode.append(" addon...");
  
  var ulNode = document.createElement("ul");
  sectionNode.append(ulNode);
  var liNode = document.createElement("li");
  ulNode.append(liNode);
  liNode.append("You have:");
  liNode.append(document.createElement("br"));
  html_attribute_gallery(liNode, haveAttributes);
  
  liNode = document.createElement("li");
  ulNode.append(liNode);
  liNode.append("You need:");
  liNode.append(document.createElement("br"))
  html_attribute_gallery(liNode, needAttributes);  
}

class Geocache {
  constructor(tree, wptNode, profileName, ftfList) {
    this.foundDates = [];
    this.isFtf = false;
    this.attributes = new Set();
    this.hostedEvent = false;
    
    this.set_gccode(tree, wptNode);
    this.set_name(tree, wptNode);
    this.set_type(tree, wptNode, profileName);
    this.set_size(tree, wptNode);
    this.set_dt(tree, wptNode);
    this.set_attributes(tree, wptNode);
    this.set_dates_found(tree, wptNode);
    this.set_date_hidden(tree, wptNode);
    this.set_ftf_status(tree, wptNode, ftfList);
    this.set_country(tree, wptNode);
  }
  
  set_gccode(tree, wptNode) {
    var codeResult = tree.evaluate("TN:name", wptNode, namespace_lookup,
                                   XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                     
    if (codeResult.singleNodeValue === null) {
      throw new Error("A Geocache doesn't have a GC code");
    }
    
    this.gcCode = codeResult.singleNodeValue.textContent;
  }
  
  set_name(tree, wptNode) {
    var nameResult = tree.evaluate("GN:cache/GN:name", wptNode, namespace_lookup,
                                   XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                   
    if (nameResult.singleNodeValue === null) {
      throw new Error("A Geocache doesn't have a name");
    }
    
    this.name = nameResult.singleNodeValue.textContent;
  }
  
  set_type(tree, wptNode, profileName) {
    var results = tree.evaluate("GN:cache/GN:type", wptNode, namespace_lookup,
                                XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                
    if (results.singleNodeValue === null) {
      throw new Error("A Geocache doesn't have a type");
    }
    
    this.type = results.singleNodeValue.textContent;
    if ( ! knownTypes.has(this.type)) {
      throw new Error("A Geocache has an unrecognized type: " + this.type);
    }
    
    if (eventTypes.has(this.type)) {
      var ownerResults = tree.evaluate("GN:cache/GN:owner", wptNode, namespace_lookup,
                                       XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                    
      if (ownerResults.singleNodeValue === null) {
        throw new Error("A Geocache doesn't have an owner");
      }
      
      
      if (ownerResults.singleNodeValue.textContent === profileName) {
        this.hostedEvent = true;
      }
    }
  }
  
  set_size(tree, wptNode) {
    var sizeResults = tree.evaluate("GN:cache/GN:container", wptNode, namespace_lookup,
                                    XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                    
    if (sizeResults.singleNodeValue === null) {
      throw new Error("A Geocache doesn't have a size.");
    }
    
    this.size = sizeResults.singleNodeValue.textContent;
    if ( ! knownSizes.has(this.size)) {
      throw new Error("A Geocache has an unrecognized size: " + this.size);
    }
  }
  
  set_dt(tree, wptNode) {
    var results = tree.evaluate("GN:cache/GN:difficulty", wptNode, namespace_lookup,
                                XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                
    if (results.singleNodeValue === null) {
      throw new Error("A Geocache has no difficulty");
    }
    
    this.difficulty = results.singleNodeValue.textContent;
    if (!knownDts.has(this.difficulty)) {
      throw new Error("A Geocache has an unrecognized difficulty: " + this.difficulty);
    }
    
    var tResults = tree.evaluate("GN:cache/GN:terrain", wptNode, namespace_lookup,
                                 XPathResult.ANY_UNORDERED_NODE_TYPE, null);

    if (tResults.singleNodeValue === null) {
      throw new Error("A Geocache has no terrain");
    }
    
    this.terrain = tResults.singleNodeValue.textContent;
    if (!knownDts.has(this.terrain)) {
      throw new Error("A Geocache has an unrecognized terrain: " + this.terrain);
    }
  }
  
  set_attributes(tree, wptNode) {
    var results = tree.evaluate("GN:cache/GN:attributes/GN:attribute", wptNode, namespace_lookup,
                                XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
                                
    var node = null;
    
    while (node = results.iterateNext()) {
      var attribute = parseInt(node.getAttribute("id"));
      
      if ("0" == node.getAttribute("inc")) {
        attribute *= -1;
      }
      
      if (!knownAttributes.has(attribute)) {
        throw new Error("A Geocache has an unrecognized attribute: " + attribute + " - " + node.textContent);
      }
      
      this.attributes.add(attribute);
    }
  } 
  
  set_dates_found_from_logs(tree, foundResults) {
    var node = null;
    
    while (node = foundResults.iterateNext()) {
      var typeResults = tree.evaluate("GN:type", node, namespace_lookup,
                                      XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                      
      if ((typeResults.sigleNodeValue !== null) && 
          ( (typeResults.singleNodeValue.textContent === 'Found it') ||
            (typeResults.singleNodeValue.textContent === 'Attended') ||
            (typeResults.singleNodeValue.textContent === 'Webcam Photo Taken'))) {
              
      
        var dateResults = tree.evaluate("GN:date", node, namespace_lookup,
                                        XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                        
        if (dateResults.singleNodeValue === null) {
          throw new Error("A Geocache does not have a found date");
        }
        
        var foundDate = new Date(dateResults.singleNodeValue.textContent);
        
        var lid = node.getAttribute("id");
        if (lid === null) {
          throw new Error("A Geocache does not have a log id");
        }
        
        this.foundDates.push([foundDate.getFullYear(), foundDate.getMonth() + 1, foundDate.getDate(), parseInt(lid)]); 

      }
    }
    
  }
    
  set_dates_found(tree, wptNode) {
    var results = tree.evaluate("GN:cache/GN:logs/GN:log", wptNode, namespace_lookup,
                                XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
                                                    
    this.set_dates_found_from_logs(tree, results);
    
    if (this.foundDates.length === 0) {
      throw new Error("A Geocache has no found logs");
    }    
  }
  
  set_date_hidden(tree, wptNode) {
    var dateResult = tree.evaluate("TN:time", wptNode, namespace_lookup,
                                   XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                   
    if (dateResult.singleNodeValue === null) {
      throw new Error("A Geocache doesn't have a hidden date");
    }
    
    this.hiddenYear = parseInt(dateResult.singleNodeValue.textContent.substr(0,4))
  }
  
  set_ftf_status_from_logs(tree, results) {
    var node = null;
    
    while (node = results.iterateNext()) {
      var typeResults = tree.evaluate("GN:type", node, namespace_lookup,
                                      XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                      
      if ((typeResults.sigleNodeValue !== null) && 
          ( (typeResults.singleNodeValue.textContent === 'Found it') ||
            (typeResults.singleNodeValue.textContent === 'Attended') ||
            (typeResults.singleNodeValue.textContent === 'Webcam Photo Taken'))) {
              
        if (node.textContent.includes("{*FTF*}") || node.textContent.includes("{FTF}") ||
            node.textContent.includes("[FTF]")) {
          this.isFtf = true;   
        }
      }
    }
  }
  
  set_ftf_status(tree, wptNode, ftfList) {
    var results = tree.evaluate("GN:cache/GN:logs/GN:log", wptNode, namespace_lookup,
                                XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
                                  
    this.set_ftf_status_from_logs(tree, results);
    
    if (ftfList.has(this.gcCode)) {
      this.isFtf = true;
    }
  }
  
  set_country(tree, wptNode) {
    var result = tree.evaluate("GN:cache/GN:country", wptNode, namespace_lookup,
                               XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                               
    if (result.singleNodeValue === null) {
      throw new Error("A Geocache doesn't have a country");
    }
    
    this.country = result.singleNodeValue.textContent;
    if (!flagsUnicode.has(this.country)) {
      throw new Error("A Geocache has an unrecognized country: " + this.country);
    }
    
    // Project-GC does not include the following in country statistics.
    if (this.type === "Locationless (Reverse) Cache" || countryExcludedCaches.has(this.gcCode)) {
      this.country = null;
    }
  }
  
  is_challenge() {
    return this.attributes.has(ATTRIBUTE_CHALLENGE);
  }
  
  is_old_virtual() {
    return (this.type === "Virtual Cache" && this.hiddenYear <= 2005);
  }
  
  is_boat() {
    return this.attributes.has(ATTRIBUTE_BOAT);
  }
  
  is_climb() {
    return this.attributes.has(ATTRIBUTE_CLIMB);
  }
  
  is_field_puzzle() {
    return this.attributes.has(ATTRIBUTE_FIELD_PUZZLE);
  }
  
  has_leapday_find() {
    for (const foundDate of this.foundDates.values()) {
      if (foundDate[1] === 2 && foundDate[2] == 29) {
        return true;
      }
    }
    
    return false;
  }
}



class GenericResults {
  constructor() {
    this.calendar = new Set();
    this.dtGrid = new Map();
    this.ftf = false;
  }
  
  update(cache, calForFtf = false) {
    if (cache.isFtf) {
      this.ftf = true;
    }
    
    var firstFind = log_date_array_min(cache.foundDates);
    
    if (calForFtf) {
      this.calendar.add(firstFind[1] * 100 + firstFind[2]);
    }
    else {
      for (var d of cache.foundDates) {
        this.calendar.add(d[1]*100 + d[2])
      }
    }
    
    var dt = parseFloat(cache.difficulty)*1000 + parseFloat(cache.terrain)*10;
    
    if ((!this.dtGrid.has(dt)) || (log_date_comparator(firstFind, this.dtGrid.get(dt)[0]) < 0)) {
      this.dtGrid.set(dt, [firstFind, cache.gcCode, cache.name, cache.type]);
    }
  }
  
  create_html(sectionNode, icon, combineCalendar, includeDt, include366, includeLeapday, includeFtf) {
    
    if (includeDt) {
      html_add_dt_info(sectionNode, icon, this.dtGrid);
    }
    
    if (include366) {
      if (combineCalendar) {
        sectionNode.append(html_see_combined());
      }
      else {
        html_add_basic_calendar(sectionNode, icon, this.calendar);
      }
    }
    
    if (includeLeapday) {
      sectionNode.append(html_single_find_addon(this.calendar.has(229), "Leapday"));
    }
    
    if (includeFtf) {
      sectionNode.append(html_single_find_addon(this.ftf, "FTF"));
    }    
  }
}

class AdventurousCacherResults extends GenericResults {
  constructor() {
    super();
    this.boats = 0;
    this.fieldPuzzles = 0;
    this.climbs = 0;
  }
  
  update(cache) {
    super.update(cache);
    
    if (cache.is_boat()) {
      this.boats += 1;
    }
    
    if (cache.is_field_puzzle()) {
      this.fieldPuzzles += 1;
    }
    
    if (cache.is_climb()) {
      this.climbs += 1;
    }
  }
  
  create_html(sectionNode, combineCalendar) {
    super.create_html(sectionNode, iconAdventurous, combineCalendar, false, true, true, true);
    
    sectionNode.append(html_multi_find_addon(this.boats, 30, "Boat"));
    sectionNode.append(html_multi_find_addon(this.fieldPuzzles, 30, "Field puzzle"));
    sectionNode.append(html_multi_find_addon(this.climbs, 30, "Climb"));
  }
}

class AttributeCacherResults {
  constructor() {
    this.lostAndFound = false;
    this.partnership = false;
    this.leapdayAttributes = new Set();
  }
  
  update(cache) {
    if (cache.attributes.has(ATTRIBUTE_LOST_AND_FOUND)) {
      this.lostAndFound = true;
    }
    
    if (cache.attributes.has(ATTRIBUTE_PARTNERSHIP)) {
      this.partnership = true;
    }
    
    if (cache.has_leapday_find()) {
      for (var a of cache.attributes) {
        this.leapdayAttributes.add(a);
      }
    }
  }
  
  create_html(sectionNode) {
    html_add_leapday_attributes(sectionNode, this.leapdayAttributes);
    
    sectionNode.append(html_single_find_addon(this.lostAndFound, "L&F"));
    sectionNode.append(html_single_find_addon(this.partnership, "Partnership"));
  }
}

class BrainiacResults extends GenericResults {
  constructor() {
    super()
    this.fieldPuzzles = 0;
  }
  
  update(cache) {
    super.update(cache);
    
    if (cache.is_field_puzzle()) {
      this.fieldPuzzles += 1;
    }
  }
  
  create_html(sectionNode, combineCalendar) {
    super.create_html(sectionNode, iconBrainiac, combineCalendar, false, true, true, true);
    
    sectionNode.append(html_multi_find_addon(this.fieldPuzzles, 100, "Field puzzle"));
  }
}

class BusyCacherResults {
  constructor() {
    this.leapdayCounts = new Map();
  }
  
  update(cache) {
    for (var d of cache.foundDates) {
      if ((d[1] == 2) && (d[2] == 29)) {
        if (this.leapdayCounts.has(d[0])) {
          this.leapdayCounts.set(d[0], this.leapdayCounts.get(d[0])+1);
        }
        else {
          this.leapdayCounts.set(d[0], 1);
        }
      }        
    }
  }
  
  create_html(sectionNode) {
    var maxCount = 0;
    
    for (var count of this.leapdayCounts.values()) {
      maxCount = Math.max(maxCount, count);
    }
    
    sectionNode.append(html_multi_find_addon(maxCount, 400, "Leapday"));
  }
}

class DiverseCacherResults {
  constructor() {
    this.leapdayTypes = new Map();
  }
  
  update(cache) {
    for (var d of cache.foundDates) {
      if ((d[1] == 2) && (d[2] == 29)) {
        if (this.leapdayTypes.has(d[0])) {
          this.leapdayTypes.get(d[0]).add(cache.type);
        }
        else {
          this.leapdayTypes.set(d[0], new Set([cache.type]));
        }
      }
    }
  }
  
  create_html(sectionNode) {
    var maxCount = 0;
    
    for (var s of this.leapdayTypes.values()) {
      maxCount = Math.max(maxCount, s.size);
    }
    
    sectionNode.append(html_multi_find_addon(maxCount, 11, "Leapday"));
  }
}

class EventHostResults extends GenericResults {
  constructor() {
    super();
    this.mega = false;
    this.giga = false;
    this.cito = false;
    this.community = false;
    this.lostAndFound = false;
  }
  
  update(cache) {
    super.update(cache);
    
    if ("Mega-Event Cache" === cache.type) {
      this.mega = true;
    }
    else if ("Giga-Event Cache" === cache.type) {
      this.giga = true;
    }
    else if ("Cache In Trash Out Event" === cache.type) {
      this.cito = true;
    }
    else if ("Community Celebration Event" === cache.type) {
      this.community = true;
    }
    
    if (cache.attributes.has(ATTRIBUTE_LOST_AND_FOUND)) {
      this.lostAndFound = true;
    }
  }
  
  create_html(sectionNode, combineCalendar) {
    super.create_html(sectionNode, iconEventHost, combineCalendar, false, true, true, false);
    
    sectionNode.append(html_single_find_addon(this.mega, "Mega"));
    sectionNode.append(html_single_find_addon(this.giga, "Giga"));
    sectionNode.append(html_single_find_addon(this.cito, "CITO"));
    sectionNode.append(html_single_find_addon(this.community, "Coummunity Celebration"));
    sectionNode.append(html_single_find_addon(this.lostAndFound, "L&F"));
  }
}

class GeocacherResults {
  constructor() {
    this.community = false;
    this.ape = false;
    this.hq = false;
    this.hq_celebration = false;
    this.blockparty = false;
    this.locationless = false;
  }
  
  update(cache) {
    if ("Community Celebration Event" === cache.type) {
      this.community = true;
    }
    else if ("Project APE Cache" === cache.type) {
      this.ape = true;
    }
    else if ("Groundspeak HQ" === cache.type) {
      this.hq = true;
    }
    else if ("Geocaching HQ Celebration" === cache.type) {
      this.hq_celebration = true;
    }
    else if ("Geocaching HQ Block Party" === cache.type) {
      this.blockparty = true;
    }
    else if ("Locationless (Reverse) Cache" === cache.type) {
      this.locationless = true;
    }
  }
  
  create_html(sectionNode) {
    sectionNode.append(html_single_find_addon(this.ape, "Ape"));
    sectionNode.append(html_single_find_addon(this.hq, "HQ"));
    sectionNode.append(html_single_find_addon(this.hq_celebration, "HQ Celebration"));
    sectionNode.append(html_single_find_addon(this.blockparty, "Blockparty"));
    sectionNode.append(html_single_find_addon(this.locationless, "Locationless"));
  }
}

class RuggedCacherResults extends GenericResults {
  constructor() {
    super();
    this.boats = 0;
    this.climbs = 0;
  }
  
  update(cache) {
    super.update(cache);
    
    if (cache.is_boat()) {
      this.boats += 1;
    }
    
    if (cache.is_climb()) {
      this.climbs += 1;
    }
  }
  
  create_html(sectionNode, combineCalendar) {
    super.create_html(sectionNode, iconRugged, combineCalendar, false, true, true, true);
    
    sectionNode.append(html_multi_find_addon(this.boats, 150, "Boat"));
    sectionNode.append(html_multi_find_addon(this.climbs, 150, "Climbing Gear"));
  }
}

class TravelingCacherResults {
  constructor() {
    this.dtGrid = new Map();
    this.calendar = new Map();
    this.ftf = false;
  }
  
  update(cache) {
    var dt = parseFloat(cache.difficulty)*1000 + parseFloat(cache.terrain)*10;
    if (!this.dtGrid.has(dt)) {
      this.dtGrid.set(dt, cache.country);
    }
    else if (this.dtGrid.get(dt) !== cache.country) {
      this.dtGrid.set(dt, true);
    }
    
    if (cache.isFtf) {
      if (this.ftf === false) {
        this.ftf = cache.country;
      }
      else if (this.ftf !== cache.country) {
        this.ftf = true;
      }
    }
    
    for (var d of cache.foundDates) {
      var md = d[1]*100 + d[2];
      
      if (!this.calendar.has(md)) {
        this.calendar.set(md, cache.country);
      }
      else if (this.calendar.get(md) !== cache.country) {
        this.calendar.set(md, true);
      }
    }
  }
  
  create_html(sectionNode) {
    html_traveling_grid(sectionNode, this.dtGrid);
    html_traveling_calendar(sectionNode, this.calendar);
    
    var leapday = false;
    if (this.calendar.has(229)) {
      leapday = this.calendar.get(229);
    }
    
    html_traveling_single(sectionNode, leapday, "Leapday");
    html_traveling_single(sectionNode, this.ftf, "FTF");
  }
}

class VirtualCacherResults extends GenericResults {
  constructor() {
    super();
    this.oldCaches = 0;
  }
  
  update(cache) {
    super.update(cache);
    
    if (cache.is_old_virtual()) {
      this.oldCaches += 1;
    }
  }
  
  create_html(sectionNode, combineCalendar) {
    super.create_html(sectionNode, iconVirtual, combineCalendar, true, true, true, true);
    
    sectionNode.append(html_multi_find_addon(this.oldCaches, 180, "Old-virtual"));
  }
}

class ResultAggregator {
  constructor() {
    this.countries = new Map();
    this.achiever = new GenericResults();
    this.adventurousCacher = new AdventurousCacherResults();
    this.attributeCacher = new AttributeCacherResults();
    this.brainiac = new BrainiacResults();
    this.busyCacher = new BusyCacherResults();
    this.diverseCacher = new DiverseCacherResults();
    this.earthCacher = new GenericResults();
    this.environmentalCacher = new GenericResults();
    this.eventHost = new EventHostResults();
    this.ftfAddict = new GenericResults();
    this.geocacher = new GeocacherResults();
    this.gigaSocialCacher = new GenericResults();
    this.gpsMazeCacher = new GenericResults();
    this.largeCacher = new GenericResults();
    this.letterboxer = new GenericResults();
    this.matrixCacher = new GenericResults();
    this.megaSocialCacher = new GenericResults();
    this.microCacher = new GenericResults();
    this.multiCacher = new GenericResults();
    this.mysteriousCacher = new GenericResults();
    this.oddSizedCacher = new GenericResults();
    this.photogenicCacher = new GenericResults();
    this.regularCacher = new GenericResults();
    this.ruggedCacher = new RuggedCacherResults();
    this.smallCacher = new GenericResults();
    this.socialCacher = new GenericResults();
    this.traditionalCacher = new GenericResults();
    this.travelingCacher = new TravelingCacherResults();
    this.virtualCacher = new VirtualCacherResults();
    this.wherigoCacher = new GenericResults();
  }
  
  update(cache) {
    if (cache.country !== null) {
      if (!this.countries.has(cache.country)) {
        this.countries.set(cache.country, new GenericResults());
      }
      
      this.countries.get(cache.country).update(cache);
    }
    
    if (cache.is_challenge()) {
      this.achiever.update(cache);
    }
    
    if (("5.0" === cache.difficulty) && ("5.0" === cache.terrain)) {
      this.adventurousCacher.update(cache);
    }
    
    this.attributeCacher.update(cache);
    
    if ("5.0" === cache.difficulty) {
      this.brainiac.update(cache);
    }
    
    this.busyCacher.update(cache);
    this.diverseCacher.update(cache);
    
    if ("Earthcache" === cache.type) {
      this.earthCacher.update(cache);
    }
    
    if ("Cache In Trash Out Event" === cache.type) {
      this.environmentalCacher.update(cache);
    }
    
    if (cache.hostedEvent) {
      this.eventHost.update(cache);
    }
    
    if (cache.isFtf) {
      this.ftfAddict.update(cache, true);
    }
    
    this.geocacher.update(cache);
    
    if ("Giga-Event Cache" === cache.type) {
      this.gigaSocialCacher.update(cache);
    }
    
    if ("GPS Adventures Exhibit" === cache.type) {
      this.gpsMazeCacher.update(cache);
    }
    
    if ("Large" === cache.size) {
      this.largeCacher.update(cache);
    }
    
    if ("Letterbox Hybrid" === cache.type) {
      this.letterboxer.update(cache);
    }
    
    if (cache.has_leapday_find()) {
      this.matrixCacher.update(cache);
    }
    
    if ("Mega-Event Cache" === cache.type) {
      this.megaSocialCacher.update(cache);
    }
    
    if ("Micro" === cache.size) {
      this.microCacher.update(cache);
    }
    
    if ("Multi-cache" === cache.type) {
      this.multiCacher.update(cache);
    }
    
    if ("Unknown Cache" === cache.type) {
      this.mysteriousCacher.update(cache);
    }
    
    if (("Other" === cache.size) || ("Not chosen" === cache.size)) {
      this.oddSizedCacher.update(cache);
    }
    
    if ("Webcam Cache" === cache.type) {
      this.photogenicCacher.update(cache);
    }
    
    if ("Regular" === cache.size) {
      this.regularCacher.update(cache);
    }
    
    if ("5.0" === cache.terrain) {
      this.ruggedCacher.update(cache);
    }
    
    if ("Small" === cache.size) {
      this.smallCacher.update(cache);
    }
    
    if (("Event Cache" === cache.type) || ("Community Celebration Event" === cache.type)) {
      this.socialCacher.update(cache);
    }
    
    if ("Traditional Cache" === cache.type) {
      this.traditionalCacher.update(cache);
    }
    
    if (cache.country !== null) {
      this.travelingCacher.update(cache);
    }
    
    if ("Virtual Cache" === cache.type) {
      this.virtualCacher.update(cache);
    }
    
    if ("Wherigo Cache" === cache.type) {
      this.wherigoCacher.update(cache);
    }
  }
  
  create_html(combineCalendar, errors) {
    var bodyNode = document.createElement("div");
    
    if (errors.size !== 0) {
      bodyNode.append(document.createElement("hr"));
      bodyNode.append(html_error_details(errors));
    }
    
    if (combineCalendar) {
      html_make_combined_calendar(bodyNode, this);
    }
    
    var achieverNode = html_badge_section(bodyNode, "The Achiever");
    this.achiever.create_html(achieverNode, iconAchiever, combineCalendar, true, true, true, true);
    
    var adventurourNode = html_badge_section(bodyNode, "The Adventurous Cacher");
    this.adventurousCacher.create_html(adventurourNode, combineCalendar);
    
    var attributeNode = html_badge_section(bodyNode, "The Attribute Cacher");
    this.attributeCacher.create_html(attributeNode);
    
    var brainiacNode = html_badge_section(bodyNode, "The Brainiac");
    this.brainiac.create_html(brainiacNode, combineCalendar);
    
    var busyNode = html_badge_section(bodyNode, "The Busy Cacher");
    this.busyCacher.create_html(busyNode);
    
    var diverseNode = html_badge_section(bodyNode, "The Diverse Cacher");
    this.diverseCacher.create_html(diverseNode);
    
    var earthNode = html_badge_section(bodyNode, "The Earth Cacher");
    this.earthCacher.create_html(earthNode, iconEarth, combineCalendar, true, true, true, true);
    
    var environmentalNode = html_badge_section(bodyNode, "The Environmental Cacher");
    this.environmentalCacher.create_html(environmentalNode, iconEnvironmental, combineCalendar,
                                         false, true, true, false);
                                         
    var eventHostNode = html_badge_section(bodyNode, "The Event Host");
    this.eventHost.create_html(eventHostNode, combineCalendar);
    
    var ftfAddictNode = html_badge_section(bodyNode, "The FTF Addict");
    this.ftfAddict.create_html(ftfAddictNode, iconFtf, combineCalendar, true, true, true, false);
    
    var geocacherNode = html_badge_section(bodyNode, "The Geocacher");
    this.geocacher.create_html(geocacherNode);
    
    var gigaSocialNode = html_badge_section(bodyNode, "The Giga Social Cacher");
    this.gigaSocialCacher.create_html(gigaSocialNode, iconGiga, combineCalendar, false, true, true, false);
    
    var gpsMazeNode = html_badge_section(bodyNode, "The GPS Maze Cacher");
    this.gpsMazeCacher.create_html(gpsMazeNode, iconMaze, combineCalendar, false, true, true, false);
    
    var largeNode = html_badge_section(bodyNode, "The Large Cacher");
    this.largeCacher.create_html(largeNode, iconLarge, combineCalendar, true, true, true, true);
    
    var letterboxerNode = html_badge_section(bodyNode, "The Letterboxer");
    this.letterboxer.create_html(letterboxerNode, iconLetterbox, combineCalendar, true, true, true, true);
    
    var matrixNode = html_badge_section(bodyNode, "The Matrix Cacher");
    this.matrixCacher.create_html(matrixNode, iconMatrix, combineCalendar, true, false, false, false);
    
    var megaSocialNode = html_badge_section(bodyNode, "The Mega Social Cacher");
    this.megaSocialCacher.create_html(megaSocialNode, iconMega, combineCalendar, false, true, true, false);
    
    var microNode = html_badge_section(bodyNode, "The Micro Cacher");
    this.microCacher.create_html(microNode, iconMicro, combineCalendar, true, true, true, true);
    
    var multiNode = html_badge_section(bodyNode, "The Multi Cacher");
    this.multiCacher.create_html(multiNode, iconMulti, combineCalendar, true, true, true, true);
    
    var mysteriousNode = html_badge_section(bodyNode, "The Mysterious Cacher");
    this.mysteriousCacher.create_html(mysteriousNode, iconMysterious, combineCalendar, true, true, true, true);
    
    var oddSizedNode = html_badge_section(bodyNode, "The Odd-sized Cacher");
    this.oddSizedCacher.create_html(oddSizedNode, iconOddSized, combineCalendar, true, true, true, true);
    
    var photogenicNode = html_badge_section(bodyNode, "The Photogenic Cacher");
    this.photogenicCacher.create_html(photogenicNode, iconWebcam, combineCalendar, false, true, true, true);
    
    var regularNode = html_badge_section(bodyNode, "The Regular Cacher");
    this.regularCacher.create_html(regularNode, iconRegular, combineCalendar, true, true, true, true);
    
    var ruggedNode = html_badge_section(bodyNode, "The Rugged Cacher");
    this.ruggedCacher.create_html(ruggedNode, combineCalendar);
    
    var smallNode = html_badge_section(bodyNode, "The Small Cacher");
    this.smallCacher.create_html(smallNode, iconSmall, combineCalendar, true, true, true, true);
    
    var socialNode = html_badge_section(bodyNode, "The Social Cacher");
    this.socialCacher.create_html(socialNode, iconSocial, combineCalendar, false, true, true, false);
    
    var traditionalNode = html_badge_section(bodyNode, "The Traditional Cacher");
    this.traditionalCacher.create_html(traditionalNode, iconTraditional, combineCalendar, 
                                       true, true, true, true);
                                       
    var travelingNode = html_badge_section(bodyNode, "The Traveling Cacher");
    this.travelingCacher.create_html(travelingNode);
    
    var virtualNode = html_badge_section(bodyNode, "The Virtual Cacher");
    this.virtualCacher.create_html(virtualNode, combineCalendar);
    
    var wherigoNode = html_badge_section(bodyNode, "The Wherigo Cacher");
    this.wherigoCacher.create_html(wherigoNode, iconWherigo, combineCalendar, true, true, true, true);
    
    var countryList = new Array();
    for (let country of this.countries.keys()) {
      countryList.push(country);
    }
    countryList.sort();
    
    for (var country of countryList) {
      var countryNode = html_badge_section(bodyNode, country, true);
      this.countries.get(country).create_html(countryNode, [country, flagsUnicode.get(country)],
                                              false, true, true, true, true); 
    }
    
    return bodyNode;
  }
}

class GpxParser {
  constructor(fileText) {    
    var parser = new DOMParser();
    this.tree = parser.parseFromString(fileText, "text/xml");
    
    var nodeResults = this.tree.evaluate("/TN:gpx/TN:name", this.tree, namespace_lookup,
                                         XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                       
    if ((nodeResults.singleNodeValue === null) ||
         (nodeResults.singleNodeValue.textContent !== "My Finds Pocket Query")) {
      throw new Error('File is not a "My Finds" GPX file');
    }
    
    var finderResults = this.tree.evaluate("/TN:gpx/TN:wpt/GN:cache/GN:logs/GN:log/GN:finder", this.tree,
                                           namespace_lookup, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                       
    if (finderResults.singleNodeValue === null) {
      throw new Error('Not able to find any logs in GPX file');
    }
    
    this.profileName = finderResults.singleNodeValue.textContent;
    
    this.ftfList = new Set();
    this.cacheParseErrors = new Set();
  }
  
  setup_ftf_bookmark_list(ftfText) {
    try {
      var parser = new DOMParser();
      var ftfTree = parser.parseFromString(ftfText, "text/xml");
      
      
      var wptResults = ftfTree.evaluate("/TN:gpx/TN:wpt", ftfTree, namespace_lookup,
                                        XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
                                        
      var node = null;

      while (node = wptResults.iterateNext()) {
        var symResults = ftfTree.evaluate("TN:sym", node, namespace_lookup,
                                          XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                          
        if ((symResults.singleNodeValue === null) || (symResults.singleNodeValue.textContent !== "Geocache")) {
          continue;
        }
        
        var nameResults = ftfTree.evaluate("TN:name", node, namespace_lookup,
                                           XPathResult.ANY_UNORDERED_NODE_TYPE, null);
                                           
        if (nameResults.singleNodeValue !== null) {
        
          this.ftfList.add(nameResults.singleNodeValue.textContent);
          
        }
      }
      
      
    } catch (err) {
      this.cacheParseErrors.add("Error parsing FTF list: " + err + ".")
    }
  }
  
  parse_all_caches(results) {
    var nodeResults = this.tree.evaluate("/TN:gpx/TN:wpt", this.tree, namespace_lookup,
                                         XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
                                         
    var wptNode = null;
    
    while (wptNode = nodeResults.iterateNext()) {
      try {
        var cache = new Geocache(this.tree, wptNode, this.profileName, this.ftfList);
        
        
        results.update(cache);
      }
      catch (err) {
        if (this.cacheParseErrors.size < 20) {
          this.cacheParseErrors.add("Cache parse error: " + err + ".")
        }
      }
    }
  }
}

function get_file_text(file) {
  return new Promise((res, rej) => {
    var reader = new FileReader();
    reader.onload = function() {
      res(reader.result);
    };
    reader.readAsText(file);
  })
}


async function compute_page() {
  var combineCheckbox = document.getElementById("combine_calendars");
  var myFindsBrowse = document.getElementById("my_finds");
  var ftfBrowse = document.getElementById("ftf_list");
  
  if (myFindsBrowse.files.length === 0) {
    alert("You must select a \"My Finds\" GPX file.");
    return;
  }
  
  var resultHolder = document.getElementById("result_holder");
  resultHolder.innerHTML = "<br><br><b>Working... Please be patient!</b>";  
  
  //Add zip file processing.
  var myFinds = myFindsBrowse.files[0];
  
  const myFindsText = await get_file_text(myFinds);
  
  try {
    var parser = new GpxParser(myFindsText);
  } catch (e) {
    alert("Fatal parsing error: " + e + ".");
    resultHolder.innerHTML = "";
    return;
  }
  
  if (ftfBrowse.files.length !== 0) {
    var ftfText = await get_file_text(ftfBrowse.files[0]);
    parser.setup_ftf_bookmark_list(ftfText);
  }
  
  var results = new ResultAggregator();
  parser.parse_all_caches(results);
  
  var divNode = results.create_html(combineCheckbox.checked, parser.cacheParseErrors);
  
  resultHolder.innerHTML = "";
  resultHolder.append(divNode);

}