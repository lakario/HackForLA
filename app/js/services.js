'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
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
