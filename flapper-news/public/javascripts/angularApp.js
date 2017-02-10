var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', ['$scope', 'postsFactory',
    function($scope, postsFactory) {
        $scope.posts = postsFactory.posts;
        $scope.addPost = function() {
            postsFactory.addPost($scope.title, $scope.link)
            $scope.title = ''
            $scope.link = ''
        }
        $scope.incrementUpvotes = function(post) {
            postsFactory.incrementUpvotes(post);
        }
    }
]);

app.controller('PostsCtrl', ['$scope', '$stateParams', 'postsFactory',
    function($scope, $stateParams, postsFactory) {
        $scope.post = postsFactory.posts[$stateParams.id];
        $scope.addComment = function() {
            postsFactory.addComment($scope.post, $scope.comment)
            $scope.comment = ''
        }
        $scope.incrementUpvotes = function(comment) {
            postsFactory.incrementUpvotes(comment);
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
                // controllerAs: 'X'
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: 'partials/posts.html',
                controller: 'PostsCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('postsFactory', function() {
    var store = {}
    store.posts = [{
            title: 'post1',
            upvotes: 5,
            comments: [{
                    author: 'Joe',
                    body: 'Cool post!',
                    upvotes: 0
                },
                {
                    author: 'Bob',
                    body: 'Great idea but everything is wrong!',
                    upvotes: 0
                }
            ]
        },
        {
            title: 'post2',
            upvotes: 5,
            comments: [{
                    author: 'Joe',
                    body: 'Cool post!',
                    upvotes: 0
                },
                {
                    author: 'Bob',
                    body: 'Great idea but everything is wrong!',
                    upvotes: 0
                }
            ]
        },
        {
            title: 'post3',
            upvotes: 2,
            comments: [{
                    author: 'Joe',
                    body: 'Cool post!',
                    upvotes: 0
                },
                {
                    author: 'Bob',
                    body: 'Great idea but everything is wrong!',
                    upvotes: 0
                }
            ]
        },
        {
            title: 'post4',
            upvotes: 3,
            comments: [{
                    author: 'Joe',
                    body: 'Cool post!',
                    upvotes: 0
                },
                {
                    author: 'Bob',
                    body: 'Great idea but everything is wrong!',
                    upvotes: 0
                }
            ]
        },
        {
            title: 'post5',
            upvotes: 5,
            comments: [{
                    author: 'Joe',
                    body: 'Cool post!',
                    upvotes: 0
                },
                {
                    author: 'Bob',
                    body: 'Great idea but everything is wrong!',
                    upvotes: 0
                }
            ]
        },
    ]

    store.addPost = function(title, link) {
        if (!title || title === '') {
            return;
        }
        store.posts.push({
            title: title,
            link: link,
            upvotes: 0,
            comments: [{
                    author: 'Joe',
                    body: 'Cool post!',
                    upvotes: 0
                },
                {
                    author: 'Bob',
                    body: 'Great idea but everything is wrong!',
                    upvotes: 0
                }
            ]
        })
    }

    store.addComment = function(post, comment) {
        if (comment === '') {
            return;
        }
        post.comments.push({
            author: 'Mikhail',
            body: comment,
            upvotes: 0
        })
    }

    store.incrementUpvotes = function(item) {
        item.upvotes += 1;
    }

    return store;
})
