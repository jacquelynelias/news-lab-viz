
var data_url = './data/data.csv' //url of data file

var window_width = $(window).width();
//Calls functions to take data from csv to an object
var processData = function(data) {
    return csvToArray(data)
}


//Processes from the csv to an array of headers and items
var csvToArray = function(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }    
    return arrayToObject(headers, lines)
}

//Processes from this array to an object
var arrayToObject = function(headers, input) {
    var data = {"agencies":[]} 
    for (var item in input) {
        var temp = {}
            for (var m in headers) {
                temp[headers[m]] = input[item][m]
            }
        data.agencies.push(temp)
    }
        

    return data

}

var wCommas = function(str) {
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var toProperCase = function(str) {
  if(str){
    return str.toUpperCase();
    //return str.replace(/\w\S*/g, function(txt) {
      //return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    //});
  } else {
    return "";
  }
 }

 var draw = function(data) {
     var p = 1;
     var length = 15;
     while (p <= 11) {
        var html = ''
        for (var m = ((p-1)*length); (m < length * p && m < data.length); m++) {
            
            var int = parseInt(data[m]['Days_18'])
            console.log(data[m]['Days_18'], " ", int)
            var name = data[m]['entity_16']
            var inner = ''
            for (var i = 1; i <= 30; i++) {
                if (i <= int && int <= 3) {
                    inner = inner + "<div class='box end compliant'></div>"
                } else if (i <= int) {
                    inner = inner + "<div class='box end'></div>"
                } else {
                    inner = inner + "<div class='box'></div>"
                }

            }
            html = html + '<div class="row data-entry"><div class="col-xs-12 col-sm-1 col-lg-1 name"><div>'+name+'</div></div><div class="col-xs-12 col-lg-11 col-sm-11 boxes">'+inner+'</div></div>'

        }
        if (p == 1) {
            $('#viz').append('<div data-page="'+p+'">'+html+'</div>')
        } else {
            $('#viz').append('<div data-page="'+p+'" style="display: none;">'+html+'</div>')
        }    
        p = p + 1
    }
 }

 var paginationHandler = function(){
    // store pagination container so we only select it once
    var paginationContainer = $("#results")
    var pagination = paginationContainer.find('.pagination');
    // click event
    pagination.find("li a").on('click',function(e){
        e.preventDefault();
        // get parent li's data-page attribute and current page
    var parentLiPage = $(this).parent('li').data("page"),
    currentPage = parseInt( $("#results div[data-page]:visible").data('page') ),
    numPages = paginationContainer.find("div[data-page]").length;
    // make sure they aren't clicking the current page
    if ( parseInt(parentLiPage) !== parseInt(currentPage) ) {
    // hide the current page
    paginationContainer.find("div[data-page]:visible").hide();
    if ( parentLiPage === '+' ) {
                // next page
        paginationContainer.find("div[data-page="+( currentPage+1>numPages ? numPages : currentPage+1 )+"]").show();
    } else if ( parentLiPage === '-' ) {
                // previous page
        paginationContainer.find("div[data-page="+( currentPage-1<1 ? 1 : currentPage-1 )+"]").show();
    } else {
        // specific page
        paginationContainer.find("div[data-page="+parseInt(parentLiPage)+"]").show();
            }
        }
    });
}; 

//On load opens csv
$(document).ready(function() {
    $.ajax({
        beforeSend: function() {
            document.body.style.cursor='wait';
        },
        type: "GET",
        url: data_url,
        dataType: "text",
        success: function(stuff) { 
            data = processData(stuff); 
            result = data
            draw(result.agencies, 25)
            document.body.style.cursor='default';
        }
    });
    paginationHandler()
    $('a').click( function(e) {
        e.preventDefault(); /*your_code_here;*/ 
        return false; 
    } );

    /*if(result) {
        draw(result)
    }*/

    $( window ).resize(function() {
        console.log("resize")
          
    });
});
//Adds listener for county select button
