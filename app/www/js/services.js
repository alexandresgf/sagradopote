angular.module('pizzayolo.services', [])

    .factory('singleton', function() {
        return {
            create: function(fullname) {
                var arr_name = fullname.toLowerCase().split(' ');
                var singleton = arr_name[0];

                for (var i = 1; i < arr_name.length; i++)
                    singleton += arr_name[i].charAt(0);

                return singleton;
            }
        };
    })

    .factory('server', function($http, $state, $ionicPopup) {
        var _cypher = 'b**r**o**f**i**s**t';
        var _salt = '';
        var _pepper = '';
        var _url = 'http://179.186.67.51:3000';

        return {
            signIn: function(data) {
                data.abilwtrhdfdj89sj = this.crypt(_cypher);

                $http.post(_url + '/login', data)
                    .success(function(data) {
                        console.log(data);
                    })
                    .error(function() {
                        console.log('Número celular ou senha inválidos.');
                    });
            },

            signUp: function(data) {
                data.abilwtrhdfdj89sj = this.crypt(_cypher);

                $http.put(_url + '/cadastro', data)
                    .success(function() {
                        $state.go('app.order');
                    })
                    .error(function() {
                        $ionicPopup
                            .alert({
                                title: 'ERRO DE CONEXÃO!',
                                template: 'Por favor, tente novamente!'
                            });
                    });
            },

            updateProfile: function() {
                // code me!
            },

            addAddress: function(data) {
                data.abilwtrhdfdj89sj = this.crypt(_cypher);

                $http.put(_url + '/address/add', data)
                    .success(function(data) {
                        console.log(data);
                    })
                    .error(function() {
                        console.log('Erro ao tentar salvar um novo endereço.');
                    });
            },

            updateAddress: function(data) {
                data.abilwtrhdfdj89sj = this.crypt(_cypher);

                $http.post(_url + '/address/update', data)
                    .success(function(data) {
                        console.log(data);
                    })
                    .error(function() {
                        console.log('Erro ao tentar atualizar o endereço.');
                    });
            },

            remAddress: function(data) {
                data.abilwtrhdfdj89sj = this.crypt(_cypher);

                $http.post(_url + '/address/remove', data)
                    .success(function(data) {
                        console.log(data);
                    })
                    .error(function() {
                        console.log('Erro ao tentar remover o endereço.');
                    });
            },

            createOrder: function() {
                // code me!
            },

            crypt: function(cypher) {
                for (var i = 0; i < cypher.length; i++) {
                    if (cypher.charAt(i) === '*') {
                        var char = String.fromCharCode(Math.round(Math.random() * 93) + 33);

                        cypher = cypher.substr(0, i) + char + cypher.substr(i + char.length);
                    }
                }

                return cypher;
            }
        };
    })

    .factory('zipcode', function($http, $ionicPopup) {
        var url = 'http://cep.correiocontrol.com.br/';

        return {
            getAddress: function(zipcode, success) {
                $http.get(url + zipcode + '.json')
                    .success(success)
                    .error(function() {
                        $ionicPopup
                            .alert({
                                title: 'ERRO!',
                                template: 'CEP inválido! Por favor, corrija o número.'
                            });
                    });
            }
        };
    });