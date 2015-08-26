var SceneGraph = function( ) {

  var graph = {
    _class : '',
    _name  : '',
    _linkFromPortIdProperty : '',
    _linkToPortIdProperty   : '',
    nodes: [],
    edges: []
  };

  var node_map = new HashTable();
  var edge_map = new HashTable();
  
  var i = 0;
  
  var getSceneGraph = function( )
  {
    return graph;
  };
  
  var SceneGraphToJSON = function( )
  {
    return {    
        class                  : graph._class,
        name                   : graph._name,
        linkFromPortIdProperty : graph._linkFromPortIdProperty,
        linkToPortIdProperty   : graph._linkToPortIdProperty,
        nodeDataArray          : graph.nodes,
        linkDataArray          : graph.edges
    };  
  }
  
  var JSONToSceneGraph = function(data)
  {
    graph.nodes = [];
    graph.edges = [];
    
    graph._class = "go.GraphLinksModel";
    graph._name  = data.name;
    graph._linkFromPortIdProperty = data.linkFromPortIdProperty;
    graph._linkToPortIdProperty   = data.linkToPortIdProperty;
    
    var edgeJSON = data.linkDataArray;
    var nodeJSON = data.nodeDataArray;
    
    
    var numEdges = edgeJSON.length;    
    var numNodes = nodeJSON.length;
    
    for(var i = 0; i < numNodes; i++)
    {    
        graph.nodes.push(sgNode(nodeJSON[i]));        
    }    
    for(var j = 0; j < numEdges; j++)
    {
        graph.edges.push(sgEdge(edgeJSON[j]));
        console.log(sgEdge(edgeJSON[j]));
    }    
    console.log('Number of nodes = ',graph.nodes.length);
    console.log('Number of edges = ',graph.edges.length);   
  };

  // vestigial function now, can probably use it to initialize graph with existing save file though
  var init = function(data) {  
    console.log(data.nodeDataArray);
    console.log(data.linkDataArray);
    console.log('parsing model');
  };

  var sgNode = function( data ) 
  {    
    var node = {
        category :    data.category,
        text     :    data.text,
        id       :    data.id,
        path     :    data.path,
        lbl      :    data.lbl,
        key      :    data.key,
        loc      :    data.loc
    };  
    node_map.setItem(data.key, node);
    console.log('new node added, ',node.key);
    return node;
  };
  
  var sgEdge = function( data ) 
  {
    var edge = {
        fromIndex     : data.from,
        toIndex       : data.to,
        fromNode      : node_map.getItem(data.from),
        toNode        : node_map.getItem(data.to),
        fromPort      : data.fromPort,
        toPort        : data.toPort,
        points        : data.points,
        key           : data.from+'_'+data.to
    };
    edge_map.setItem(data.key, edge);
    console.log('new edge added, ',edge.key);
    return edge;
  };
  
  var printGraph = function( )
  {
    var g = getSceneGraph();    
    var txt = '';
    var tmp;
    for(var i = 0; i < g.edges.length; i++)
    {
        if(!tmp){
            txt += g.edges[i].fromNode.text + ' -> ' + g.edges[i].toNode.text;
            tmp = g.edges[i].toNode.text;
        } else {
            txt += ' -> '+g.edges[i].toNode.text;
        }         
    }
    console.log('here is your graph: ');
    console.log(txt);  
  };

  var Tree = function( ) {
  
    
  };
  
  return {  
    init: init,
    JSONToSceneGraph: JSONToSceneGraph,
    SceneGraphToJSON: SceneGraphToJSON,
    printGraph: printGraph,
  };

};
