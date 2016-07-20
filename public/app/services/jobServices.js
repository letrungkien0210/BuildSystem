angular.module('jobServices', [])
.factory('Job', function($http){

    var jobFactory = {};

    jobFactory.getAll = function (jenkinsName) {
        return $http({
            method: 'post',
            url: 'jenkins/api/jobs',
            data: { 'jenkinName': jenkinName }
        });
    }

    jobFactory.getComputersOfJob = function(urlJob){
        return $http({
            method: 'post',
            url: 'jenkins/api/jobs/computer',
            data: {'url': urlJob}
        });
    };
});