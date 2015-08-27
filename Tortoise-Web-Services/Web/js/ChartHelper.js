/*

  ChartJS helper

*/


var ChartHelper = function()
{
  var chart;
  
  var init = function(c)
  {  
    chart = c;
  };

  var setChart = function(c)
  {
    init(c);
  };
  
  var removeData = function()
  {
    chart.removeData();
  };

  var addData = function(data)
  {
    chart.addData(data.points, data.label);
    removeData();
  };

 

  return {
    init: init,
    setChart: setChart,
    addData: addData,
    removeData: removeData,
  };
  
};
