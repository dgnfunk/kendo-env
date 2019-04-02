'use strict';

angular
    .module('kendoEnv')
    .controller('AppController', AppController);

    // AppController.$inject = [];

    function AppController() {
        var vm = this;
        vm.testing = 'Hola new env';
    }