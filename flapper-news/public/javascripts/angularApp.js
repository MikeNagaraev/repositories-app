var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', ['$scope', 'postsFactory',
    function($scope, postsFactory) {
        $scope.posts = postsFactory.posts;

        $scope.addPost = function() {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            postsFactory.create({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: []
            })
            $scope.title = ''
            $scope.link = ''
        }

        $scope.incrementUpvotes = function(post) {
            postsFactory.upvote(post);
        }
    }
]);

app.controller('PostsCtrl', ['$scope', 'post', 'postsFactory', 'commentsService',
    function($scope, post, postsFactory, commentsService) {
        $scope.post = post;
        $scope.addComment = function() {
            if ($scope.comment === '') {
                return;
            }
            postsFactory.addComment(post._id, {
                    body: $scope.comment,
                    author: 'anonimous',
                    upvotes: 0
                })
                .success(function(comment) {
                    $scope.post.comments.push(comment);
                })
            $scope.comment = ''
        }

        $scope.incrementUpvotes = function(post, comment) {
            commentsService.upvote(post, comment);
        }
    }
]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html',
                controller: 'MainCtrl',
                resolve: {
                    postPromise: ['postsFactory', function(posts) {
                        return posts.getAll();
                    }]
                }
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: 'partials/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    post: ['$stateParams', 'postsFactory', function($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }]
                }
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.service('commentsService', ['$http', function($http) {
    this.upvote = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
            .success(function(data) {
                comment.upvotes += 1;
            })
    }
}])

app.factory('postsFactory', ['$http', function($http) {
    var store = {
        posts: []
    }
    store.getAll = function() {
        return $http.get('/posts').success(function(data) {
            angular.copy(data, store.posts);
        })
    }

    store.get = function(id) {
        return $http.get('/posts/' + id).then(function(res) {
            return res.data;
        })
    }

    store.create = function(post) {
        return $http.post('/posts', post).success(function(data) {
            store.posts.push(data)
        })
    }

    store.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function(data) {
                post.upvotes += 1;
            });
    }

    store.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    }
    return store;
}])
