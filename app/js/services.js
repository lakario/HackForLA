'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .factory('locationService', function() {
        return {
            getGeoLocation: function (callback, errorFieldElement) {
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
        }
    })
    .factory('facilityService', function($http, $q) {
        return {
            getVAFacilities: function () {
                // california only
                var url = 'http://www.kimonolabs.com/api/b6bm62gq?apikey=fb6025139ed2bf26e678a7559b7ca1c6&callback=JSON_CALLBACK';
                // all
                //var url = 'http://localhost:8000/data/facilities.json';
                var deferred = $q.defer();

                $http.jsonp(url)
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject(data, status);
                    });

                return deferred.promise;
            }
            , getFacility: function (stationId) {
                var url = 'http://localhost:8000/data/facilities.json';
                var deferred = $q.defer();

                $http.get(url)
                    .success(function (data, status, headers, config) {
                        var result = _.find(data.facilities, function(facility) {
                            return facility.station_id == stationId;
                        });
                        deferred.resolve(result);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject(data, status);
                    });

                return deferred.promise;
            }
        };
    })
    .factory('jobService', function($http, $q){
        return {
            getJobSearch: function(keyword, latLong){
                var url = "";
                if(latLong){
                    url = 'http://api.usa.gov/jobs/search.json?query=jobs&lat_lon=' + latLong + '&callback=JSON_CALLBACK'
                }else {
                    url = 'http://api.usa.gov/jobs/search.json?query=' + window.encodeURI(keyword) + "&callback=JSON_CALLBACK"
                }
                var deferred = $q.defer();

                $http.jsonp(url)
                    .success(function (data, status, headers, config){
                        deferred.resolve(data)
                    })
                    .error(function (data, status, headers, config){
                       deferred.reject(data, status);
                    });
                return deferred.promise;
            }
        }
    })
    .factory('utilityService', function($http, $q) {
        return {
            getUtilities: function () {
                var url = 'http://localhost:8000/data/utilities.json';
                var deferred = $q.defer();

                $http.get(url)
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject(data, status);
                    });

                return deferred.promise;
            }
        };
    })
