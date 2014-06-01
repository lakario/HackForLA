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
            $scope.facility = undefined;

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


        $(function() {
            var $sidebar   = $("#facility-details"),
                $window    = $(window),
                offset     = $sidebar.offset(),
                topPadding = 40;

            $window.scroll(function() {
                if ($window.scrollTop() > offset.top) {
                    $sidebar.stop().animate({
                        marginTop: $window.scrollTop() - offset.top + topPadding
                    });
                } else {
                    $sidebar.stop().animate({
                        marginTop: 0
                    });
                }
            });

        });

    }])
    .controller('jobCtrl', ['$scope','jobService', function($scope, jobService) {
        $scope.jobSearch = function(keyword){
            $scope.jobs = [];
            jobService.getJobSearch(keyword).then(function(data){
               $scope.jobs = data;
            });
        };
    }]);