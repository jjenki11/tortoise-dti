  var AssetTreeProxy = function( ) {  
  
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
                       
            getRootNodes     : function(){
                var dNodes = nodes;
                var roots = [];
                console.log('in the tree one...', dNodes);
                for(var i = 0; i < dNodes.length; i++)
                {
                    if((dNodes[i].children.length != 0 ) && (dNodes[i].parents.length == 0))
                    {
                        roots.push(dNodes[i]);
                    }
                }            
                root = roots;    
                return roots;
            },
            getLeafNodes     : function(){
                var dNodes = nodes;
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
                var dNodes = nodes;
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
                var dNodes = nodes;
                var interiors = [];
                for(var i = 0; i < dNodes.length; i++)
                {
                    if((dNodes[i].children.length != 0) && (dNodes[i].parents.length != 0))
                    {
                        interiors.push(dNodes[i]);
                    }
                }                
                return interiors;
            },
            
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
            
            getTree          : function(){
                return this;
            },
            
            traverseTree     : function() 
            {               
                console.log('Root nodes     -> ',this.getRootNodes());
                console.log('Leaf nodes     -> ',this.getLeafNodes());
                console.log('Isolated nodes -> ',this.getIsolatedNodes());
                console.log('Interior nodes -> ',this.getInteriorNodes());                
            },
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
            buildTree        : function(graph){      
              console.log(graph);
                        
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
                    console.log('toIndex = ',edges[i].toIndex);
                    console.log('fromIndex = ',edges[i].fromIndex);               
                }  
                nodes = verts;

                this.traverseTree(nodes[0].key,0,0);      
                var t = this.traverseInReverse(nodes[0].key, '');
                
                console.log('we returned ... ',t.reverse());
                this.aggregateTransforms(t); 
                
            }, 
            updateTree : function(graph){
              strOut = [];
              console.log(graph);
              //var x = JSON.parse(g);
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
                    console.log('toIndex = ',tmpEdges[i].toIndex);
                    console.log('fromIndex = ',tmpEdges[i].fromIndex);              
                }  
                console.log('now we want to traverse...');
                nodes = verts;
                //edges = tmpEdges;
                this.traverseTree(nodes[0].key,0,0);    
                  var t = this.traverseInReverse(nodes[0].key, '');
                  this.aggregateTransforms(t.reverse());                 
            },
            printTransforms : function(){
            
              console.log(strOut);
            },           
            
            VisitAssets : function(node) {            
              var groups = this.getGroupNodes();
              for(var i = 0; i < groups.length; i++)
              {
                
              }            
            },        
        };
  };
module.exports.AssetTreeProxy = AssetTreeProxy;
