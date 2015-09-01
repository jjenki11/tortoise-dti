// This is a proxy to mirror the scene graph constructed in the browser to manage transformation stuff.


var tree;


var path = "";
var project_path;
/*
var childProcess = require('child_process'),
  child_scraper;

var foundCounter = 0;
*/

var socket;
var sGraph;

var i = 0;

  var graph = {
    _class : '',
    _name  : '',
    _linkFromPortIdProperty : '',
    _linkToPortIdProperty   : '',
    nodes: [],
    edges: []
  };

    function HashTable(obj)
    {
        this.length = 0;
        this.items = {};
        for (var p in obj) 
        {
            if (obj.hasOwnProperty(p)) 
            {
                this.items[p] = obj[p];
                this.length++;
            }
        }
        this.setItem = function(key, value)
        {
            var previous = undefined;
            if (this.hasItem(key)) {
                previous = this.items[key];
            }
            else {
                this.length++;
            }
            this.items[key] = value;
            return previous;
        }
        this.getItem = function(key) 
        {
            return this.hasItem(key) ? this.items[key] : undefined;
        }

        this.hasItem = function(key)
        {
            return this.items.hasOwnProperty(key);
        }       
        this.removeItem = function(key)
        {
            if (this.hasItem(key)) {
                previous = this.items[key];
                this.length--;
                delete this.items[key];
                return previous;
            }
            else {
                return undefined;
            }
        }
        this.keys = function()
        {
            var keys = [];
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    keys.push(k);
                }
            }
            return keys;
        }
        this.values = function()
        {
            var values = [];
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    values.push(this.items[k]);
                }
            }
            return values;
        }
        this.each = function(fn) {
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    fn(k, this.items[k]);
                }
            }
        }
        this.clear = function()
        {
            this.items = {}
            this.length = 0;
        }
    };
  
  
  var node_map = new HashTable();
  var edge_map = new HashTable();





