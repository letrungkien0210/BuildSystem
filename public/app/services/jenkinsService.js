angular.module('jenkinsService',[])
    .factory('Jenkins', function($http){
        var jenkinsFactory = {};

        //Get all jenkins
        jenkinsFactory.getAll = function(){
            return $http.get("jenkins/api/jenkins");
        };

        //Check status jenkins
        jenkinsFactory.checkStatus = function(url){
            return $http({
                method: 'post',
                url: 'jenkins/api/check_status',
                data: { 'url' : url}
            });
        };

        //Add jenkins
        jenkinsFactory.addJenkins = function(data){
            return $http({
                method: 'post',
                url: 'jenkins/api/jenkins',
                data: data,
                header:{
                    'Content-Type': 'application/json'
                }
            });
        };

        //Delete jenkins
        jenkinsFactory.deleteJenkins = function(data){
            return $http({
                method:'delete',
                url: "jenkins/api/jenkins",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
    });