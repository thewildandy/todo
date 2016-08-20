const electron = require('electron').remote.app
const fs = require('fs')
const app = angular.module('todo', [])

app.controller('TodoController', function ($scope) {

  $scope.loaded = false

  $scope.tasks = [];

  $scope.initialise = function () {
    let path = electron.getPath('userData') + '/data.json'
    let data = fs.readFile(path, 'utf-8', function (err, data) {
      $scope.$apply(function () {
        $scope.tasks = angular.fromJson(data)
        $scope.loaded = true
      })
    })
  }

  $scope.createTask = function () {
    let title = $scope.newTask
    if(title == undefined)
      return

    $scope.tasks.push({ title: $scope.newTask, done: false })
    $scope.newTask = null
    updateStorage()
  }

  $scope.completeTask = function (task) {
    task.done = true
    updateStorage()
  }

  const updateStorage = function () {
    let path = electron.getPath('userData') + '/data.json'
    let data = angular.toJson($scope.tasks)
    fs.writeFile(path, data, function (err) {
      if(err) {
        alert('something horrible happened')
      }
    })
  }
})

app.directive('onKeyPress', function () {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      $element.bind('keypress', function (event) {
        var keyPressed = event.which || event.keyCode
        if(keyPressed == $attrs.keyCode) {
          $scope.$apply(function () {
            $scope.$eval($attrs.onKeyPress, {$event: event})
          })
        }
      })
    }
  }
})
