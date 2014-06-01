'use strict';

/* Directives */


angular.module('myApp.directives', [])
    .directive('collapsible', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attributes){
                $(element).collapse();
            }
        }
    });
