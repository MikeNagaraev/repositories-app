var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl',
    function($scope, postsFactory) {
        $scope.posts = postsFactory.posts;
        $scope.addPost = function() {
            postsFactory.addPost($scope.title, $scope.link)
            $scope.title = ''
            $scope.link = ''
        }
        $scope.incrementUpvotes = function(post) {
            postsFactory.incrementUpvotes(post)
        };
    }
);

app.controller('PostsCtrl',
    function($scope, $stateParams, postsFactory) {
      $scope.post = postsFactory.posts[$stateParams.id];
    }
);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('postsFactory', function() {
    var store = {}
    store.posts = [{
            title: 'post1',
            upvotes: 5
        },
        {
            title: 'post2',
            upvotes: 5
        },
        {
            title: 'post3',
            upvotes: 2
        },
        {
            title: 'post4',
            upvotes: 3
        },
        {
            title: 'post5',
            upvotes: 5
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
    store.incrementUpvotes = function(post) {
        post.upvotes += 1;
    }
    return store;
})
