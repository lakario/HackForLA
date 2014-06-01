'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('homeCtrl', [function() {

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
    .controller('jobCtrl', [function() {

    }]);