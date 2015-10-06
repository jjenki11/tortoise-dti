/*
 *   Data structure containing user information for website:
 *      - image
 *      - phone
 *      - name
 *      - email
 *      - personal page
 *      - references
 */
 
 var LabMember = function()
 {
        var image       = "";
        var name        = "";
        var phone       = "";
        var email        = "";
        var page         = "";
        var refs           = [];
        return {
            setImage : function(img){this.image = img;},
            setName : function(nam){this.name = nam;},
            setPhone : function(pho){this.phone = phone;},
            setEmail : function(eml){this.email = eml;},
            setHomepage : function(hp){this.page = hp;},
            setRefs : function(rfs){this.refs = rfs;},
            addRef : function(ref){this.refs.push(ref);},
            getImage : function(){return this.image;},
            getName : function(){return this.name;},
            getPhone : function(){return this.phone;},
            getEmail : function(){return this.email;},
            getPage : function(){return this.page;},
            getRefs : function(){return this.refs;},
        };
 };
