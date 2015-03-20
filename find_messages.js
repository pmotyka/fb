var AsciiTable = require('ascii-table')
var FB = require('fb');

var args = process.argv.slice(2);
var limit = args[0];
var searchString = args[1];

//set Facebook user access token
FB.setAccessToken('');

FB.api('/me/feed?limit=' + limit, { fields: ['message', 'created_time', 'actions'] }, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'Error occurred' : res.error);
        return;
    }

    //find the messages that match the search string using the filter function.  If data is null, simply omit that element
    var hits = res.data.filter( function (data) {
        if(!data.message) {
            return false;
        }
        else if( data.message.toLowerCase().indexOf(searchString.toLowerCase()) != -1) {
            return true;
        }
        else {
            return false;
        }
    });

    //craft an ascii text-based table for emitting matched data
    var table = new AsciiTable('Messages that match string "' + searchString + '"')
    table.setHeading('Message', 'Date/Time', 'URL');

    for(var i in hits) {
        var message;
        if(hits[i].message.length > 60) {
            message = hits[i].message.substring(0, 60) + "...";
        }
        else {
            message = hits[i].message;
        }

        table.addRow(message, hits[i].created_time, hits[i].actions[0].link);
    }

    //if no hits, add a single row with 'N/A' values
    if(table.getRows().length == 0) {
        table.addRow(AsciiTable.alignRight('N/A', 10, ' '), AsciiTable.alignRight('N/A', 10, ' '), AsciiTable.alignRight('N/A', 10, ' '));
    }

    console.log(table.toString());
});
