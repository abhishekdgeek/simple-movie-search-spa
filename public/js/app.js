'use strict';

angular.module('simpleMovieSearchApp', [])
    .directive('whenScrolled', function() {
        // simple directive to check if we are at end of an element.
        return function(scope, element, attr) {
            var raw = element[0];
            element.bind('scroll', function() {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    })
    .controller('SearchController', function($scope, $http, $window) {

        $scope.title = 'Simple Movie Search';
        $scope.tagline = 'Built using OMDB on top of AngularJS';

        // Empty object to store the response from API.
        $scope.searchResults = {};

        // To maintain the count of API.
        $scope.pageNumber = 1;

        // Count of search items from current search.
        $scope.totalResults = 0;

        // Flag to check if any AJAX call is in progress.
        $scope.inProgress = 0;

        // Watch for change in search text input to hit the API.
        $scope.$watch('search', function() {
            if ($scope.search) {
                $scope.fetchData();
            } else {
                $scope.searchResults = {};
            }
        });

        // Uncomment the following to search for some default text.
        // $scope.search = "Batman";

        // function to hit OMDB API and fetch data.
        $scope.fetchData = function(paginate) {
            // @paginate is boolean to check if this is a pagination request.
            if (paginate) {
                $scope.pageNumber++;
            } else {
                $scope.pageNumber = 1;
            }
            $scope.error = 0;
            $http.get("//www.omdbapi.com/?type=movie&s=" + $scope.search + '&page=' + $scope.pageNumber)
                .then(function(response) {
                    // Reset inProgress flag
                    $scope.inProgress = 0;
                    if (paginate) {
                        // Update searchResults with new data from API.
                        $scope.searchResults.Search = $scope.searchResults.Search.concat(response.data.Search);
                    } else {
                        $scope.searchResults = response.data;
                        $scope.totalResults = response.data.totalResults;
                    }
                }, function(error) {
                    $scope.inProgress = 0;
                    $scope.pageNumber--;
                    $scope.error = 1;
                });
        }

        // function to open IMDB link in new tab
        $scope.openImdbLink = function(imdbId) {
            $window.open('http://www.imdb.com/title/' + imdbId, '_blank');
        };


        // function to help in pagination.
        $scope.loadMore = function() { console.log('loadMore')
            if (!$scope.inProgress) {
                $scope.inProgress = 1;
                if ($scope.totalResults / 10 > $scope.pageNumber) {
                    $scope.fetchData(1);
                }
            }
        };
    });
