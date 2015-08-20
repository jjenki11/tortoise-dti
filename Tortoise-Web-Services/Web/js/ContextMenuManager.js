// Context Menu Manager

var ContextMenuManager = function(tortoise_ui)
{
  var the_ui = tortoise_ui;

  return {
    
    init : function() {
		  // Show menu when #myDiv is clicked
		  $("#myDiv").contextMenu({
			  menu: 'myMenu'
		  },
			  function(action, el, pos) {			      
		      switch(action)
		      {
		          case 'delete': 
		              console.log(action+" pressed");
		              break;
		          case 'edit':
		              console.log(action+" pressed");
		              break;
		          case 'quit':
		              console.log(action+" pressed");
		              break;
		          case 'copy':
		              console.log(action+" pressed");
		              break;
		          case 'paste':
		              console.log(action+" pressed");
		              break;
		          case 'cut':
		              console.log(action+" pressed");
		              break;
		          default :
		              console.log("something else was pressed...");					    
		      }
		  });

		  // Show menu when a list item is clicked
		  $("#myList UL LI").contextMenu({
			  menu: 'myMenu'
		  }, function(action, el, pos) {
		        switch(action)
			      {
			          case 'delete': 
			              console.log(action+" pressed");
			              $("#hideme").hide();
			              break;
			          case 'edit':
			              console.log(action+" pressed");
			              $("#hideme").show();
			              break;
			          case 'quit':
			              console.log(action+" pressed");
			              break;
			          case 'copy':
			              console.log(action+" pressed");
			              break;
			          case 'paste':
			              console.log(action+" pressed");
			              break;
			          case 'cut':
			              console.log(action+" pressed");
			              break;
			          default :
			              console.log("something else was pressed...");					    
			      }
			      /*
			        alert(
				        'Action: ' + action + '\n\n' +
				        'Element text: ' + $(el).text() + '\n\n' +
				        'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' +
				        'X: ' + pos.docX + '  Y: ' + pos.docY+ ' (relative to document)'
			        );
			      */
		  });
		  // Disable menus
		  $("#disableMenus").click( function() {
			  $('#myDiv, #myList UL LI').disableContextMenu();
			  $(this).attr('disabled', true);
			  $("#enableMenus").attr('disabled', false);
		  });
		  // Enable menus
		  $("#enableMenus").click( function() {
			  $('#myDiv, #myList UL LI').enableContextMenu();
			  $(this).attr('disabled', true);
			  $("#disableMenus").attr('disabled', false);
		  });
		  // Disable cut/copy
		  $("#disableItems").click( function() {
			  $('#myMenu').disableContextMenuItems('#cut,#copy');
			  $(this).attr('disabled', true);
			  $("#enableItems").attr('disabled', false);
		  });
		  // Enable cut/copy
		  $("#enableItems").click( function() {
			  $('#myMenu').enableContextMenuItems('#cut,#copy');
			  $(this).attr('disabled', true);
			  $("#disableItems").attr('disabled', false);
		  });   
		  	$("#toggleMRI").click( function() {
				    state = !state;
				    if(state)
				    {
				        $("#hideme").show();    
				        $("#hideme").append("<a href='js/papaya/Papaya-master/build/embedded_pap.html'> CLICK HERE </a>");
				        $('#iframe1').hide();
				    }
				    else
				    {
				        $("#hideme").hide();
				        $("#iframe1").show();
				        $('#iframe1').contents().find('html').html("<h1 style='text-align: center;'>This IS an iframe</h1>");
				    }
				
				}); 
				
			
    },
    
    loadContent : function() {
       var x = null;
      // the_ui.showDivs(["#menuDiv"]);
       //x =the_ui.instanceDiv("#menuDiv", 5);
       //return x;
    },
    
    
  
  };

};
