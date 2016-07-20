angular.module('computerService',[])
    .factory('Computer', function($http){
        var computerFactory =  {};

        computerFactory.getAll = function(jenkinsName){
            return $http({
                method: 'post',
                url: 'jenkins/api/computers',
                data: { 'jenkinName': jenkinName }
            });
        };

        
    });