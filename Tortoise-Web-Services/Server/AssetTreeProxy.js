
// AssetTreeProxy is an interface to traverse a hierarchical structure from the server.  This will require more work

var AssetTreeProxy = function( ) {  
  
  
  // Template node will contain information about external template and all groups being registered to it
    var TemplateNode = function() {    
      var avg_template_affines = [];
      var avg_template_diffeos = [];
      var groups               = [];
      var transforms           = [];
      var rois                 = [];
      var id;
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
        setID     : function(ID){
            id = ID;
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
  
  // Transform node will hold data which explains morph from original to new space
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
  
  // Group node will hold data such as subject list, template filename, and list of other transformations, etc.
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
        setSubjects      : function(data){
            subjects = data;
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
  
  // Subject node will hold data such as filename, transform to template, etc
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

// Generic tree node object - can be any type of category node
  var TreeNode = function(type) {
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
    
    var t = type;
    switch(t){
      case 'transform' :
        transformNode = {};
        break;
      case 'group' :
        groupNode = {};
        break;
      case 'template' :
        templateNode = {};
        break;
      case 'subject' :
        subjectNode = {};
        break;
      default :
        
        break;
    }
    
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
  
        var strOut = [];
        var nodes = [];    //list of {data: ..., ...}
        var branches = []; //list of {from: x, to: y}
        var root = null;
        
        // Returns a node having a certain key
        function findNode(key)
        {
            for(var i = 0; i < nodes.length; i++)
            {
                if(nodes[i].key === key)
                {
                    return nodes[i];
                }
            }
            return null;
        };
        
        // insert a node into the tree, TBD make category specific node types more solid
        function insertNode(node)
        {
            var d = node.getData();
            var cat = d.category;
            
            if(!root)
            {            
                nodes.push(node);  
                root = node.getData();
                node.parents = null; 
            }
            else
            {
               if(cat === 'Group')
                {
                    console.log('this is a group node');
                    var gNode = new GroupNode();
                    gNode.setID(d.id);
                    nodes.push(gNode);  
                }
                if(cat === 'Control Group')
                {
                    console.log('this is the control group node');
                    var gNode = new GroupNode();
                    gNode.setID(d.id);
                    nodes.push(gNode);  
                }
                if(cat === 'Atlas')
                {
                    console.log('this is the atlas node');
                    var gNode = new TemplateNode();
                    gNode.setID(d.id);
                    nodes.push(gNode);  
                }
                if(cat === 'Template')
                {
                    console.log('this is template group node');
                    var gNode = new TemplateNode();
                    gNode.setID(d.id);
                    nodes.push(gNode);  
                }
                if(cat === 'Subject')
                {
                    console.log('this is subject group node');
                    var gNode = new SubjectNode();
                    gNode.setID(d.id);
                    nodes.push(gNode);  
                }
            }            
        };
        
        // TBD to sync parents and children pointers
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
        
        // return category element
        function getCategory(data)
        {
            return data.category;
        };                
        
        
        // api
        return {        
            // Returns list of nodes having group no parents   
            getRootNodes     : function(){
                var dNodes = nodes;
                var roots = [];
                console.log('in the tree one...', dNodes);
                for(var i = 0; i < dNodes.length; i++)
                {
                  if(dNodes[i].children)
                  {
                    if((dNodes[i].children.length != 0 ) && (dNodes[i].parents.length == 0))
                    {
                        roots.push(dNodes[i]);
                    }
                  }
                }            
                root = roots;    
                return roots;
            },
            // Returns list of nodes having no children
            getLeafNodes     : function(){
                var dNodes = nodes;
                var leaves = [];
                for(var i = 0; i < dNodes.length; i++)
                {
                  if(dNodes[i].children)
                  {
                    if((dNodes[i].children.length) == 0 && (dNodes[i].parents.length != 0))
                    {
                        leaves.push(dNodes[i]);
                    }
                  }
                }                
                return leaves;
            },
            // Returns list of nodes having neither parents nor children
            getIsolatedNodes : function(){
                var dNodes = nodes;
                var lonelies = [];
                for(var i = 0; i < dNodes.length; i++)
                {
                  if(dNodes[i].children)
                  {
                    if((dNodes[i].children.length == 0) && (dNodes[i].parents.length == 0))
                    {
                        lonelies.push(dNodes[i]);
                    }
                  }
                }                
                return lonelies;
            },
            // Returns list of nodes which have both a parent and child
            getInteriorNodes : function(){
                var dNodes = nodes;
                var interiors = [];
                for(var i = 0; i < dNodes.length; i++)
                {
                  if(dNodes[i].children)
                  {
                    if((dNodes[i].children.length != 0) && (dNodes[i].parents.length != 0))
                    {
                        interiors.push(dNodes[i]);
                    }
                  }
                }                
                return interiors;
            },
            // Returns list of nodes having group as their cateogry
            getGroupNodes : function(){
              var gNodes = nodes;
              var groupies = [];
              for(var i = 0; i < gNodes.length; i++)
              {
                if((gNodes[i].category == 'Group'))
                {
                  groupies.push(gNodes[i]);
                }
              }
              return groupies;
            },
            // Returns list of nodes having atlas as their cateogry
            getAtlasNodes : function(){
              var gNodes = nodes;
              var groupies = [];
              for(var i = 0; i < gNodes.length; i++)
              {
                if((gNodes[i].category == 'Atlas'))
                {
                  groupies.push(gNodes[i]);
                }
              }
              return groupies;
            },
            // Returns the entire tree
            getTree          : function(){
                return this;
            },
            // Really just prints out the types of nodes
            traverseTree     : function() 
            {               
                console.log('Root nodes     -> ',this.getRootNodes());
                console.log('Leaf nodes     -> ',this.getLeafNodes());
                console.log('Isolated nodes -> ',this.getIsolatedNodes());
                console.log('Interior nodes -> ',this.getInteriorNodes());                
            },
            // recursively explores tree to form heirarchical combinations
            traverseInReverse : function(node, txt,i)
            {
              var tnodes = findNode(node);
              txt += tnodes.text+",";
              if(!i){ i=0;
                strOut=[];
              }              
              if(tnodes && tnodes.children)
              { 
                while(tnodes.children[i])
                {
                  this.traverseInReverse(tnodes.children[i], txt, i);
                  
                  i++;           
                }
                strOut.push(txt);
                  txt="";
              }
              if(strOut){
                return strOut;
              }
              else{
                console.log('wtf...');
                console.log(node);
                console.log(txt);
              }
            },
            // TBD
            traverseEachPath : function(nodeKey, pathList) 
            {
              var root = findNode(nodeKey);
              console.log(nodeKey);
              if(!pathList){
                pathList = [];
                pathList.push(root);
              }
              else{
                pathList.push(root);
              }
              
              if(!( root && root.children)){
                console.log(' ANNNND WE ARE DONE WITH A PATH', pathList);                
              } else {
                for(var i = 0; i < root.children.length; i++)
                {
                  console.log('child', root.children[i].text);
                  var x = [];
                  this.traverseEachPath(root.children[i].key);
                }
              }
            },          
            /// Recursively combines string array elements into a single combined string
            aggregateTransforms : function(list,afterFirstTime)
            {
              if(list.length == 1)
              {                
                return list;
              }
              else
              {              
                var size = list.length;
                var idx = 1;
                var newList = [];                                          

                if(!afterFirstTime){
                  for(var index = 0; index < list.length; index++)
                  {
                    list[index] = list[index].replace(/,*$/,"");
                  }
                   list = list[size-1];
                   list = list.split(',');
                }                
                console.log('original list = ',list);                
                idx = 1;                
                while(idx < size)
                {                
                   newList.push(list[idx-1]+'_'+list[idx]);         
                   idx++;
                }                         
                console.log('new list = ', newList);
                console.log('THIS IS WHERE WE WOULD WANT TO CALL TORTOISEPROXY TO RUN THROUGH SUBORDINATE DATA ELEMENTS OF LIST[IDX-1] and LIST[IDX]');
                this.aggregateTransforms(newList,true);
              }
            },
            traverseInOrder : function(node)
            {
            
            },
            // builds a tree our of a scene graph
            buildTree        : function(graph){                        
                var verts = graph.nodes;
                var edges = graph.edges;
                var tmpNode;
                // main logic to build a tree
                for(var i=0;i<verts.length;i++)
                {
                    tmpNode = new TreeNode(verts[i].category);
                    tmpNode.setData(verts[i]);
                    tmpNode.setKey(tmpNode.getData().key);
                    tmpNode.print();
                    insertNode(tmpNode);
                }     
                for(var i=0;i<edges.length;i++)
                {
                    var child  = findNode(edges[i].fromIndex);
                    var parent = findNode(edges[i].toIndex);         
                }  
                nodes = verts;
                this.traverseTree(nodes[0].key,0,0);      
                var t = this.traverseInReverse(nodes[0].key, '');
                this.aggregateTransforms(t);
            }, 
            // updates the tree with a scene graph
            updateTree : function(graph){
              strOut = [];
                var verts = graph.nodes;
                var ed = graph.edges;
                var tmpEdges = ed;
                tmpEdges = ed.reverse();
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
                for(var i=0;i<tmpEdges.length;i++)
                {
                    var child  = findNode(tmpEdges[i].fromIndex);
                    var parent = findNode(tmpEdges[i].toIndex);        
                }  
                nodes = verts;      
            },
            // print the hierarchical transformation
            printTransforms : function(){            
              console.log(strOut);
            },           
            // TBD visit all assets in the tree to get properties
            VisitAssets : function(node) {            
              var groups = this.getGroupNodes();
              for(var i = 0; i < groups.length; i++)
              {
                
              }            
            },        
        };
};
// make our AssetTreeProxy known to the rest of the world
module.exports.AssetTreeProxy = AssetTreeProxy;
