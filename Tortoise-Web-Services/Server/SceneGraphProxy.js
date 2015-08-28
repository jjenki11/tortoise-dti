// This is a proxy to mirror the scene graph constructed in the browser to manage transformation stuff.

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
  
  var theTree = {
    root  : null,
    nodes : [],
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

  var TemplateNode = function() {    
    var avg_template_affines = [];
    var avg_template_diffeos = [];
    var groups               = [];
    var transforms           = [];
    var rois                 = [];
    return {
        addAffine : function(aff){
            avg_template_affines.push(aff);
        },
        addDiffeo : function(dif){
            avg_template_diffeos.push(dif);
        },
        addGroup  : function(g){
            groups.push(g);
        },
        addTransform : function(trans){
            transforms.push(trans);
        },
        addROI       : function(r){
            rois.push(r);
        },
        setGroups : function(g){
            groups = g;
        },  
        setROIs   : function(rs){
            rois = rs;
        },
        getGroups : function(){
            return groups;
        },
        getAffines : function(){
            return avg_template_affines;
        },
        getDiffeos : function(){
            return avg_template_diffeos;
        },
        getTransforms : function(){
            return transforms;
        },
        getROIs       : function(){
            return rois;
        },
    };
  };
  
  var TransformNode = function() {    
    var affine = null;
    var deffield = null;
    var combined_displacement = null;    
    return {
        getAffineTransformation : function(){
            return affine;
        },
        getDeffieldTransformation : function(){
            return deffield;
        },
        getCombinedDisplacement : function(){
            return combined_displacement;
        },
        setAffineTransformation : function(trans){
            affine = trans;
        },
        setDeffieldTransformation : function(trans){
            deffield = trans;
        },
        setCombinedDisplacement : function(trans){
            combined_displacement = trans;
        },
    };          
  };
  
  var GroupNode = function() {  
    var subjects   = [];
    var transforms = [];
    var metadata   = {id:null};        
    return {    
        addTransformNode : function(node){
            transforms.push(node);
        },
        getTransforms    : function(){
            return transforms;
        },
        setID   : function(ID){
            metadata.id = ID;
        },
        addSubjectNode   : function(node){        
            subjects.push(node);
        },
        getSubjects      : function(){
            return subjects;
        },
        getMetadata   : function(){
            return metadata;
        },
        reset            : function(){
            metadata   = {id:null};
            subjects   = [];
            transforms = [];
        }    
    };
  };
  
  var SubjectNode = function() {  
    var transforms = [];
    var metadata   = {id:null, group: null};
    return {
        addTransformNode : function(node){
            transforms.push(node);
        },
        getTransforms : function(){
            return transforms;
        },
        setID   : function(ID){
            metadata.id = ID;
        },
        setGroup : function(g){
            metadata.group = g;
        },
        getMetadata   : function(){
            return metadata;
        },
        reset         : function(){
            metadata   = {id:null, group: null};
            transforms = [];
        }        
    };   
  };

  
  
  var TreeNode = function() {
    var level    = 0;  
    var children = [];
    var parents = [];
    var data = {};
    var aRoot = false;
    var aLeaf = false;
    var key = 0;
    
    var transformNode = null;
    var groupNode     = null;
    var templateNode  = null;
    var subjectNode   = null;
    
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
                console.log('comparing tree node having key = ',theTree.nodes[i].key,' with key argument = ',key);
                if(theTree.nodes[i].key === key)
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
                var d = node.getData();
                var cat = d.category;
                if(cat === 'Group')
                {
                    console.log('this is the root, a group node');
                    var gNode = new GroupNode();
                    gNode.setID(d.id);
                }
                
                theTree.root = node.getData();
                node.parents = null;
                 
            }
            else
            {
                
            }
            theTree.nodes.push(node);  
        };
        
        function performNodeUnion(child, parent)
        {
            if(!child) {
                console.log('child is null for parent ',parent);
            }
            else {
                child.addParent(parent);
            }
            if(!parent) {
                console.log('parent is null for child ',child);
            }
            else {
                parent.addChild(child);
            }
        };
        
        function getCategory(data)
        {
            return data.category;
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
                    //performNodeUnion(child, parent);                    
                }  
                console.log('now we want to traverse...');
                theTree.nodes = verts;
                //console.log(theTree);    
                this.traverseTree(theTree.nodes[0],0,0);       
                               
            },            
            getRootNodes     : function(){
                var dNodes = theTree.nodes;
                var roots = [];
                console.log('in the tree one...');
                for(var i = 0; i < dNodes.length; i++)
                {
                    if((dNodes[i].children.length != 0 ) && (dNodes[i].parents.length == 0))
                    {
                        roots.push(dNodes[i]);
                    }
                }            
                theTree.root = roots;    
                return roots;
            },
            getLeafNodes     : function(){
                var dNodes = theTree.nodes;
                var leaves = [];
                for(var i = 0; i < dNodes.length; i++)
                {
                    if((dNodes[i].children.length) == 0 && (dNodes[i].parents.length != 0))
                    {
                        leaves.push(dNodes[i]);
                    }
                }                
                return leaves;
            },
            getIsolatedNodes : function(){
                var dNodes = theTree.nodes;
                var lonelies = [];
                for(var i = 0; i < dNodes.length; i++)
                {
                    if((dNodes[i].children.length == 0) && (dNodes[i].parents.length == 0))
                    {
                        lonelies.push(dNodes[i]);
                    }
                }                
                return lonelies;
            },
            getInteriorNodes : function(){
                var dNodes = theTree.nodes;
                var lonelies = [];
                for(var i = 0; i < dNodes.length; i++)
                {
                    if((dNodes[i].children.length != 0) && (dNodes[i].parents.length != 0))
                    {
                        lonelies.push(dNodes[i]);
                    }
                }                
                return lonelies;
            },
            getTree          : function(){
                return theTree;
            },
            traverseTree     : function(dataIn,i,j) 
            {               
                console.log('Root nodes     -> ',this.getRootNodes());
                console.log('Leaf nodes     -> ',this.getLeafNodes());
                console.log('Isolated nodes -> ',this.getIsolatedNodes());
                console.log('Interior nodes -> ',this.getInteriorNodes());
            },
        
        };
  };



var SceneGraphProxy = 
{ 
    /* Graph representation */
  
  getSceneGraph : function( )
  {
    return graph;
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
        //console.log(this.sgEdge(edgeJSON[j]));
    }    
    console.log('Number of nodes = ',graph.nodes.length);
    console.log('Number of edges = ',graph.edges.length);   
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
    if(updated){
        var from = node_map.getItem(data.from);
        from.children.push(data.from);        
        var to   = node_map.getItem(data.to);
        to.parents.push(data.to);            
        node_map.setItem(data.from, from);
        node_map.setItem(data.to, to);
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
    var x;
    //console.log(sGraph);
    switch(graph.txt){
    
        case 'new edge' : 
            console.log('NEW EDGINGTON');
            sGraph = this.JSONToSceneGraph(graph.data,true);
            break;
        case 'new node' : 
            console.log('NEW NODINGTON');
            sGraph = this.JSONToSceneGraph(graph.data,false);
            break;
        case 'initialize' : 
            console.log('NEW GRAPHINGTON');
            sGraph = this.JSONToSceneGraph(graph.data,false);
            break;
        default  :
            console.log('unsure');
            break;
    }
    var x = new Tree();
    console.log('Building a tree from the scene graph');
    x.buildTree(this.getSceneGraph());
    sock.emit('scene_init', {txt: 'Scene graph initialized on server'});

    this.printGraph();
  },

};


module.exports.SceneGraphProxy = SceneGraphProxy;
