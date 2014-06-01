'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('homeCtrl', ['$scope','jobService', function($scope, jobService) {
        $scope.jobSearch = function(keyword, latLong){
            $scope.jobs = [];
            jobService.getJobSearch(keyword, latLong).then(function(data){
                $scope.jobs = data;
            });
        };

        $scope.getGeoLocation = function (callback, errorFieldElement) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    if (callback && typeof callback === 'function') {
                        callback.call(this, position);
                    }
                }, function (error) {
                    var errorMsg;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg = "Request for geolocation was denied."
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMsg = "The request to get location timed out.";
                            break;
                        default:
                            errorMsg = "An unknown error occurred.";
                            break;
                    }
                    $(errorFieldElement).text(errorMsg);
                });
            } else {
                $(errorFieldElement).text('Your device does not support location services.');
            }
        }
        $scope.getGeoLocation(function(position){
            $scope.latLong = position.coords.latitude + "," + position.coords.longitude;
        });
    }])
    .controller('facilityCtrl', ['$scope', 'facilityService', function($scope, facilityService) {

        function getFeed() {
            $scope.facilites = [];
            facilityService.getVAFacilities().then(function(data) {
                $scope.facilities = data.results.facilities;
            });
        }
        $scope.refreshFeed = function() {
            getFeed();
        };

        getFeed();

    }])
    .controller('jobCtrl', ['$scope','jobService', function($scope, jobService) {
        $scope.jobSearch = function(keyword){
            $scope.jobs = [];
            jobService.getJobSearch(keyword).then(function(data){
               $scope.jobs = data;
            });
        };
    }]);