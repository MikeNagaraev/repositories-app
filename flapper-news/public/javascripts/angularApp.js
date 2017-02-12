var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', ['$scope', 'auth', 'postsFactory',
    function($scope, auth, postsFactory) {
        $scope.posts = postsFactory.posts;
        $scope.isLoggedIn = auth.isLoggedIn;
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

app.controller('PostsCtrl', ['$scope', 'auth', 'post', 'postsFactory', 'commentsService',
    function($scope, auth, post, postsFactory, commentsService) {
        $scope.post = post;
        $scope.isLoggedIn = auth.isLoggedIn;
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

app.controller('AuthCtrl', ['$scope', '$state', 'auth',
    function($scope, $state, auth) {
        $scope.user = {};

        $scope.register = function() {
            auth.register($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function() {
                $state.go('home')
            })
        };

        $scope.logIn = function() {
            auth.logIn($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function() {
                $state.go('home');
            })
        }
    }
]);

app.controller('NavCtrl', ['$scope', 'auth',
    function($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
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
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: 'partials/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.service('commentsService', ['$http', 'auth', function($http, auth) {
    this.upvote = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        }).success(function(data) {
            comment.upvotes += 1;
        })
    }
}])


app.factory('auth', ['$http', '$window', function($http, $window) {
    var auth = {};

    auth.saveToken = function(token) {
        $window.localStorage['app-auth-token'] = token;
    }

    auth.getToken = function() {
        return $window.localStorage['app-auth-token'];
    }

    auth.isLoggedIn = function() {
        var token = auth.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]))
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    auth.currentUser = function() {
        if (auth.isLoggedIn) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    }

    auth.register = function(user) {
        return $http.post('/register', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function() {
        $window.localStorage.removeItem('app-auth-token');
    };

    return auth;
}])

app.factory('postsFactory', 'auth', ['$http', function($http, auth) {
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
        return $http.post('/posts', post, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        }).success(function(data) {
            store.posts.push(data)
        })
    }

    store.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote', null, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        }).success(function(data) {
            post.upvotes += 1;
        });
    }

    store.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
        });
    }
    return store;
}])
