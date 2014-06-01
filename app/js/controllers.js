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
                            basemap: "streets",
                            isScrollWheelZoom: false
                        });

                        facilityMap.disableScrollWheelZoom();

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
                topPadding = 65;

            $window.scroll(function() {
                if($window.width() > 768) {
                    if ($window.scrollTop() > offset.top) {
                        $sidebar.stop().animate({
                            marginTop: $window.scrollTop() - offset.top + topPadding
                        });
                    } else {
                        $sidebar.stop().animate({
                            marginTop: 0
                        });
                    }
                }
                else {
                    $sidebar.css({marginTop: 0});
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
        $scope.applSubmit = function(){
            $scope.sent = true;
        }
    }])
    .controller('utilitiesCtrl', ['$scope','utilityService','$timeout', function($scope, utilityService, $timeout) {
        utilityService.getUtilities().then(function(data) {
            $scope.utilities = data.utilities;
        });

        $scope.$watch('utilCompany', function(newVal, oldVal) {
            if(newVal != oldVal) {
                $scope.showPaymentForm = false;
            }
            showSpinner();
        });

        $scope.$watch('accountNbr', function(newVal, oldVal) {
            if(newVal != oldVal) {
                $scope.showPaymentForm = false;
            }
            showSpinner();
        });

        $scope.$watch('lastName', function(newVal, oldVal) {
            if(newVal != oldVal) {
                $scope.showPaymentForm = false;
            }
            showSpinner();
        });

        $scope.gotAccount = false;
        $scope.loadingTimeout = undefined;

        function showSpinner() {
            if($scope.utilCompany
                && $scope.accountNbr && $scope.accountNbr.length > 4
                && $scope.lastName && $scope.utilCompany.length > 4) {
                $scope.showSpinner = true;

                if($scope.loadingTimeout) {
                    $timeout.cancel($scope.loadingTimeout);
                }
                $scope.loadingTimeout = $timeout(function() {
                    var rand = Math.floor((Math.random() * 4) + 1);

                    $scope.showSpinner = false;

                    if(!$scope.gotAccount || rand % 2 == 0) {
                        $scope.accountNotFound = false;
                        $scope.showPaymentForm = true;
                        $scope.gotAccount = true;
                    }
                    else {
                        $scope.accountNotFound = true;
                    }
                }, 500);
            }
        }

        $scope.$watch('showPaymentForm', function(newVal, oldVal) {
            if(newVal != oldVal) {
                var month = Math.floor((Math.random() * 12) + 1);
                var day = Math.floor((Math.random() * 30) + 1);
                $scope.billingPeriod = month + "/" + day + "/14-" + (month + 1) + "/" + day + "/14"
                $scope.billingDue = Math.floor((Math.random() * 85) + 15) + Math.random();
            }
        })
    }]);