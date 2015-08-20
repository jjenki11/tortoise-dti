// graph object struct

var ObjectManager = function(sock_io)
{
  var sock = sock_io;  
  return {
  
    CreateAtlas : function(sock_io/*path, label, relations, groups*/) {
      
      console.log("ATLAS CREATED??");
      sock_io.emit('atlas', {b: 'hasDongle'});
    
    },
  
    CreateGroup : function(path, label, transforms, subjects) {
    
    
    },
    
    CreateSubject : function(path, label, transforms) {
    
    },
    
    
  };

};
