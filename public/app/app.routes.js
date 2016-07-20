angular.module('app.routes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/index.html',
                controller: 'jenkinController'
            })
            .when('/all_jobs', {
                templateUrl: 'app/views/alljobs.html',
                controller: 'jobController'
            })
            .when('/vms', {
                templateUrl: 'app/views/vms.html',
                controller: 'vmController'
            })
            .otherwise({ redirectTo: '/' });

        //get rid of the hash in the URL
        $locationProvider.html5Mode(true);
    });