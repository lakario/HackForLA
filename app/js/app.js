'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeCtrl'});
    $routeProvider.when('/facilities', {templateUrl: 'partials/facilities.html', controller: 'facilityCtrl'});
    $routeProvider.when('/facility:facilityId', {templateUrl: 'partials/facility.html', controller: 'facilityCtrl'});
    $routeProvider.when('/jobs', {templateUrl: 'partials/jobs.html', controller: 'jobCtrl'});
    $routeProvider.when('/job:jobId', {templateUrl: 'partials/job.html', controller: 'jobCtrl'});
    $routeProvider.when('/bene', {templateUrl: 'partials/beneappl.html', controller: 'jobCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);
