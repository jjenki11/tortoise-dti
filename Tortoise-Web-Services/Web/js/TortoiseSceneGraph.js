var SceneGraph = function( ) {



  var graph = {
    _class : '',
    _name  : '',
    _linkFromPortIdProperty : '',
    _linkToPortIdProperty   : '',
    nodes: [],
    edges: []
  };
  
  var theTree = {
    root  : null,
    nodes : [],
  };
  
  var node_map = new HashTable();
  var edge_map = new HashTable();


  var TreeNode = function() {
    var level    = 0;  
    var children = [];
    var parents = [];
    var data = {};
    var aRoot = false;
    var aLeaf = false;
    var key = 0;
    return {
          tagAsRoot   : function(bool){
            aRoot = bool;
          },
          tagAsLeaf   : function(bool){
            aLeaf = bool;
          },
          setData     : function(dataIn){
            data = dataIn;
          },
          setLevel    : function(dataIn){
            level = dataIn;
          },
          setKey      : function(dataIn){
            key = dataIn;
          },
          addChild    : function(dataIn){
            children.push(dataIn);
            aLeaf = false;        
          },
          addParent   : function(dataIn){
            parents.push(dataIn);
            this.tagAsRoot(false);
          },
          removeChildren : function(){
            children = [];
            tagAsLeaf(true);
          },
          getChildren : function(){
            return children;
          },
          getParents  : function(){
            return parents;
          },
          getData     : function(){
            return data;
          },    
          getLevel    : function(){
            return level;
          },
          getKey      : function(){
            return key;
          },
          isRoot      : function(){
            return aRoot;
          },
          isLeaf      : function(){
            return aLeaf;
          },
          print       : function(){
            console.log(data);
          },
    };  
  }; 
      
var Tree = function( ) {  

        function findNode(key)
        {
            for(var i = 0; i < theTree.nodes.length; i++)
            {
                console.log('comparing tree node having key = ',theTree.nodes[i].getKey(),' with key argument = ',key);
                if(theTree.nodes[i].getKey() === key)
                {
                    return theTree.nodes[i];
                }
            }
            return null;
        };
        function insertNode(node)
        {
            if(!theTree.root)
            {
                console.log('this is the root');
                theTree.root = node;
                node.parents = null;
                 
            }
            else
            {
                
            }
            theTree.nodes.push(node);  
        };
        function traverseTree(dataIn,i,j) 
        {   
            var node = null;
            if(!i){i=0;} else{i++}
            if(!j){j=0;} else{j++}
            if(!dataIn.children){return;}
            if(dataIn.children && dataIn.children.length > 0)
            {
                node = dataIn;
                console.log('child node encountered = ' +node.getData());
                traverseTree(node.children[i],i,j);                
            }
            else if(dataIn.children && i == dataIn.children.length-1)
            {
                console.log('node passed, ', node.getData());
                traverseTree(node,i,j);
                //console.log('cannot traverse children.');
            }
            else {
                node = dataIn;
                console.log('wtf... node is = ',node.getData());
            }
        };
        function performNodeUnion(child, parent)
        {
            if(!child) {
                console.log('child is null for parent ',parent.getKey());
            }
            else {
                child.addParent(parent);
            }
            if(!parent) {
                console.log('parent is null for child ',child.getKey());
            }
            else {
                parent.addChild(child);
            }
        };
        return {        
            buildTree        : function(graph){                
                var verts = graph.nodes;
                var edges = graph.edges;
                var tmpNode;
                // main logic to build a tree
                for(var i=0;i<verts.length;i++)
                {
                    tmpNode = new TreeNode();
                    tmpNode.setData(verts[i]);
                    tmpNode.setKey(tmpNode.getData().key);
                    tmpNode.print();
                    insertNode(tmpNode);
                }     
                for(var i=0;i<edges.length;i++)
                {
                    var child  = findNode(edges[i].fromIndex);
                    var parent = findNode(edges[i].toIndex);
                    console.log('toIndex = ',edges[i].toIndex);
                    console.log('fromIndex = ',edges[i].fromIndex);
                    performNodeUnion(child, parent);                    
                }  
                console.log('now we want to traverse...');
                traverseTree(theTree.nodes[0],0,0);    
                console.log(theTree);          
            },
            
            getRootNodes     : function(){
                
            },
            getLeafNodes     : function(){
            
            },
            getIsolatedNodes : function(){
            
            },
            getTree          : function(){
                return theTree;
            },
        
        };
  };

  
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
    console.log('new node added, ',node);
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
    console.log('new edge added, ',edge);
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
    
    console.log('here are the root nodes: ');
    console.log(getRootNodes());
    console.log('here are the terminal nodes: ');
    console.log(getTerminalNodes());
    console.log('here are the isolated nodes: ');
    console.log(getIsolatedNodes());
  };
  
  var attachWorkerNode = function( newNode, targetNode  )
  {
    // Automatically create a new node next to 'group' when creating a template.  
  };
  
  var getRootNodes = function()
  {
    var nodes = [];
    var g = getSceneGraph();
    var tmp;
    var found = false;
    var toFound = false;
    for(var i = 0; i < g.nodes.length; i++)
    {
        tmp = g.nodes[i];
        for(var j = 0; j < g.edges.length; j++)
        {
        //basically we check if the node's key exists as a 'toIndex', if not then it is a root node
            if(g.edges[j].toIndex == tmp.key)
            {
                toFound = true;
                found = false;
                break;
            }
        //check to make sure that the node actually goes somewhere
            if(g.edges[j].fromIndex == tmp.key) {fromFound = true;}          
        //again, only consider a node root if it any edge claims it arose from the node
            if(!toFound && fromFound)           {found = true;}   
        //if it has a to, it is not root but has a parent        
            if(toFound)                         {found = false;}
        }
        if(found)                              {nodes.push(tmp);}
            

    }    
    return nodes;
  };
  
  var getTerminalNodes = function()
  {
    var nodes = [];
    var g = getSceneGraph();
    var tmp;
    var found = false;
    var alreadyAdded = false;
    for(var i = 0; i < g.edges.length; i++)
    {        
        for(var j = 0; j < g.nodes.length; j++)
        {
            tmp = g.nodes[j];
        //basically we check if the node's key exists as a 'fromIndex', if not then it is a terminal node
            if(g.edges[i].fromIndex == tmp.key){ found = false;}
            else                               { found = true; }
        }
        if(found) {
            for(var k = 0; k < nodes.length; k++)
            {
                if(tmp.key == nodes[k].key)     {alreadyAdded = true;}             
            }
            if(!alreadyAdded)                   {nodes.push(tmp);}         
        }
    }    
    return nodes;  
  };
  
  var getIsolatedNodes = function()
  {
    var nodes = [];
    var g = getSceneGraph();
    var tmp;
    var found = false;
    var alreadyAdded = false;
    var fromFound = false;
    var toFound   = false;
    for(var i = 0; i < g.edges.length; i++)
    {        
        for(var j = 0; j < g.nodes.length; j++)
        {
            tmp = g.nodes[j];
        //basically we check if the node's key exists as a 'fromIndex' or as a 'toIndex' for anything ... if not then it is an isolated node
            if(g.edges[i].fromIndex == tmp.key)     {fromFound = true;}
            if(g.edges[i].toIndex == tmp.key)       {toFound = true;}          
            if(toFound || fromFound)                {found = false;}
            if(!toFound && !fromFound)              {found = true;}
        }

        if(found) {
            for(var k = 0; k < nodes.length; k++)
            {
                if(tmp.key == nodes[k].key)         {alreadyAdded = true;}                
            }
            if(!alreadyAdded)                       {nodes.push(tmp);}
        }
    }  
    var x = new Tree();
    console.log('Building a tree from the scene graph');
    x.buildTree(getSceneGraph());
    
    return nodes;    
  
  };
  
  return {  
    init: init,
    attachWorkerNode: attachWorkerNode,
    JSONToSceneGraph: JSONToSceneGraph,
    SceneGraphToJSON: SceneGraphToJSON,
    printGraph: printGraph,
    getRootNodes:getRootNodes,
    getTerminalNodes:getTerminalNodes,
    getIsolatedNodes:getIsolatedNodes,
  };

};
