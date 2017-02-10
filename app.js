var app = angular.module('flapperNews', ['ui.router']);


app.controller('MainCtrl',
    function($scope, postsFactory) {
        this.scope = $scope;
        this.posts = postsFactory.posts;
        this.addPost = function() {
            postsFactory.addPost(this.title, this.link)
            this.title = ''
            this.link = ''
        }.bind(this);
        this.incrementUpvotes = function(post) {
            this.scope.$applyAsync(function() { //digest async
              postsFactory.incrementUpvotes(post);
            })
        }.bind(this);
    }
);

// app.controller('PostsCtrl',
//     function($scope, $stateParams, postsFactory) {
//       $scope.post = postsFactory.posts[$stateParams.id];
//       $scope.addComment() = function() {
//         yst
//       }
//     }
// );

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                controllerAs: 'X'
            })
        // .state('posts', {
        //     url: '/posts/{id}',
        //     templateUrl: '/posts.html',
        //     controller: 'PostsCtrl'
        // });

        $urlRouterProvider.otherwise('home');
    }
]);

// app.factory('commentsFactory', function() {
//
// })

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
