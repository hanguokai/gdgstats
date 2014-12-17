var MAX_CACHE_TIME = 21600; // 6 hours

/**
 * get all countries
 */
function getCountries(){
  var cache = CacheService.getPublicCache();
  var cached = cache.get("country");
  if (cached != null) {
//    Logger.log("got country cache");
    return JSON.parse(cached);
  } else {
    updateGDG();
    return JSON.parse(cache.get("country"));
  }
}

/**
 * get all GDG by country
 */
function getGDGbyCountry(country){
  var cache = CacheService.getPublicCache();
  var cached = cache.get("country-"+country);
  if (cached != null) {
//    Logger.log("got gdgbyCountry cache");
    return JSON.parse(cached);
  } else {
    updateGDG();
    return JSON.parse(cache.get("country-"+country));
  }
}

function testGDGInfo(){
//  CacheService.getPublicCache().remove('country')
  Logger.log(getGDGbyCountry('China').length);
}


// get all GDG info from DevSite and put data in cache
function allGDG(){
  var url = 'https://developers.google.com/groups/directorygroups/';
  var response = UrlFetchApp.fetch(url);
  if(response.getResponseCode() == 200){ // if OK
    var json = JSON.parse(response.getContentText()); // all data
    return json;
  } else {
    return null;
  }  
}

/**
 * build gdg data struct and put it into cache.
 * all countries is an string array.
 * each country has an array of gdg.
 * suggest scheduled every 5 hours to fill cache.
 */
function updateGDG(){
  var json = allGDG();
  if(!json || !json.success)
    return;
  
  // array of GDG
  var allGroups = json.groups;
  var countries = [] //all unique countries
  var hashset = {}; 
  var gdgByCountry = {}; // country -> [gdg, ...]
  var cache = CacheService.getPublicCache();
  
  for(var i = 0; i < allGroups.length; i++) {
    var gdg = allGroups[i];
    var country = gdg.country;
    var gdgList;
    
    if (!hashset[country]) { // filter for unique country
      hashset[country] = true;
      countries.push(country);
    }
    
    if(!gdgByCountry[country]){
      gdgList = [];
      gdgByCountry[country] = gdgList;
    } else {
      gdgList = gdgByCountry[country];
    }
    gdgList.push(gdg);
  } 

  countries.sort();
  cache.put("country", JSON.stringify(countries), MAX_CACHE_TIME);
  
  // sort gdg by country
  for(var i = 0; i < countries.length; i++) {
    var country = countries[i];
    var gdgList = gdgByCountry[country];
    gdgList.sort(function(a, b){
      return a.name.localeCompare(b.name);
    });
    cache.put("country-"+country, JSON.stringify(gdgList), MAX_CACHE_TIME);
  }
}


//China GDG static data for test
var IDs = {
  'Beijing': { name: '北京', id: '114116331730392650768'},
  'Shanghai': { name: '上海', id: '113435072768494915958'},
  'Guangzhou': { name: '广州', id: '114920001331857622210'},
  'Hangzhou': { name: '杭州', id: '107736551552874801480'},
  'Shenzhen': { name: '深圳', id: '116409718883299342983'},
  'Hongkong': { name: '香港', id: '101989816978489369807'},
  'Nanyang': { name: '南阳', id: '114126261414805241249'},
  'Nanjing': { name: '南京', id: '115699391295509082719'},
  'Hefei': { name: '合肥', id: '114665061922064488837'},
  'Lanzhou': { name: '兰州', id: '107219447444236191734'},
  'Xian': { name: '西安', id: '114935565019424673192'},
  'Zhuhai': { name: '珠海', id: '113382777332300419074'},
  'Zhangjiakou': { name: '张家口', id: '114911793225988198469'},
  'Xiamen': { name: '厦门', id: '110967416369300099369'},
  'Urumqi': { name: '乌鲁木齐', id: '113990579362109292040'},
  'Chengdu': { name: '成都', id: '115508453153648032576'},
  'Suzhou': { name: '苏州', id: '100160462017014431473'}
}
