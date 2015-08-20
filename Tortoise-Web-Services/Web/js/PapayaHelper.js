// Papaya helper

var PapayaHelper = function(tortoise_ui)
{
  var the_ui = tortoise_ui;
  return {
    init : function() {
      //$("#mriDiv").show();
      /*
      $("#mriDiv").append(
        '<div class="papaya" id="papi"  width="950" height="750" data-params="mri_params"></div>'
      );
      */
      console.log('initializing papaya mri viewer...');     
    },
    
    load : function(modality) {
      switch(modality) 
      {
        case 'embedded' : 
          break;
        case 'fullscreen' :
          break;          
        default : 
          console.log('nothing special...');
          break;
      }
    }
  };

};
