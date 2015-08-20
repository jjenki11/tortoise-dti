

var SiteAPI = function()
{
    var mri_view = null;
    return {
        init: function(){
            console.log("we are in the setup stuffs");
            return ("omg its Tortoise DTI!");
        },
        fullViewer: function(){
            mri_view = $('<button>View Fullscreen MRI</button>');      
            mri_view.click(function() {
                console.log("coolio");
                window.location = "js/papaya/Papaya-master/build/index.html";
            });
            return mri_view;
        },
        embeddedViewer: function(){
            mri_view = $('<button>View Embedded MRI</button>');
            mri_view.click(function() {            
                window.location = "js/papaya/Papaya-master/build/index_small.html";
            });
            return mri_view;        
        },
    };
};
