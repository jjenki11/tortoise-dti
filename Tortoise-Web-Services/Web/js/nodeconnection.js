
var nodeConnection = function()
{

  var socket = new io.connect('http://localhost:8444');
  var plugins = null;
  var chartjs = null;
  
  var lastLabelClicked = null;
  
  function setNodeLabel(lbl) {
    lastLabelClicked = lbl;  
  };  
  function getNodeLabel(){
    return lastLabelClicked;
  };
  function send(msgType, data, callback)
  {
    socket.emit(msgType, data, callback);
  };  
    function splitRows(data)
    {
      dataChunk = "";
      dataChunk = data.split("\n");
      return dataChunk;

    };  
    
  function setChartHelper(helper)
  {
    chartjs=helper;
  };
  
  function attachHandler(msgType, handler)
  {
    socket.on(msgType, handler);
  };
  
  function detachHandler(msgType, handler)
  {
    socket.removeListener(msgType, handler);
  };

	socket.on('success', function(data){
		alert(data);
	});
	
	socket.on('test_driver', function(data){
	  console.log('suppington', data.length);
	});

	/*socket.on('response', function (stream) {
		var buffer = '';
		stream.on('data', function (data) {
			buffer += data.toString().replace(/(octave:)[0-9]+>/, '').replace(/(\r\n|\n|\r)/gm,'');
		    });
		stream.on('end', function () { 
			console.log(buffer);
			$('Textarea[id="out"]').append(buffer);
		    });
		    });*/
	
	socket.on('response', function(data){
		var box = $('textarea#out');
		console.log(data.message);
		if(data.message === undefined){} 
		else
		{
		  box.val(box.val() + data.message);
		}
	});	
	
	socket.emit("init", {message:"start"});

	$('#submitConsole').on("click", function(){	
		var console = $('textarea[id="console"]').val();		
		var res = validateInput(console);
		socket.emit('request', {message: res});
	});
	
	$('#enterPass').on("click", function(){
	  socket.emit('passwordEntered', {});
	});

    socket.on('csv_response', function(csv){
        console.log('csv file found: ');
        console.log(csv.data);
        var x = chartjs.CsvToJson(csv.data);
        
        console.log('in nodeconnection, csv reply is = ');
        console.log(x);
        
        console.log(' get just column with a specified name (File Path): ');
        console.log(chartjs.getColumnByName(x, 'ROI Label'));
        
        var roi1 = chartjs.getRowsWithColumnValue(x, 'ROI Label', 'rect_roi_1');
        console.log('rows with ROI Label = rect_roi_1');
        console.log(roi1);
        
        var un = chartjs.getUniqueValuesInColumn(x, 'Derived Label');

        var j2bar = chartjs.JsonToBarChartData(x);
        console.log(j2bar);
        chartjs.updateChart(j2bar);
//        chartjs.addData(j2bar);

    });

	socket.on('plot_data', function(data) {	  
        plugins.updatePlotWindow(data);
	});
	
	socket.on('completed_template_progress', function(data) {
	    console.log('just completed ',data.task, ' and there are ',data.remaining,' remaining.');
	    if((data.remaining == 0) && (data.task == 'Control_Group'))
	    {
	        socket.emit('templates_are_complete',{});
	    }
	});
	
	socket.on('completed_register_progress', function(data) {
	    console.log('just completed ',data.task, ' and there are ',data.remaining,' remaining.');
	    if(data.remaining == 0)
	    {
	        socket.emit('registration_is_complete',{});
	    }
	});
	
	socket.on('progress_update', function(data){
	  var prog = data.bar_id+'_Progress';
	  var txt  = data.bar_id+'_Text';	  
	  $('.'+prog).css('width', data.percent_done+'%').attr('aria-valuenow', data.percent_done);
      $('#'+prog).css('width', data.percent_done+'%').attr('aria-valuenow', data.percent_done);
      $('#'+txt).text(data.percent_done+'% complete');
	  console.log('percent done = ',data.percent_done);
	  console.log('name         = ',data.name);
	  console.log('bar id       = ',data.bar_id);
	/*
	  sock.emit('progress_update', {percent_done: 0, name: 'test'});
	*/
	});
	
	socket.on('file_contents', function(data){
    
        console.log("YOUR FILE CONTENTS ARE....\n");
        console.log(data);
    });
    /*
    socket.on('scene_init', function(data){
        console.log(data.txt);
    });
    */
    socket.on('populate_the_list', function(data){
        var x = getNodeLabel();
        var str ="";
        for(var i=0;i<data.length-1;i++)
        {
            str +=('<li>'+data[i]+'</li>');
        }
        switch(x)
        {
            case 'control' :
                $("#cl").html(str);
                break;            
            case 'atlas'   :
                $("#al").html(str);
                break;            
            case 'patient' :
                $("#pl").html(str);
                break;                
            default   :  console.log("????");       
        }
        
    });
	
	socket.on('image_data', function(data) {
	  plugins.makeImageWindow(data);
	});
	
	socket.on('clear_data', function(data) {
	  plugins.clearWindows();
	});
	
	socket.on('show_event', function(data) {
	  console.log('Showing Event:',data);
	});
	
		socket.on('emotiv_connected', function(data){
		  console.log('data: ',data);  
		  startEmotiv(true);
		});
		
		socket.on('emotiv_poll',function(data){
		  
		});
		
		function startEmotiv(bool){
		  var x = bool || false;
		  if(!x){ socket.emit('emotiv_sup', {b: 'hasDongle'});}
		  
		  else{
		    
		  }
		};	
	
	socket.on('keyLog', function(data) {
	  console.log('Logging Key:',data);
	});
	
	function validateInput(input)
	{
	  var ss = input.split(' ');
	  var console = input;
	  
	  if(ss.length >= 1)
	  {	  
	    if(ss[0] === 'exit')
	    {
	      socket.emit('disconnect',{});
	    }	    
	    else if(ss[0] === 'clc')
	    {
	      socket.emit('clear', {});
	    }  
	    else if(ss[0] === 'plot')
	    {
	      var ys = 0; var xs = 0;
		    var xs = plugins.makeArrayFromString(ss[1].replace(/[\[\]]+/g, ''));
		    if(ss[2]){		      
		      ys = plugins.makeArrayFromString(ss[2].replace(/[\[\]]+/g, ''));  //we either got input in 3rd arg
		    } else {
		      ys = plugins.createNumberLine(0, xs.length);                      //or we have to make a number line
		    }
		    socket.emit('plot', {message: {x: xs, y: ys}});
		    console = "(disp('plot entered'))";
		    return console;
	    }	    
	    else if(ss[0] === 'image')
	    {
	      var path = ss[1] || "images/scream.jpg";
	      socket.emit('image', {message: path});
	      console = "(disp('displaying image from "+path+"'))";	    
	      return console;
	    }
	    else 
	    { 
	      return console;
	    }
	  }
	  else
	  {
	    return console;
	  }	
	};
	
	function init(pluginHandler)
	{
	  plugins = pluginHandler;
	  send('atlas', {txt: "Client message sent to server : "});
	};
	
	return { 
	  init          : init,
	  send          : send,
	  attachHandler : attachHandler,
	  detachHandler : detachHandler,
	  setNodeLabel  : setNodeLabel,
	  getNodeLabel  : getNodeLabel,
	  setChartHelper: setChartHelper,
	};
};
