(function () {
    'use strict';

    angular
        .module('appDirectives')
        .directive('newWrapperKendoGrid', newWrapperKendoGrid)
        .controller('NewWrapperKendoGridCtrl', NewWrapperKendoGridCtrl);
    
    // newWrapperKendoGrid.$inject = [];

    function newWrapperKendoGrid() {
        
        var directiveDefinitionObject = {
            restrict: 'E',
            replace: true,
            controller: 'NewWrapperKendoGridCtrl',
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
                pageSize: 10,
                // group: '',
                sort: { field: 'UserId', dir: 'asc' },
                // change: function (event) {
                //     $scope.grid.change(event);
                // }
            });

            $scope.grid.options = {
                dataSource: source,
                columns: columns,
                editable: { createAt: 'bottom' },
                // The height now is automatically calculated by the resizing mechanism
                height: 600,
                // toolbar: buildToolbar($scope),
                sortable: { allowUnsort: false },
                selectable: true,
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

    NewWrapperKendoGridCtrl.$inject = ['$http'];
        
    function NewWrapperKendoGridCtrl($http) {
        var vm = this;
        vm.totalRows = 10000;
        vm.newPageNumber = 600;
        var config = {};

        vm.getTotalRows = function () {
            return vm.totalRows;
        };

        vm.read = function (e) {
            config.method = 'POST';
            config.url = 'http://mx0916-pc0d8cen.americas.epicor.net:5000/api/v1/contacts';
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
            vm.instance.dataSource.page(vm.newPageNumber);
            vm.isChangingPage = true;
        };

        vm.addRow = function () {
            config.method = 'POST';
            config.url = 'http://mx0916-pc0d8cen.americas.epicor.net:5000/api/v1/addRow';

            $http(config).then(function (response) {
                vm.instance.addRow();
                // vm.instance.dataSource.insert(response.data.contacts[0].UserId - 1, response.data.contacts[0]);
            });
        };

        vm.change = function () {
            vm.instance.dataSource.pushUpdate({
                UserId: 6000,
                FullName: 'Updated Name',
                Email: 'Updated Email',
                Country: 'Updated Contry'
            });
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
        };

        vm.requestEnd = function () {
            if (vm.isChangingPage){
                vm.isChangingPage = false;
                var rowHeight = vm.instance.tbody.children().eq(0).height();
                var pageSize = vm.instance.dataSource.pageSize();
                vm.instance.wrapper.find(".k-scrollbar").scrollTop(rowHeight * pageSize * (vm.newPageNumber - 1));
            }

        };
    }
})();