var SceneGraphProxy = 
{ 
    /* Graph representation */
    
  
  getSceneGraph : function( )
  {
    return graph;
  },
  
  InvertGraph : function( )
  {
    var inv_graph = this.getSceneGraph();
    var old_graph = this.getSceneGraph();
    
    
    var X = require('./AssetTreeProxy.js').AssetTreeProxy();
    
    var verts = old_graph.nodes;
    var edges = old_graph.edges;    
    
  },
  
  isInList : function(data, list)
  {
    var bool = false;
    for(var i = 0; i < list.length; i++)
    {
        if(list[i] == data)
        {
            bool = true;
        }
    }
    return bool;
  },
  
  SceneGraphToJSON : function( )
  {
    return {    
        class                  : graph._class,
        name                   : graph._name,
        linkFromPortIdProperty : graph._linkFromPortIdProperty,
        linkToPortIdProperty   : graph._linkToPortIdProperty,
        nodeDataArray          : graph.nodes,
        linkDataArray          : graph.edges
    };  
  },
  
  JSONToSceneGraph : function(data, update)
  {
    var x = JSON.parse(data);
    data = x;
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
        graph.nodes.push(this.sgNode(nodeJSON[i]));
    }    
    for(var j = 0; j < numEdges; j++)
    {
        graph.edges.push(this.sgEdge(edgeJSON[j],update));
    }    
    
    socket.emit('scene_update', {graph: this.SceneGraphToJSON(graph)});        
    console.log('Number of nodes = ',graph.nodes.length);
    console.log('Number of edges = ',graph.edges.length);   
    return graph;
  },

  // vestigial function now, can probably use it to initialize graph with existing save file though
  initSG : function(data) {  
    console.log(data.nodeDataArray);
    console.log(data.linkDataArray);
    console.log('parsing model');
  },

  sgNode : function( data ) 
  {    
    var node = {
        category :    data.category,
        text     :    data.text,
        id       :    data.id,
        path     :    data.path,
        lbl      :    data.lbl,
        key      :    data.key,
        loc      :    data.loc,
        parents  :    data.parents || [],
        children :    data.children || [],
    };  
    node_map.setItem(data.key, node);
    console.log('new node added, ',node);
    return node;
  },
  
  sgEdge : function( data, updated ) 
  {
    if( updated )
    {
        console.log('EDGE  = ');
        console.log(data);
         var to   = node_map.getItem(data.to);
         var from = node_map.getItem(data.from);
         if( ! this.isInList( data.to, from.children ))
         {
             from.children.push(data.to);
             node_map.setItem(data.from, from);
         }
         if( ! this.isInList( data.from, to.parents ))
         {
             to.parents.push(data.from);        
             node_map.setItem(data.to, to);    
         }
    }
    
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
  },
  
  printGraph : function( )
  {
    var g = this.getSceneGraph();    
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
    console.log(this.getRootNodes());
    console.log('here are the terminal nodes: ');
    console.log(this.getTerminalNodes());
    console.log('here are the isolated nodes: ');
    console.log(this.getIsolatedNodes());
    console.log('here are the interior nodes: ');
    console.log(this.getInteriorNodes());
  },
  
  attachWorkerNode : function( newNode, targetNode  )
  {
    // Automatically create a new node next to 'group' when creating a template.  
  },
  
  getRootNodes : function()
  {
    var nodes = [];
    var g = this.getSceneGraph();
    var tmp;
    for(var i = 0; i < g.nodes.length; i++)
    {
        tmp = g.nodes[i];
        if((tmp.parents.length == 0) && (tmp.children.length != 0))
        {
            nodes.push(tmp);
        }
    }    
    return nodes;
  },
  
  getTerminalNodes : function()
  {
    var nodes = [];
    var g = this.getSceneGraph();
    var tmp;
    for(var i = 0; i < g.nodes.length; i++)
    {        
        tmp = g.nodes[i];
        if((tmp.parents.length != 0) && (tmp.children.length == 0))
        {
            nodes.push(tmp);
        }
    }    
    return nodes;  
  },
  
  getIsolatedNodes : function()
  {
    var nodes = [];
    var g = this.getSceneGraph();
    var tmp;
    for(var i = 0; i < g.nodes.length; i++)
    {        
        tmp = g.nodes[i];
        if((tmp.parents.length == 0) && (tmp.children.length == 0))
        {
            nodes.push(tmp);
        }
    }
    return nodes;  
  },
  
  getInteriorNodes : function()
  {
    var nodes = [];
    var g = this.getSceneGraph();
    var tmp;
    for(var i = 0; i < g.nodes.length; i++)
    {        
        tmp = g.nodes[i];
        if((tmp.parents.length != 0) && (tmp.children.length != 0))
        {
            nodes.push(tmp);
        }
    }
    return nodes;  
  },

  init     : function(graph, sock) {
    socket = sock;
    
    console.log('yay in the proxy');
    
    switch(graph.txt){
    
        case 'new edge' : 
            console.log('NEW EDGINGTON');
            sGraph = this.JSONToSceneGraph(graph.data,true);
            sock.emit('scene_update', {txt: 'new edge added', data: this.SceneGraphToJSON(sGraph)});         
            console.log('Building a tree from the scene graph');
            tree.updateTree(this.getSceneGraph());
            break;
        case 'new node' : 
            console.log('NEW NODINGTON');
            sGraph = this.JSONToSceneGraph(graph.data,false);
            sock.emit('scene_update', {txt: 'new edge added', data: this.SceneGraphToJSON(sGraph)});     
            tree.updateTree(this.getSceneGraph());    
            break;
        case 'deleted' : 
            console.log('NEW EDGINGTON');
            sGraph = this.JSONToSceneGraph(graph.data,false);   
                console.log('Building a tree from the scene graph');
            tree.traverseInReverse(tree.getRootNodes()[0].key, '');
            //tree.updateTree(this.JSONToSceneGraph(graph.data,false));
            sock.emit('scene_update', {txt: 'something was deleted', data: this.SceneGraphToJSON(sGraph)}); 
            tree.updateTree(this.getSceneGraph());
            tree.traverseTree();
            break;
        case 'initialize' : 
          tree = require('./AssetTreeProxy.js').AssetTreeProxy();
            console.log('NEW GRAPHINGTON');
            sGraph = this.JSONToSceneGraph(graph.data,false);
            sock.emit('scene_init', {txt: 'Scene graph initialized on server'});
            break;
        default  :
            console.log('unsure');
            break;
    }    
    console.log('Building a tree from the scene graph');
    tree.buildTree(this.getSceneGraph());
    tree.traverseTree();
    tree.traverseInReverse(tree.getRootNodes()[0].key, '');
  },
  update    : function(graph) {
              tree = require('./AssetTreeProxy.js').AssetTreeProxy();
            console.log('UPDATED GRAPHINGTON');
            sGraph = this.JSONToSceneGraph(graph.data,false);
    console.log('updated', sGraph);
    socket.emit('scene_init', {txt: 'Scene graph updated on server'});
    console.log('Building a tree from the scene graph');
    tree.buildTree(this.getSceneGraph());
    tree.traverseTree();
    tree.traverseInReverse(tree.getRootNodes()[0].key, '');
    tree.traverseTree(tree.getRootNodes()[0].key,0,0);    
                  var t = tree.traverseInReverse(tree.getRootNodes()[0].key, '');
                var x =   tree.aggregateTransforms(t.reverse());      
                console.log('updated transform list = ',x);
   //tree.updateTree(this.getSceneGraph());
  }

};


module.exports.SceneGraphProxy = SceneGraphProxy;
