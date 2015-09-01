/*

  GoJS helper

*/


var GoJsHelper = function(diagram,socket)
{
    var d_gram;
  
    var $go;
    
    var scene_graph;
    
    var current_selection;
  
  var init = function(diagram,socket) {
    
    
    socket.attachHandler('scene_update', function(data) {        
        updateSceneGraph(data.graph);
    });
    
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    $go = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram =
      $go(go.Diagram, diagram,//"myDiagram",  // must name or refer to the DIV HTML element
        {
          initialContentAlignment: go.Spot.Center,
          allowDrop: true,  // must be true to accept drops from the Palette
          "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
          "LinkRelinked": showLinkLabel,
          "animationManager.duration": 000001, // slightly longer than default (600ms) animation
          "undoManager.isEnabled": true  // enable undo & redo
        });
    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function(e) {
      var button = document.getElementById("SaveButton");
      
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
     // $("#sample_pipeline").hide();
    });
    
    // LEFT CLICK HANDLERS
    myDiagram.addDiagramListener("ObjectSingleClicked",
      function(e) {
        var part = e.subject.part;
        if (!(part instanceof go.Link))
        {
          showMessage("Clicked on " + part.data.text + "  ya diiiig?");          
          console.log("Category => "+part.data.category);
          console.log("Value => "+part.data.text);
          console.log("ID       => "+part.data.id);
          console.log("PART ->>> ", part);          
          console.log("TREE ROOT ID = ", part.findTreeRoot().data.key);
          console.log("Parents   => "+part.data.parents);
          console.log("Children   => "+part.data.children);
          
          
          current_selection = part.data.id;
          
          if(part.data.id === "THE_APPLY_DTIREG")
          {
            console.log("PATH = ",part.data.path);
            $("#input_content").show();           
            //$("#mySavedModel").hide();
          }          
          if(part.data.id === "Atlas")
          {            
            $("#checkers").show();
            $("#patient_content").hide();
            $("#control_content").hide();
            $("#atlas_content").show();
          }          
          if(part.data.id === "Control_Group")
          {
            console.log("Control GROUP!");            
            $("#patient_content").hide();
            $("#atlas_content").hide();
            $("#control_content").show();
          }          
          if(part.data.id === "Patient_Group")
          {
            console.log("PATIENT GROUP!");            
            $("#control_content").hide();
            $("#atlas_content").hide();
            $("#patient_content").show();
          }
        }        
      }
    );
    
    // BACKGROUND HANDLER
    
    myDiagram.addDiagramListener("BackgroundSingleClicked",
        function(e) {
            var part = e;
            console.log(e);
//            $("#input_content").hide();
            $("#checkers").hide();
            $("#patient_content").hide();
            $("#control_content").hide();
            $("#atlas_content").hide();
        }
    );
    
    // RIGHT CLICK HANDLERS
    myDiagram.addDiagramListener("ObjectContextClicked",
      function(e) {
        var part = e.subject.part;
        if (!(part instanceof go.Link))
        {
          showMessage("Clicked on " + part.data.text + "  ya diiiig?");          
          console.log("Category => "+part.data.category);
          console.log("Value => "+part.data.text);
          console.log("ID       => "+part.data.id);
          console.log("PART ->>> ", part);    
          current_selection = part.data.id;      
          if(part.data.id === "THE_APPLY_DTIREG")
          {
            console.log("RIGHT CLICK OCCURED");            
            $("#input_content").hide();           
            ui.addProgressItem();
          }
                    
          if(part.data.id === "Atlas")
          {
            $("#checkers").hide();
          }
          
          if(part.data.id === "THE_COMB_DISP")
          {
            sock.send('combine_xform', {
                    src: '/raid1e/Jeff/cpp_test_data/patients/PAT_100_SCAN2_N1_DT_aff.txt', 
                    tgt: '/raid1e/Jeff/cpp_test_data/patients/PAT_100_SCAN2_N1_DT_deffield_MINV.nii', 
                    out: '/stbb_home/jenkinsjc/Desktop/combined_displacement_testeez.nii'
            });
          }
          
          if(part.data.id === "THE_APPLY_TTT")
          {
            sock.send('apply_ttt_xform', {
                    orig: '/raid1e/Jeff/cpp_test_data/patients/PAT_100_SCAN2_N1_DT.nii', 
                    disp: '/stbb_home/jenkinsjc/Desktop/combined_displacement_testeez.nii', 
                    out: '/stbb_home/jenkinsjc/Desktop/output_PAT_100_SCAN2_N1_DT_testeez.nii'
            });          
          }          
        }        
      }
    );
       
    // notice whenever a node is dropped onto canvas
    myDiagram.addDiagramListener("ExternalObjectsDropped",
        function(e) {
            var part = e;
            e.subject.parents = [];
            e.subject.children = [];
            //socket.send('new_gojs_node', {node: e.subject});
            //console.log(e);
            //if(part.id == "nodeDataArray"){
                console.log("myDiagram.model.ADDCHANGEDLISTENER for ExternalObjectsDropped was activated");
                console.log(e);
            //}
            sock.send('scene_graph', {data: myDiagram.model.toJson(), txt: "new node"});
            
        }
    ); 
    
    // notice when new link is drawn
    myDiagram.addDiagramListener("LinkDrawn",
        function(e) {
            var part = e;
            //e.subject.parent = 0;
            //e.subject.children = 0;
            //socket.send('new_gojs_node', {node: e.subject});
            //console.log(e);
            //if(part.id == "nodeDataArray"){
                console.log("myDiagram.model.ADDCHANGEDLISTENER for LINKDRAWN was activated");
                console.log(e);
            //}
            sock.send('scene_graph', {data: myDiagram.model.toJson(), txt: "new edge"});            
        }
    ); 
    
    /*
        NEED TO ADD LISTENERS FOR WHEN THINGS ARE DELETED!
    */
    
    myDiagram.addDiagramListener("SelectionDeleted",
      function(e) {
        console.log("myDiagram.model.SELECTIONDELETED activated");
        console.log(e);
        sock.send('scene_graph', {data: myDiagram.model.toJson(), txt: "deleted"});
      }
    );
    
    // define the Node templates for regular nodes
    var lightText = 'whitesmoke';
    GoJsHelper
    myDiagram.nodeTemplateMap.add("",  // the default category
      $go(go.Node, "Spot", nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $go(go.Panel, "Auto",
          $go(go.Shape, "Rectangle",
            { fill: "#00A9C9", stroke: null, minSize: new go.Size(50,80) },
            new go.Binding("figure", "figure")),
          $go(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              stroke: lightText,
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      ));
      
    myDiagram.nodeTemplateMap.add("Start",
      $go(go.Node, "Spot", nodeStyle(),
        $go(go.Panel, "Auto",
          $go(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
          $go(go.TextBlock, "Start",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text")
          )
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      ));
      
     myDiagram.nodeTemplateMap.add("Group",
      $go(go.Node, "Spot", nodeStyle(),
        $go(go.Panel, "Auto",
          $go(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#ABCDBC", stroke: null }),
          $go(go.TextBlock, "Group",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText, editable: true },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      )); 
      
      myDiagram.nodeTemplateMap.add("Subject",
      $go(go.Node, "Spot", nodeStyle(),
        $go(go.Panel, "Auto",
          $go(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#CBABCD", stroke: null }),
          $go(go.TextBlock, "Subject", 
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      )); 
      
      myDiagram.nodeTemplateMap.add("Atlas",
      $go(go.Node, "Spot", nodeStyle(),
        $go(go.Panel, "Auto",
          $go(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#A1B2C3", stroke: null }),
          $go(go.TextBlock, "Atlas",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText, editable: true},
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, false, true),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      ));
      
    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $go(go.Link,  // the whole link panelinspector
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5, toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
          mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        },
        new go.Binding("points").makeTwoWay(),
        $go(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $go(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
        $go(go.Shape,  // the arrowhead
          { toArrow: "standard", stroke: null, fill: "gray"}),
        $go(go.Panel, "Auto",  // the link label, normally not visible
          { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
          new go.Binding("visible", "visible").makeTwoWay(),
          $go(go.Shape, "RoundedRectangle",  // the label shapemyDiagram
            { fill: "#F8F8F8", stroke: null }),
          $go(go.TextBlock, "Yes",  // the label
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text", "text").makeTwoWay())
        )
      );
      
          // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
    //load();  // load an initial diagram from some JSON text
    // initialize the Palette that is on the left side of the page
    myPalette =
      $go(go.Palette, "myPalette",  // must name or refer to the DIV HTML element
        {
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
          model: new go.GraphLinksModel([  // specify the contents of the Palette
            { category: "Start", text: "Start", children: [], parents: [], id: "THE_START", "path": "asdf", "lbl": "" },
            { category: "Subject", text: "Subject", children: [], parents: [], id: "THE_Subject", "path": "asdf", "lbl": ""},
            { category: "Group", text: "Group", children: [], parents: [], id: "THE_Group", "path": "asdf", "lbl": ""},            
            { category: "Atlas", id: "Atlas", text: "Atlas", children: [], parents: [], "path": "asdf", "lbl": ""},
          ])
        });
        
      // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
      if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    }


    // helper definitions for node templates
    function nodeStyle() {
      return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // the Node.location is at the center of each node
          locationSpot: go.Spot.Center,
          //isShadowed: true,
          //shadowColor: "#888",
          // handle mouse enter/leave events to show/hide the ports
          
          mouseEnter: function (e, obj) { showPorts(obj.part, true); console.log("EVENT IN DGM LISTNER! : ->  ",obj); },
          mouseLeave: function (e, obj) { showPorts(obj.part, false); }
        }
      ];
    }
    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
      // the port is basically just a small circle that has a white stroke when it is made visible
      return $go(go.Shape, "Circle",
               {
                  fill: "transparent",
                  stroke: null,  // this is changed to "white" in the showPorts function
                  desiredSize: new go.Size(8, 8),
                  alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                  portId: name,  // declare this object to be a "port"
                  fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                  fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                  cursor: "pointer"  // show a different cursor to indicate potential link point
               });
    }
    
    function showPorts(node, show) {
      var diagram = node.diagram;
      if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
      node.ports.each(function(port) {
          port.stroke = (show ? "white" : null);
        });
    };
    
    function makeSVG() {
    var svg = myDiagram.makeSvg({
          scale: 0.5
        });
      svg.style.border = "1px solid black";
      obj = document.getElementById("SVGArea");
      obj.appendChild(svg);
      if (obj.children.length > 0) {
        obj.replaceChild(svg, obj.children[0]);
      }    
    };
        
    function save() {
      document.getElementById("mySavedModel").value = myDiagram.model.toJson();
      myDiagram.isModified = false;
    }; 
    
    function saveLoad() {
      document.getElementById("mySavedModel").value = JSON.stringify($go("myDiagram"));//myDiagram.model.toJson();
      myDiagram.isModified = true;
    }
        
      d_gram = myDiagram;
    socket.send('root_key', {data: this.getRootKey()});
  }
  // Make all ports on a node visible when the mouse is over the node  
  // Show the diagram's model in JSON format that the user may edit
  // add an SVG rendering of the diagram at the end of this page
  

  function load() {
      d_gram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
      var x = JSON.parse(document.getElementById("mySavedModel").value);
      $("#pipeline_title").html(x.name);
      console.log(x.name);
    }
    
  function updateSceneGraph(scene) {  
    scene_graph = scene;    
  }

  return {
  
    init       : init,  
    load       : load,
    getDiagram : function(){return d_gram;},
    updateSceneGraph : updateSceneGraph,
    attachToNode : function(node) {
    
    },
    getCurrentSelection: function(){return current_selection;},
    getRootKey : function(){return -3;},
  };
  
};
