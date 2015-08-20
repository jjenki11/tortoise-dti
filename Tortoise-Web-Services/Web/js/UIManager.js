// UI Manager

var UIManager = function()
{

  return {
  
    hideDivs : function(divs) {
      for(var i in divs){
        $(divs[i]).hide();
      }
    },
    
    showDivs : function(divs) {
      for(var i in divs){
        $(divs[i]).show();
      }
    },
    
    instanceDiv : function(theDiv, numInstances) {
     
     
     var new_ob = $("<div></div>");
     
     var ob_arr = [];
     var ob = null
     
     for(var i = 0; i < numInstances; i++)
     {
        ob =  $(theDiv).clone();     
        ob_arr.push(ob);
     }
      new_ob.append(ob_arr);
      
      $(theDiv) = ("#"+new_ob.id);

    },
    
    addProgressItem : function(theItem) {    
      $("#sample_progress").append(
        '<ul><li class="divider"></li>\
            <li>\
                <a href="#">\
                    <div>\
                        <p>\
                            <strong>Task 442</strong>\
                            <span class="pull-right text-muted">90% Complete</span>\
                        </p>\
                        <div class="progress progress-striped active">\
                            <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 20%">\
                                <span class="sr-only">90% Complete</span>\
                            </div>\
                        </div>\
                    </div>\
                </a>\
            </li>\
          </ul>'
      );    
    },    
    derivedValuesForm: function(theItem) {    
      $('#checkers').append( '<label>Checkboxes</label>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="AM" name="der_vals">AM\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="DEC" name="der_vals">DEC\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="DECWL" name="der_vals">DECWL\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="DECWP" name="der_vals">DECWP\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="DT" name="der_vals">DT\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="EG" name="der_vals">EG\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="EV" name="der_vals">EV\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="FA" name="der_vals">FA\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="LI" name="der_vals">LI\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="MS" name="der_vals">MS\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="SK" name="der_vals">SK\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="TR" name="der_vals">TR\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="WL" name="der_vals">WL\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="WP" name="der_vals">WP\
                    </label>\
                </div>\
                <div class="checkbox">\
                    <label>\
                        <input type="checkbox" value="WS" name="der_vals">WS\
                    </label>\
                </div>');    
    },    
    controlGroupInput: function(txt) {
        $("#control_content").append( [$("#controlOpts").show(), $("#textFromFile")] );    
    },    
    patientGroupInput: function(txt) {
        $("#patient_content").append( [$("#patientOpts").show(), $("#textFromFile")] );
    },    
    atlasInput: function(txt) {
        $("#atlas_content").append( [$("#atlasOpts").show(), $("#textFromFile")] );        
    },    
  };

};
