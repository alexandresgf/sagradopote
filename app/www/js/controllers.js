angular.module('pizzayolo.controllers', [])

    .controller('SignUpCtrl', function($scope, $rootScope, $state, $ionicPopup, localStorageService, server, singleton, zipcode) {
        $scope.user = localStorageService.get('user') || {
            name: null,
            singleton: null,
            cellphone: null,
            email: null,
            password: null,
            password_conf: null,
            address: []
        };

        $scope.$on('address.new', function() {
            $rootScope.addr = {
                zip: null,
                street: null,
                comp: null,
                number: null,
                neighborhood: null,
                city: null,
                state: null
            };
        });

        $scope.checkCEP = function() {
            zipcode.getAddress($scope.addr.zip,
                function(data) {
                    var address = {
                        zip: Number(data.cep),
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    };

                    $scope.addr = address;
                });
        };

        $scope.next = function() {
            var user = $scope.user;

            if (!user.name || !user.cellphone || !user.email || !user.password || !user.password_conf) {
                $ionicPopup
                    .alert({
                        title: 'ERRO!',
                        template: 'Preencha todos os campos.'
                    });
            } else if (user.cellphone.toString().length > 10 || user.cellphone.toString().length <= 8) {
                $ionicPopup
                    .alert({
                        title: 'ERRO!',
                        template: 'Favor inserir o DDD e/ou verificar o número do celular.'
                    });
            } else if (user.password.toString().length < 6 || user.password.toString().length > 16) {
                $ionicPopup
                    .alert({
                        title: 'ERRO!',
                        template: 'A senha deve ter entre 6 a 16 caracteres.'
                    });
            } else if (user.password !== user.password_conf) {
                $ionicPopup
                    .alert({
                        title: 'ERRO!',
                        template: 'As senhas não combinam.'
                    });
            } else {
                localStorageService.set('user', user);
                $rootScope.$broadcast('address.new');
                $state.go('address');
            }
        };

        $scope.prev = function() {
            $state.go('signup');
        };

        $scope.finish = function() {
            var user = localStorageService.get('user');

            //server.signUp(user);
            user.singleton = singleton.create(user.name);
            user.password = (CryptoJS.MD5(user.password)).toString(CryptoJS.enc.Hex);
            user.address.push($scope.addr);
            delete user.password_conf;
            localStorageService.set('user', user);
            localStorageService.set('loggedIn', 1);
            $state.go('app.order');
        };
    })

    .controller('SignInCtrl', function($scope, $state, $ionicPopup, localStorageService, server) {
        var user = localStorageService.get('user');

        $scope.user = {};

        $scope.signIn = function() {
            if (user === null) {
                $ionicPopup
                    .alert({
                        title: 'Erro',
                        template: 'Credenciais não encontradas, cadastre-se.'
                    });
            } else {
                var password = (CryptoJS.MD5($scope.user.password)).toString(CryptoJS.enc.Hex);

                //server.signIn({ cellphone: $scope.user.cellphone, password: password });
                if (!$scope.user.cellphone || !$scope.user.password) {
                    $ionicPopup
                        .alert({
                            title: 'Erro',
                            template: 'Favor preencher todos os campos.'
                        });
                } else if ($scope.user.cellphone === user.cellphone && password === user.password) {
                    $ionicPopup
                        .alert({
                            title: 'Erro de Login',
                            template: 'Número celular ou senha inválidos.'
                        });
                } else {
                    $state.go('app.order');
                }
            }
        };

        $scope.signUp = function() {
            $state.go('signup');
        };
    })

    .controller('AddressCtrl', function($scope) {
        // code me!
    })

    .controller('AddAddressCtrl', function($scope, $http, localStorageService, server, zipcode) {
        $scope.$on('address.add', function() {
            $scope.addr = {
                zip: '',
                street: '',
                comp: '',
                number: '',
                neighborhood: '',
                city: '',
                state: ''
            };
        });

        $scope.checkCEP = function() {
            zipcode.getAddress($scope.addr.zip,
                function(data) {
                    var address = {
                        zip: Number(data.cep),
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    };

                    $scope.addr = address;
                });
        };

        $scope.save = function() {
            var user = localStorageService.get('user');

            /*
            var newAddress = {
                cellphone: user.cellphone,
                password: user.password,
                address: $scope.addr
            };

            server.addAddress(newAddress);
            */

            user.address.push($scope.addr);
            localStorageService.set('user', user);
            $scope.addAdr.hide();
        };

        $scope.cancel = function() {
            $scope.addAdr.hide();
        };
    })

    .controller('EditAddressCtrl', function($scope, $http, localStorageService, server, zipcode) {
        $scope.$on('address.edit', function() {
            var user = localStorageService.get('user');
            var index = localStorageService.get('editAddressIndex');

            $scope.addr = user.address[index];
        });

        $scope.checkCEP = function() {
            zipcode.getAddress($scope.addr.zip,
                function(data) {
                    var address = {
                        zip: Number(data.cep),
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    };

                    $scope.addr = address;
                });
        };

        $scope.edit = function() {
            var user = localStorageService.get('user');
            var index = localStorageService.get('editAddressIndex');

            user.address[index] = $scope.addr;

            /*
            var editedAddress = {
                cellphone: user.cellphone,
                password: user.password,
                address: user.address
            };

            server.updateAddress(editedAddress);
            */
            localStorageService.set('user', user);
            $scope.editAdr.hide();
        };

        $scope.cancel = function() {
            $scope.editAdr.hide();
        };
    })

    .controller('OrderCtrl', function($scope) {
        var order_list = [];

        $scope.order_total = order_list.length;

        $scope.newOrder = function() {
            order_list.push({
                title: 'Nome da Pizza',
                date: 'Em 23 de Julho de 2015'
            });

            $scope.order_total = order_list.length;
            $scope.order_list = order_list;
            $scope.fabMenu = 'closed';
        };
    })

    .controller('ProfileCtrl', function($rootScope, $scope, $ionicPopup, $ionicModal, $ionicListDelegate, localStorageService, server) {
        localStorageService.bind($scope, 'user');

        $ionicModal.fromTemplateUrl('templates/add/address.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addAdr = modal;
        });

        $ionicModal.fromTemplateUrl('templates/edit/address.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.editAdr = modal;
        });

        /**
         * É necessário a indexação do conteúdo para atualizar as
         * informações do usuário
         */
        $scope.$on('modal.hidden', function() {
            localStorageService.bind($scope, 'user');
        });

        $scope.editName = function() {
            var name = $scope.user.name;

            $ionicPopup.show({
                title: 'Edição de perfil',
                subTitle: 'Informe um novo nome',
                template: '<input type="text" class="title-center" ng-model="user.name">',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive',
                        onTap: function(e) {
                            $scope.user.name = name;
                        }
                    },
                    {
                        text: 'Salvar',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.user.name)
                                $scope.user.name = name;
                        }
                    }
                ]
            });
        };

        $scope.editSingleton = function() {
            var singleton = $scope.user.singleton;

            $ionicPopup.show({
                title: 'Edição de perfil',
                subTitle: 'Informe um novo apelido',
                template: '<input type="text" class="title-center" ng-model="user.singleton">',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive',
                        onTap: function(e) {
                            $scope.user.singleton = singleton;
                        }
                    },
                    {
                        text: 'Salvar',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.user.singleton)
                                $scope.user.singleton = singleton;
                        }
                    }
                ]
            });
        };

        $scope.editEmail = function() {
            var email = $scope.user.email;

            $ionicPopup.show({
                title: 'Edição de perfil',
                subTitle: 'Informe um novo e-mail',
                template: '<input type="email" class="title-center" ng-model="user.email">',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive',
                        onTap: function(e) {
                            $scope.user.email = email;
                        }
                    },
                    {
                        text: 'Salvar',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.user.email)
                                $scope.user.email = email;
                        }
                    }
                ]
            });
        };

        $scope.editPassword = function() {
            var template;

            $scope.data = { old: '', pass1: '', pass2: '' };
            template = '<input type="password" class="title-center" ng-model="data.old" placeholder="Senha anterior">';
            template += '<input type="password" class="title-center" ng-model="data.pass1" placeholder="Nova senha">';
            template += '<input type="password" class="title-center" ng-model="data.pass2" placeholder="Confirme">';

            $ionicPopup.show({
                title: 'Edição de perfil',
                subTitle: 'Informe uma nova senha',
                template: template,
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: 'Salvar',
                        type: 'button-positive',
                        onTap: function(e) {
                            if ((CryptoJS.MD5($scope.data.old)).toString(CryptoJS.enc.Hex) !== $scope.user.password) {
                                return 0;
                            } else if ($scope.data.pass1.toString().length < 6 || $scope.data.pass1.toString().length > 16 ||
                                $scope.data.pass2.toString().length < 6 || $scope.data.pass2.toString().length > 16) {
                                return 1;
                            } else if (!$scope.data.pass1 || !$scope.data.pass2 || !$scope.data.old) {
                                return 2;
                            } else if ($scope.data.pass1 !== $scope.data.pass2) {
                                return 3;
                            }

                            var password = (CryptoJS.MD5($scope.data.pass1)).toString(CryptoJS.enc.Hex);
                            $scope.user.password = password;

                            return 4;
                        }
                    }
                ]
            }).then(function(res) {
                switch (res) {
                    case 0:
                        $ionicPopup
                            .alert({
                                title: 'Erro de senha',
                                template: 'A senha informada está errada.'
                            });
                        break;

                    case 1:
                        $ionicPopup
                            .alert({
                                title: 'Erro de senha',
                                template: 'A senha deve ter entre 6 a 16 caracteres.'
                            });
                        break;

                    case 2:
                        $ionicPopup
                            .alert({
                                title: 'Erro de senha',
                                template: 'Preencha todos os campos de senha.'
                            });
                        break;

                    case 3:
                        $ionicPopup
                            .alert({
                                title: 'Erro de senha',
                                template: 'As senhas não combinam.'
                            });
                        break;

                    case 4:
                        $ionicPopup
                            .alert({
                                title: 'Sucesso!',
                                template: 'Senha alterada com sucesso.'
                            });
                        break;
                }
            });
        };

        $scope.addAddress = function() {
            $rootScope.$broadcast('address.add');
            $scope.fabMenu = 'closed';
            $scope.addAdr.show();
        };

        $scope.editAddress = function(index) {
            localStorageService.set('editAddressIndex', index);
            $rootScope.$broadcast('address.edit');
            $scope.editAdr.show();
        };

        $scope.remAddress = function(index) {
            var user = localStorageService.get('user');

            user.address.splice(index, 1);

            /*
            var removedAddress = {
                cellphone: user.cellphone,
                password: user.password,
                address: user.address
            };

            server.remAddress(removedAddress);
            */

            localStorageService.set('user', user);
            localStorageService.bind($scope, 'user');
            $scope.shouldShowDelete = ($scope.shouldShowDelete !== true) ? true : false;
        };

        $scope.showDelete = function() {
            $scope.shouldShowDelete = ($scope.shouldShowDelete !== true) ? true : false;
            $scope.fabMenu = 'closed';
        };
    })

    .controller('PizzaMakerCtrl', function($scope, $state) {
        //screen.lockOrientation('landscape');
    })

    .controller('CredentialsCtrl', function($scope, $state, localStorageService) {
        if (localStorageService.get('loggedIn') === null || localStorageService.get('loggedIn') === 0) {
            $state.go('signin');
        } else if (localStorageService.get('loggedIn') === 1) {
            $state.go('app.order');
        }
    })

    .controller('MenuTopCtrl', function($scope, $state) {
        $scope.notify = function() {
            $state.go('app.notification');
        };

        $scope.cart = function() {
            $state.go('app.cart');
        };
    })

    .controller('MenuLeftCtrl', function($scope, localStorageService) {
        localStorageService.bind($scope, 'user');
    })

    .controller('AppCtrl', function($scope, $ionicSideMenuDelegate) {
        $scope.leftMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
    })

    .controller('MenuTopCtrl', function($scope, $state) {
        $scope.notify = function() {
            $state.go('app.notification');
        };

        $scope.cart = function() {
            $state.go('app.cart');
        };

        $scope.profile = function () {
            $state.go('app.profile');
        };
    });