'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('encodeURIComponent', [function() {
    return window.encodeURIComponent;
  }]);
