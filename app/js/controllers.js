'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('homeCtrl', [function() {

    }])
    .controller('facilityCtrl', ['$scope', 'facilityService', 'locationService', function($scope, facilityService, locationService) {
        var facilityMap;

        function getFeed() {
            $scope.facilites = [];
            facilityService.getVAFacilities().then(function(data) {
                var facilities = data.results.facilities;

                if($scope.location) {
                    $scope.facilities = _.filter(facilities, function(facility) {
                        return facility.address.indexOf('Los Angeles') > -1;
                    });
                } else {
                    $scope.facilities = facilities;
                }
            });
        }
        $scope.refreshFeed = function() {
            getFeed();
        };

        getFeed();

        $scope.toggleUseMyLocation = function() {
            if($scope.nearMe) {
                locationService.getGeoLocation(function (position) {
                    $scope.location = position;
                    getFeed();
                })
            }
             else {
                $scope.location = undefined;
                getFeed();
            }
        };

        $scope.selectFacility = function(stationId) {
            facilityService.getFacility(stationId).then(function(facility) {
                $scope.facility = facility;
                var mapPoint = [Number(facility.longitude), Number(facility.latitude)];
                var zoomLevel = 16;

                if(!facilityMap) {
                    require([
                        "esri/map",
                        "esri/graphic",

                        "esri/symbols/SimpleMarkerSymbol",
                        "esri/symbols/SimpleLineSymbol",
                        "esri/symbols/SimpleFillSymbol",

                        "dojo/domReady!"
                    ], function (Map, Graphic, SimpleMarkerSymbol) {
                        facilityMap = new Map("facility-map", {
                            center: mapPoint,
                            zoom: zoomLevel,
                            basemap: "streets"
                        });

                        //var graphic = new Graphic(evt.geometry, symbol);
                        //map.graphics.add(graphic);
                    });
                }
                else {
                    facilityMap.centerAt(mapPoint);
                }
            });
        }

    }])
    .controller('jobCtrl', [function() {

    }]);