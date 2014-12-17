/**
 * get DevSite's events data between start and end date.
 */
function fetchData(id, startTime, endTime) {
  var url = 'https://developers.google.com/events/feed/json?group=' + id + '&start=' + startTime;
  if(endTime){
    url += '&end=' + endTime;
  }
  
  var response = UrlFetchApp.fetch(url);
  if(response.getResponseCode() == 200){ // if OK
    var json = JSON.parse(response.getContentText()); // all data
    return filterData(json);
  } else {
    return null;
  }
}

// remove the description property to reduce size
function filterData(json){
  for(var i = 0, length = json.length; i < length; i++){
    delete json[i]['description'];
    delete json[i]['location'];
    delete json[i]['iconUrl'];
  }
  return json;
}

function count(json){
  var c = 0;
  json.forEach(function(e){ if(e.participantsCount) c += e.participantsCount;});
  return c;
}

/**
 * get G+ page's count of follows
 */
function circledCount(id){
  var cache = CacheService.getPublicCache();
  var cached = cache.get("circled-"+id);
  if (cached != null) {
    return JSON.parse(cached);
  }  
  
  var gplusApikey = 'AIzaSyBEg3oOgd9Mepy0fBkBrrjTVTfUo16Lq4o' //use your G+ api key
  var url = 'https://www.googleapis.com/plus/v1/people/' + id + '?key=' + gplusApikey + '&fields=circledByCount';

  var response = UrlFetchApp.fetch(url);
  if(response.getResponseCode() == 200){ // if OK
    var json = JSON.parse(response.getContentText()); // process data
    cache.put("circled-"+id, JSON.stringify(json.circledByCount));
    return json.circledByCount;
  } else {
    return 0;
  }
}

function testFollows(){
  var testId = IDs['Beijing'].id;
//  var json = fetchData(testId, '1356998399');
//  Logger.log(count(json));
  
  var gplusFollows = circledCount(testId);
  Logger.log(gplusFollows);
}

