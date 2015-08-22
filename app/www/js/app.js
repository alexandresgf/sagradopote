angular.module('pizzayolo', ['ionic', 'ng-mfb', 'LocalStorageModule', 'pizzayolo.controllers', 'pizzayolo.services'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('pizzayolo')
            .setNotify(true, true);

        $stateProvider
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/register/signup.html',
                controller: 'SignUpCtrl'
            })

            .state('address', {
                url: '/address',
                templateUrl: 'templates/register/address.html',
                controller: 'SignUpCtrl'
            })

            .state('signin', {
                url: '/signin',
                templateUrl: 'templates/register/signin.html',
                controller: 'SignInCtrl'
            })

            .state('credentials', {
                url: '/credentials',
                controller: 'CredentialsCtrl'
            })

            .state('pizzamaker', {
                url: '/pizzamaker',
                templateUrl: 'templates/pages/pizzamaker.html',
                controller: 'PizzaMakerCtrl'
            })

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/pages/app.html'
            })

            .state('app.cart', {
                url: '/cart',
                views: {
                    'appContent': {
                        templateUrl: 'templates/pages/cart.html'
                    }
                }
            })

            .state('app.notification', {
                url: '/notification',
                views: {
                    'appContent': {
                        templateUrl: 'templates/pages/notification.html'
                    }
                }
            })

            .state('app.order', {
                url: '/order',
                views: {
                    'appContent': {
                        templateUrl: 'templates/pages/order.html',
                        controller: 'OrderCtrl'
                    }
                }
            })

            .state('app.profile', {
                url: '/profile',
                views: {
                    'appContent': {
                        templateUrl: 'templates/pages/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })

            .state('app.situation', {
                url: '/situation',
                views: {
                    'appContent': {
                        templateUrl: 'templates/pages/situation.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/credentials');
    });