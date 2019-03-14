var app = angular.module('app', ['ngRoute', 'ngAnimate', 'firebase']);

//GLOBAL ID ARRAY
var S_IDS = [];
var T_IDS = [];

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCUv8EmWnItWr9P6b9IxKfifJBa_X8ez84",
    authDomain: "visual-ticket-board.firebaseapp.com",
    databaseURL: "https://visual-ticket-board.firebaseio.com",
    projectId: "visual-ticket-board",
    storageBucket: "visual-ticket-board.appspot.com",
    messagingSenderId: "432045164475"
  };
  firebase.initializeApp(config);

  // $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('');

  $routeProvider
  // link: /#!/angularjs/home
  .when('/', {
    templateUrl: 'cube.html'
  })
  .when('/vtb', {
    templateUrl: 'vtb.html',
    controller: 'vtbController'
  })
  .when('/vtb/add*', {
    templateUrl: 'vtb.html',
    controller: 'vtbController'
  })
  .when('/vtb/update*', {
    templateUrl: 'vtb.html',
    controller: 'vtbController'
  })
  .when('/vtb/remove*', {
    templateUrl: 'vtb.html',
    controller: 'vtbController'
  })
  .otherwise({
    redirectTo: '/'
  });

}]);

app.controller('vtbController', ['$scope', '$http', '$firebaseObject', function($scope, $http, $firebaseObject){

  var ref = firebase.database().ref();
  var obj = $firebaseObject(ref);

  obj.$bindTo($scope, "board").then(function(){
    if($scope.board.sections == null){
      $scope.board = {
            _id: 'b999',
            title: '',
            sections: [{
              _id: getSectionId(),
              title: '',
              tickets: [{
                _id: getTicketId(),
                title: '',
                details: ''
              }]
            }]
          };
    };
    ref.set($scope.board);
  });

  $scope.addTicket = function(){
    var sectionId;
    var eventTarget = $(event.target);
    if(event.target.tagName.toLowerCase() == 'i'){
      sectionId = eventTarget.parent().parent().attr('id');
    }
    else{
      sectionId = eventTarget.parent().attr('id');
    }
    var index = $scope.board.sections.map(function(e){return e._id.toString();}).indexOf(sectionId);
    $scope.board.sections[index].tickets.push({
      _id: getTicketId(),
      title: '',
      details: ''
    });
  };

  $scope.addSection = function(){
    $scope.board.sections.push({
      _id: getSectionId(),
      title: '',
      tickets: [{
        _id: getTicketId(),
        title: '',
        details: ''
      }]
    });
  };

  $scope.update = function(){
    var ticketId;
    var sectionId;
    var eventTarget = $(event.target);
    var reqType = eventTarget.attr("class").toString();
    var updatedText = eventTarget[0].value;
    sectionId = eventTarget.parent().parent().attr('id');
    var sectionIndex = $scope.board.sections.map(function(e){return e._id.toString();}).indexOf(sectionId);

    //update board title
    if(reqType.includes('board')){
      $scope.board.title = updatedText;
    }
    //update section title
    if(reqType.includes('section')){
      $scope.board.sections[sectionIndex].title = updatedText;
    }
    //update ticket title/details
    if(reqType.includes('ticket')){
      ticketId = eventTarget.parent().attr('id');
      var ticketIndex = $scope.board.sections[sectionIndex].tickets.map(function(e){return e._id.toString();}).indexOf(ticketId);

      if(reqType.includes('title')){
        $scope.board.sections[sectionIndex].tickets[ticketIndex].title = updatedText;
      }
      else if(reqType.includes('description')){
        $scope.board.sections[sectionIndex].tickets[ticketIndex].details = updatedText;
      }
    }
  }

  $scope.removeTicket = function(){
    var ticketId;
    var sectionId;
    var eventTarget = $(event.target);
    if(event.target.tagName.toLowerCase() == 'i'){
      ticketId = eventTarget.parent().parent().parent().attr('id');
      sectionId = eventTarget.parent().parent().parent().parent().attr('id');
    }
    else{
      ticketId = eventTarget.parent().parent().attr('id');
      sectionId = eventTarget.parent().parent().parent().attr('id');
    }
    var sectionIndex = $scope.board.sections.map(function(e){return e._id.toString();}).indexOf(sectionId);
    if($scope.board.sections[sectionIndex].tickets.length > 1){
      var ticketIndex = $scope.board.sections[sectionIndex].tickets.map(function(e){return e._id.toString();}).indexOf(ticketId);
      $scope.board.sections[sectionIndex].tickets.splice(ticketIndex, 1);
    }
    else{
      alert('Need at least 1 ticket on the board...');
    }
  }

  $scope.removeSection = function(){
    var sectionId;
    var eventTarget = $(event.target);
    if(event.target.tagName.toLowerCase() == 'i'){
      sectionId = eventTarget.parent().parent().parent().attr('id');
    }
    else{
      sectionId = eventTarget.parent().parent().attr('id');
    }

    var index = $scope.board.sections.map(function(e){return e._id.toString();}).indexOf(sectionId);
    $scope.board.sections.splice(index, 1);
  }

}]);

function getTicketId(){
  var id = 't' + Math.floor(Math.random() * 1000);
  while(T_IDS.toString().includes(id)){
    id = 't' + Math.floor(Math.random() * 1000);
  }
  return id;
};

function getSectionId(){
  var id = 's' + Math.floor(Math.random() * 1000);
  while(S_IDS.toString().includes(id)){
    id = 's' + Math.floor(Math.random() * 1000)
  }
  return id;
}
