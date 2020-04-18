
/*****************************************
*    EDIT SPREADSHEET IDS HERE
     
     FORMAT SHOULD USE WEEK NUMBER OR CHAPTER TITLE

     { WEEK NUMBER: ID } e.g. { 1: '1ZSFPg8Ys4RsHUP7-fYA56AwxkgabY2sDogOJQj7WhgQ'}
     { CHAPTER TITLE: ID } e.g. { 'Introduction': '1ZSFPg8Ys4RsHUP7-fYA56AwxkgabY2sDogOJQj7WhgQ'}

     OR YOU CAN ADD ONE SPREADSHEET FOR THE WHOLE COURSE

     e.g. var SPREADSHEET_IDS = '1ZSFPg8Ys4RsHUP7-fYA56AwxkgabY2sDogOJQj7WhgQ';

******************************************/
 var SPREADSHEET_IDS = {
    'Introduction to the course': '1ZSFPg8Ys4RsHUP7-fYA56AwxkgabY2sDogOJQj7WhgQ',
    1: '1ZSFPg8Ys4RsHUP7-fYA56AwxkgabY2sDogOJQj7WhgQ',
    2: '1ZSFPg8Ys4RsHUP7-fYA56AwxkgabY2sDogOJQj7WhgQ',
    3: '1ZSFPg8Ys4RsHUP7-fYA56AwxkgabY2sDogOJQj7WhgQ',
}; 


// Name of the sheet the responses are on 
var SPREADSHEET_RANGE = 'Form Responses 1';

// Client ID and API key from the Developer Console
var CLIENT_ID = '';
var API_KEY = '';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

function handleClientLoad() {
gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {

    var spreadsheetId; 

    if (typeof SPREADSHEET_IDS === "string" || SPREADSHEET_IDS instanceof String)
    {
      spreadsheetId = SPREADSHEET_IDS;
    }
    else
    {
      spreadsheetId = getSpreadsheetId(); 
    }

    if (spreadsheetId != null)
    {
        loadChart(spreadsheetId); 
    }

  });
}

// Retrieve week number from the edx page, and check corresponding spreadsheet ID 
function getSpreadsheetId() {

  var array = document.getElementsByClassName("nav-item nav-item-chapter");

  if (array != null && array.length > 0)
  {
    var chapterId = array[0].outerText; 

    // If the week name is of the form "Week 1: Algorithms", just use the number mapping
    if (chapterId.includes("Week"))
    {
      var week = chapterId.split(" ")[1];
      var weekNum = week.split(":")[0];

      console.log("weeknum: " + weekNum); 

      if (SPREADSHEET_IDS[weekNum] != null)
      {
        return SPREADSHEET_IDS[weekNum];
      }
      else
      {
        console.log("No survey found for week " + weekNum);
      }
    }
    else if (SPREADSHEET_IDS[chapterId] != null)
    {
      return SPREADSHEET_IDS[chapterId];
    }
    else
    {
      console.log("No survey found for week " + chapterId);
    }
  }

  return null; 
}


function loadChart(spreadsheetId) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: SPREADSHEET_RANGE,
  }).then(function(response) {

    var range = response.result;

    var wordDictionary = {};

    // Skip column names and start at 1
    if (range.values.length > 1) {

      for (i = 1; i < range.values.length; i++) {
        var row = range.values[i];

        var word = row[1].replace(/[^A-Za-z]+/g, '');
        word = word.toLowerCase(); 

        if (word in wordDictionary)
        {
          var tempCount = wordDictionary[word];
          wordDictionary[word] = tempCount + 1; 
        }
        else
        {
          wordDictionary[word] = 1; 
        }
      }
    }

    var data = []; 

    for (var key in wordDictionary)
    {
      var dataRow = {"x": key, "value": wordDictionary[key]};
      data.push(dataRow); 
    }

    var chart = anychart.tagCloud(data);

     // set a chart title
    chart.title('Survey Responses');

    // set an array of angles at which the words will be laid out
    chart.angles([0]);

    // display the word cloud chart
    chart.container("container");
    chart.draw();

  });
}

