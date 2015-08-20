/*

    This is the js file to load the embedded forum

*/

var EmbeddedForum = function()
{
    return {
        content : function(){
            //var html = '<object style="overflow:hidden;width:100%;height:800px;min-height:101%" width=100% height=800px data=http://tortoisedti.prophpbb.com/> </object>';
            var html = '<iframe src="http://tortoisedti.prophpbb.com/"  width="100%" height="700px" scrolling="yes" frameborder="0"></iframe>';
            return html;
        },
    };
};
