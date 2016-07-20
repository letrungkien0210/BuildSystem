var app = angular.module('buildSystemApp', [
  'app.routes'
]);


app.controller('jenkinController', function ($scope, $q, $location, $http, $window) {
  $scope.message = 'Jenkins Hosts';
  $scope.jenkinChecked = [];

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.url();
  };

  $http.get("jenkins/api/jenkins").then(function (response) {
    $scope.jenkins = response.data;
    checkStatus();
  });

  var checkStatus = function () {
    if ($scope.jenkins) {

      $scope.jenkins.forEach(function (item) {
        item.processing = true;
        $http({
          method: 'post',
          url: 'jenkins/api/check_status',
          data: { 'url': item.url }
        }).then(function successCallback(response) {
          item.processing = false;
          item.urlStatus = response.data.message;
        }, function errorCallbackresponse(response) {
          item.obj = response;
        });
      });
    }
  }

  $scope.checkStatus = checkStatus;

  $scope.addJenkin = function () {
    $http({
      method: "POST",
      url: "jenkins/api/jenkins",
      data: angular.toJson($scope.form),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      $window.location.reload();
    });;
  };

  $scope.deleteJenkin = function () {

    $scope.jenkinChecked.forEach(function (item) {
      if (item.value == true) {
        var index = $scope.jenkins.indexOf(item.jenkin);
        $scope.jenkins.splice(index, 1);

        $http({
          method: "delete",
          url: "jenkins/api/jenkins",
          data: angular.toJson($scope.jenkins),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          $window.location.reload();
        });
      }
    });
  }

});

app.controller('jobController', function ($scope, $location, $http) {
  $scope.message = 'All jobs';
  $scope.jenkinslabel = 'Select Jenkins';
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  $http.get("jenkins/api/jenkins").then(function (response) {
    $scope.jenkins = response.data;
  });

  $scope.selectJenkin = function (jenkinName) {
    $scope.jenkinslabel = jenkinName;
    $http({
      method: 'post',
      url: 'jenkins/api/jobs',
      data: { 'jenkinName': jenkinName }
    }).then(function (response) {
      $scope.jobs = response.data;

      $scope.jobs.forEach(function (item) {
        item.processing = true;
        $http({
          method: 'post',
          url: 'jenkins/api/jobs/computer',
          data: {
            'url': item.url
          }
        }).then(function successCallback(response) {
          item.processing   = false;
          item.computer     = response.data.buildOn;
          item.fingerprint  = response.data.fingerprint;
        }, function errorCallbackresponse(response) {
          item.computer = 'Error';
        });
      });
    });
  };

  $scope.getComputer = function () {
    if ($scope.jobs) {

    }
  }


});

app.controller('vmController', function ($scope, $location, $http) {
  $scope.message = 'VMs';
  $scope.jenkinslabel = 'Select Jenkins';
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  $http.get("jenkins/api/jenkins").then(function (response) {
    $scope.jenkins = response.data;
  });

  $scope.selectJenkin = function (jenkinName) {
    $scope.jenkinslabel = jenkinName;
    $http({
      method: 'post',
      url: 'jenkins/api/computers',
      data: { 'jenkinName': jenkinName }
    }).then(function (response) {
      $scope.computers = response.data;
    });
  };


});