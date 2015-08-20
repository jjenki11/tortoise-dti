//profile

var userProfile = function(){

  var userParams = {
    images: 0,
    personalImage: "images/scream.jpg",
    interStimulus: 1000, //ms
    intraStimulus: 1000, //ms
    name: "?",
    age: "?",
    gender: "?",
    devices: ["keyboard", "mouse", "emotiv"],
  };
  
  var profileData = {    
    auth: {
      username: "",
      password: ""
    },
    userData: {
      name: {first: "", last: ""},
      birthday: {year: "", month: "", day: ""},
      gender: "",
      email: "test@cua.edu"
    },
    experimentData: {
      vehicleImage: {url: ""},
      animalImage : {url: ""},
      sceneryImage: {url: ""},
      grandmaImage: {url: ""}    
    }
    
  };
  
  var getData = function(){
    return profileData;
  };
  
  var setUserData = function(data){
    profileData.userData = data;
  };
  
  var setExperimentData = function(data, imgType){
    if(imgType=='vehicle'){
      profileData.experimentData.vehicleImage.url = data;
    }
    if(imgType=='animal'){
      profileData.experimentData.animalImage.url = data;
    }
    if(imgType=='scenery'){
      profileData.experimentData.sceneryImage.url = data;
    }
    
    profileData.experimentData = data;
  };
  
  return {
    setUserData:setUserData,
    setExperimentData:setExperimentData,
    getData:getData,
  };
};
