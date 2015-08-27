  function sampleView(opt1, opt2){
  
    //$("#mySavedModel").hide();
    if(opt1 !== null)
    {    
      myDiagram.isModified = false;
      var x = myDiagram.model.nodeDataArray;
      x.push(opt1);
      myDiagram.model.nodeDataArray = x;
      console.log('new Data Added added');
      myDiagram.isModified = true;      
    }
    else
    {
      myDiagram.model.nodeDataArray = [
        {"category":"Comment", "loc":"360 -10", "text":"Kookie Brittle", "key":-13},
        {"key":-1, "category":"Start", "loc":"175 0", "text":"Start"},
        {"key":0, "loc":"0 77", "text":"Preheat oven to 375 F"},
        {"key":1, "loc":"175 100", "text":"In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"},
        {"key":2, "loc":"175 190", "text":"Gradually beat in 1 cup sugar and 2 cups sifted flour"},
        {"key":3, "loc":"175 270", "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"},
        {"key":4, "loc":"175 370", "text":"Press evenly into ungreased 15x10x1 pan"},
        {"key":5, "loc":"352 85", "text":"Finely chop 1/2 cup of your choice of nuts"},
        {"key":6, "loc":"175 440", "text":"Sprinkle nuts on top"},
        {"key":7, "loc":"175 500", "text":"Bake for 25 minutes and let cool"},
        {"key":8, "loc":"175 570", "text":"Cut into rectangular grid"},
        {"key":-2, "category":"End", "loc":"175 640", "text":"Enjoy!"}
      ];
    }
    if(opt2)
    {
      myDiagram.isModified = false;
      var x = [];
      x =myDiagram.model.linkDataArray;
      x.push(opt2);
      myDiagram.model.linkDataArray = x;
      console.log('new Data Added');
      myDiagram.isModified = true;
      
      save();
      load();
    }
    
    else
    {
    setTimeout(function(){
    myDiagram.model.linkDataArray = [
      {"from":1, "to":2, "fromPort":"B", "toPort":"T"},
      {"from":2, "to":3, "fromPort":"B", "toPort":"T"},
      {"from":3, "to":4, "fromPort":"B", "toPort":"T"},
      {"from":4, "to":6, "fromPort":"B", "toPort":"T"},
      {"from":6, "to":7, "fromPort":"B", "toPort":"T"},
      {"from":7, "to":8, "fromPort":"B", "toPort":"T"},
      {"from":8, "to":-2, "fromPort":"B", "toPort":"T"},
      {"from":-1, "to":0, "fromPort":"B", "toPort":"T"},
      {"from":-1, "to":1, "fromPort":"B", "toPort":"T"},
      {"from":-1, "to":5, "fromPort":"B", "toPort":"T"},
      {"from":5, "to":4, "fromPort":"B", "toPort":"T"},
    ];    
    }, 400);
    
      console.log('links added');
    }
  };
