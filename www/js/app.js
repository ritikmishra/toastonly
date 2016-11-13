// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('starter', ['ionic'])

ionicApp.controller('MyController', ['$scope', function($scope){
  $scope.toasts = [{image: "http://the-toast.net/wp-content/uploads/2016/03/toast-1077984_1920.jpg"},
                  {image: "https://www.ahealthiermichigan.org/wp-content/uploads/2014/09/Transform-toast-into-breakfast.jpg"},
                {image: "http://www.jpband.com/wp-content/uploads/2009/10/toast.jpg"},
                {image: "http://chicago-toast.com/img/big-toast-img.png"},
                {image: "https://hamfistedtales.files.wordpress.com/2016/07/toast.jpg"}]
}])

function openAttachment() {
  document.getElementById('attachment').click();
}

function fileSelected(input){
  //document.getElementById('btnAttachment').value = "File: " + input.files[0].name
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
