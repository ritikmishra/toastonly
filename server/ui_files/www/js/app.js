// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('starter', ['ionic'])

ionicApp.controller('MyController', ['$scope', function($scope){

  $scope.http = new XMLHttpRequest();
  $scope.url = "http://localhost:5000/toast.json";
  $scope.params;
  $scope.http.open("GET", $scope.url, true);
  $scope.http.onreadystatechange = function() {//Call a function when the state changes.
      if($scope.http.readyState == 4 && $scope.http.status == 200) {
          $scope.y = JSON.parse($scope.http.responseText);
          $scope.toasts = $scope.y.images
          console.log($scope.toasts)
      }
  }
  $scope.http.send($scope.params);


}])

function openAttachment() {
  document.getElementById('attachment').click();
}

function fileSelected(input){
  document.getElementById("uploadForm").submit()
}

ionicApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
