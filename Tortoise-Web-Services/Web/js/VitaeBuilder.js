var VitaeBuilder = function()
 {
        var referenceObject = function()
        {
            var authors = [];
            var title = "";
            var year = "";
            var journal = "";
            var pages = {start: 0, end: 0};
            
            return {
            
                addAuthor : function(auth){this.authors.push(auth);},
                getAuthors: function(){return this.authors;},
                setTitle : function(tit){this.title = tit;},
                getTitle : function(){return this.title;},
                setPubYear : function(yr){this.year = yr;},
                getPubYear : function(){return this.year;},
                setJournal : function(jou){this.journal = jou;},
                setPages: function(start, end){this.pages.start = start;this.pages.end = end;},
                getPages: function(){return this.pages;},
                parseReference : function(str) {
                    var obj = {
                        text : str
                    };
                    return obj;
                }
            };  
        };
                
        var member;
        var references = [];

        return {
            setMember : function(mem){this.member = mem;},
            getMember: function(){return this.member;},
            addReference : function(refString){
                var ref = new referenceObject();
                ref.parseReference(refString);
                this.references.push(ref);
            },
            getReferences : function(){return this.references;},
        };
 };
