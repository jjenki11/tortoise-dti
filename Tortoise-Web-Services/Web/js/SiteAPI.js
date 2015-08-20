

var SiteAPI = function()
{
    var mri_view = null;
    var setup_view = null;
    return {
        init: function(){
            console.log("we are in the setup stuffs");
            return ("omg its Tortoise DTI!");
        },
        
        setupWizard: function(id){
        
        
        
        
          var v1 = $('<button>Set up flow chart</button>');
          v1.click(function(){
            console.log("coolio. flowchart view");
            window.location = "gojs_test_flowchart.html";
          });
          var v2 = $('<button>Set up pallete view</button>');
          v2.click(function(){
            console.log("coolio. jquery pallete view");
            window.location = "gojs_test_jquery.html";
          });
          setup_view = $('<button>Set up dataflow</button>');
          setup_view.click(function(){
            console.log("coolio. dataflow view");
            window.location = "gojs_test_dataflow.html";
          });
          /*
          var inline_plumb = $('<button id="ilsetup">In-line setup</button>');
          
          inline_plumb.click(function(){
            console.log("this is plumb");
            $(id).show();
            jsPlumb.repaint('plumber');    
          });
          
          var x = [];
          x.push(v1);
          x.push(v2);
          x.push(setup_view);
          x.push(inline_plumb);
          return x;    
          */    
        },
        
        fullViewer: function(){
            mri_view = $('<button>View Fullscreen MRI</button>');      
            mri_view.click(function() {
                console.log("coolio. fullscreen view");
                window.location = "js/papaya/Papaya-master/build/index.html";
            });
            return mri_view;
        },
        
        embeddedViewer: function(){
            mri_view = $('<button>View Embedded MRI</button>');
            mri_view.click(function() {            
                window.location = "js/papaya/Papaya-master/build/index_small.html";
            });
            return mri_view;        
        },
    };
};



var Plumb_API = function() {

  return {
  
    init: function(){
      console.log('init of plumb_api');
    }
  };

};

