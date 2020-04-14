
/*****************************************
*    EDIT SPREADSHEET ID WITH THE ONE    *
*    CORRESPONDING TO THE COURSE         *  
******************************************/
var SPREADSHEET_ID = '1ZSFPg8Ys4RsHUP7-fYA56AwxkgabY2sDogOJQj7WhgQ';

// Name of the sheet the responses are on 
var SPREADSHEET_RANGE = 'Form Responses 1';

// Client ID and API key from the Developer Console
var CLIENT_ID = '1049517253069-dui0mhupd7gp58pp19i3j4gr1us382ah.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCUlMqXpYHBESZWT_XIXPZVy2BuKDnhZ10';

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

  loadChart(); 

});
}

function loadChart() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
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

