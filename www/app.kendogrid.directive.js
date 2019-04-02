(function () {
    'use strict';

    angular
        .module('appDirectives')
        .directive('wrapperKendoGrid', wrapperKendoGrid)
        .controller('WrapperKendoGridCtrl', WrapperKendoGridCtrl);
    
    // wrapperKendoGrid.$inject = [];

    function wrapperKendoGrid() {
        
        var directiveDefinitionObject = {
            restrict: 'E',
            replace: true,
            controller: 'WrapperKendoGridCtrl',
            controllerAs: 'grid',
            scope: {
                data: '=',
                metadata: '='
            },
            templateUrl: '/www/app.kendogrid.directive.html',
            compile: function () {
                return {
                    pre: preGridFunction,
                    post: postGridFunction
                };
            }
        };

        return directiveDefinitionObject;

        function postGridFunction() {
        }

        function preGridFunction($scope) {
            var model = {
                id: "UserId",
                fields: {
                    "Email": { type: 'string' },
                    "FullName": { type: 'string' },
                    "Country": { type: 'string' },
                    "UserId": { type: 'number' },
                    // "CreatedAt": { type: 'date' }
                }
            };

            var columns = [
                { field: "UserId", width: "120px" },
                { field: "FullName", width: "120px" },
                { field: "Email", width: "120px" },
                { field: "Country", width: "120px" },
                // { field: "CreatedAt", width: "120px" }
            ];

            var source = new kendo.data.DataSource({
                transport: {
                    read: $scope.grid.read
                },
                schema: {
                    model: model,
                    total: $scope.grid.getTotalRows
                },
                requestEnd: $scope.grid.requestEnd,
                serverSorting: true,
                serverFiltering: true,
                serverPaging: true,
                pageSize: 100,
                // group: '',
                sort: { field: 'UserId', dir: 'asc' },
                // change: function (event) {
                //     $scope.grid.change(event);
                // }
            });

            $scope.grid.options = {
                dataSource: source,
                columns: columns,
                // editable: { createAt: 'bottom' },
                // The height now is automatically calculated by the resizing mechanism
                height: 600,
                // toolbar: buildToolbar($scope),
                sortable: { allowUnsort: false },
                selectable: true,
                navigatable: true,
                // groupable: {
                //     enabled: false,
                //     showFooter: true
                // },
                filterable: {
                    mode: 'menu'
                },
                sort: true,
                scrollable: {
                    virtual: true
                }
            };
        }
    }

    WrapperKendoGridCtrl.$inject = ['$http'];
        
    function WrapperKendoGridCtrl($http) {
        var vm = this;
        vm.totalRows = 10000;
        var config = {
            method:'POST',
            url:'http://mx0916-pc0d8cen.americas.epicor.net:5000/api/v1/contacts'
        };
        vm.getTotalRows = function () {
            return vm.totalRows;
        }
        vm.read = function (e) {
            config.data = { options: e.data };
            if (e.data && e.data.filter && e.data.filter.filters.length > 0) {
                vm.totalRows = 100;
            }
            // var pageData = data.contacts.slice(e.skip, e.data.skip + e.data.take);
            $http(config).then(function (response) {
                console.log(response, e);
                e.success(response.data.contacts);
            });   
        };

        vm.changePage = function () {
            vm.instance.dataSource.page(600);
        };

        vm.addRow = function () {
            vm.instance.dataSource.read({ action: 'addRow' });
        };

        vm.change = function () {
            vm.instance.dataSource.read({ action: 'change' });
        };

        vm.filter = function () {
            vm.instance.dataSource.filter([
                {
                    field: 'UserId',
                    operator: 'gte',
                    value: 5900
                },
                {
                    field: 'UserId',
                    operator: 'lte',
                    value: 6000
                }
            ]);
        }
    }
})();
