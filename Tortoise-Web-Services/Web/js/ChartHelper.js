/*

  ChartJS helper

*/


var ChartHelper = function()
{
  var chart;
  
  var headers = {  
    'Group': 0,
    'Derived Label': 1,
    'ROI Label': 2,
    'File Path': 3,
    'ROI Value': 4
  };
  
  var init = function(c)
  {  
    chart = c;
    console.log(chart);
  };

  var setChart = function(c)
  {
    init(c);
  };
  
  var removeData = function()
  {
    chart.removeData();
  };

  var addData = function(data)
  {
    chart.addData(data.points, data.label);
  };
  
  var clearData = function(data)
  {
    var pts = chart.datasets[0].bars.length;    
    for(var i = 0; i < pts; i++)
    {
        chart.removeData();       
    }
    console.log('done clearing');
  };
  
  var updateChart = function(data)
  {  
    var ctx = document.getElementById("plot_canvas").getContext("2d");
    chart = null;
    var x = new Chart(ctx).Bar(data, {
			responsive : true
	});
    chart = x;
  }
  
  
  var randomScalingFactor = function(){ return Math.round(Math.random()*255)};
  
  var JsonToBarChartData = function(data)
  {
    // get unique ROI label names
    var lbls = getUniqueValuesInColumn(data, 'ROI Label');
    var dsets = [];
    var tmp;
    var red;
    var blue;
    var green;
    var str='';
    var rows_with_label;
    var rows_wl_and_derived_label;
    var vals_in_row_with_label;
    
    // number of bars
    for(var i = 0; i < lbls.values.length; i++)
    {
        // get all rows with ROI Label [i]
        rows_with_label = getRowsWithColumnValue(data, 'ROI Label', lbls.values[i]);
        // get all rows with ROI Label [i] and Derived Label 'AM'
        rows_wl_and_derived_label = getRowsWithColumnValue(rows_with_label, 'Derived Label', 'SK');
        // get all ROI Value elements with ROI Label [i], Derived Label 'FA' from each row
        vals_in_row_with_label = getColumnByName(rows_wl_and_derived_label, 'ROI Value');
        str   = "rgba(";
        red   = randomScalingFactor();
        green = randomScalingFactor();
        blue  = randomScalingFactor();
        tmp  = {
            fillColor : str+red+","+green+","+blue+",0.5)",
            strokeColor : str + red+","+green+","+blue+",0.8)",
            highlightFill : str+red+","+green+","+blue+",0.75)",
            highlightStroke : str+red+","+green+","+blue+",1)",
            data: vals_in_row_with_label
        };
        dsets.push(tmp);
    }
    return {
        labels : lbls.values,
        datasets : dsets
    };
  };  
  
  function processData(allText) 
  {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                var d = data[j].replace(/["]/g, "");
                tarr.push(/*headers[j]+":"+*/d);
            }
            lines.push(tarr);
        }
    }
    return lines;
  };
  
  var CsvToJson = function(csv)
  {
        var formattedData = processData(csv);
        console.log(formattedData);
        return formattedData;
  };  
  var getColumn = function(csv, index)
  {  
    var col = [];
    for(var i = 0; i < csv.length; /*a.k.a. # of rows*/ i++)
    {
        col.push(csv[i][index]);
    }
    return col;
  };
  var getRow = function(csv, index)
  {  
    var row = [];
                        /*a.k.a. # of cols*/
    for(var i = 0; i < csv[index].length; i++)
    {
        console.log('new row = '+csv[index][i]);
        row.push(csv[index][i]);
    }
    return row;
  };
  var getIndex = function(csv, i, j)
  {  
    return csv[i][j];    
  };  
  var getColumnByName = function(csv, value)
  {
    var out = null;
    out = getColumn(csv, headers[value]);
    return out;
  };
  
  var getRowsWithColumnValue = function(csv, colName, value)
  {
    var out = null;
    var matchingIndices = [];
    var rows = [];
    console.log('csv = ',csv);
    console.log('colname = ',colName);
    console.log('value = ',value);
    out = getColumnByName(csv, colName);
    for(var i = 0; i < out.length; i++)
    {
        console.log('Comparing: ',out[i], '    with    ',value);
        if(String(out[i]) === String(value))
        {
            rows.push(getRow(csv, i));
        }
    }
    return rows;
  };
  
  var getUniqueValuesInColumn = function(csv, colName)
  {
    var u_vals = {   
        values: [],
        frequency: []    
    };    
    var col = getColumnByName(csv,colName);    
    var found = false;    
    for(var i = 0; i < col.length; i++)
    {    
        for(var j = 0; j < u_vals.values.length; j++)
        {
            if(u_vals.values[j] === col[i])
            {
                found = true;
                u_vals.frequency[j]++;
                break;
            }
        }
        if(!found)
        {
            u_vals.values.push(col[i]);
            u_vals.frequency.push(1);
        }
        found = false;
    }
    console.log('these are the unique column values: ');
    console.log(u_vals.values);    
    console.log('this is the frequency each occured: ');
    console.log(u_vals.frequency);
    return u_vals;
  };

  return {
    init: init,
    setChart: setChart,
    updateChart: updateChart,
    addData: addData,
    removeData: removeData,
    clearData: clearData,
    CsvToJson: CsvToJson,
    JsonToBarChartData:JsonToBarChartData,
    getColumn:getColumn,
    getRow:getRow,
    getIndex:getIndex,
    getColumnByName:getColumnByName,
    getRowsWithColumnValue:getRowsWithColumnValue,
    getUniqueValuesInColumn:getUniqueValuesInColumn,
  };
  
};
