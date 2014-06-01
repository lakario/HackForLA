'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller('vaFacilitiesCtrl', ['$scope', 'facilitiesService', function($scope, facilitiesService) {

        function getFeed() {
            $scope.facilites = [];
            facilitiesService.getVAFacilities().then(function(data) {
                $scope.facilities = data.results.facilities;
            });
        }
        $scope.refreshFeed = function() {
            getFeed();
        };

        getFeed();

    }])
    .controller('MyCtrl2', [function() {

    }]);