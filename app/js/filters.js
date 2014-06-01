'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('encodeURI', [function() {
    return window.encodeURI;
  }]);
