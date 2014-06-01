'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .factory('facilitiesService', function($http, $q) {
        return {
            getVAFacilities: function () {
                var url = 'http://www.kimonolabs.com/api/b6bm62gq?apikey=fb6025139ed2bf26e678a7559b7ca1c6&callback=JSON_CALLBACK';
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
