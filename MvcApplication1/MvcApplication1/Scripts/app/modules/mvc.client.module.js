'use strict';

var app = angular.module('MVCApp', ['ui.bootstrap', 'ngAnimate', 'ngLodash', 'agGrid', 'ngSanitize', 'ui.select', 'ui.mask']);

app.controller('CustomerController', [
    '$scope', '$timeout', 'lodash', '$q', 'UserAPI', 'CustomerAPI', 'ClassificationAPI', 'RegionAPI'
    , 'CityAPI', 'SellerAPI'

    , function ($scope, $timeout, _, $q, UserAPI, CustomerAPI, ClassificationAPI, RegionAPI
        , CityAPI, SellerAPI
    )
    {
        var scp = $scope;

        scp.isClosedAlert = false;
        scp.closeAlert = function()
        {
            scp.isClosedAlert = true;
        }

        scp.customerList = scp.customerFilteredList = [];
        scp.classificationList = [];
        scp.regionList = scp.regionFilterList = [];
        scp.cityList = [];
        scp.sellerList = [];

        scp.isAdmin = false;

        scp.customerFilter = {
            name: null,
            gender: null,
            city: null,
            region: null,
            lastPurchaseFrom: null,
            lastPurchaseTo: null,
            classification: null,
            seller: null
        };

        scp.isUsingDateFilter = false;
        scp.isValidDateFilter = true;
        var _beginMoment, _finalMoment;


        // ------------------------------------------------------------------------------------
        // GRID
        // ------------------------------------------------------------------------------------
        var columnDefs = [
            { headerName: "Classification", field: "ClassificationName", width: 80 },
            { headerName: "Name", field: "Name", width: 90 },
            { headerName: "Phone", field: "Phone", width: 100 },
            { headerName: "Gender", field: "Gender", width: 50, unSortIcon: true },
            { headerName: "City", field: "CityName", width: 100 },
            { headerName: "Region", field: "RegionName", width: 110 },
            {
                headerName: "Last Purchase"
                , field: "LastPurchaseDate"
                , width: 100
                , comparator: dateComparator
            }
        ];

        scp.gridOptions = {
            columnDefs: columnDefs
            , rowData: null
            , enableSorting: true
            , enableRowSelection: false
            , enableColResize: true
        };

        function dateComparator(date1, date2) {
            var date1Number = monthToComparableNumber(date1);
            var date2Number = monthToComparableNumber(date2);

            if (date1Number === null && date2Number === null) {
                return 0;
            }
            if (date1Number === null) {
                return -1;
            }
            if (date2Number === null) {
                return 1;
            }

            return date1Number - date2Number;
        }

        // eg 29/08/2004 gets converted to 20040829
        function monthToComparableNumber(date) {
            if (date === undefined || date === null || date.length !== 10) {
                return null;
            }

            var yearNumber = date.substring(6, 10);
            var monthNumber = date.substring(3, 5);
            var dayNumber = date.substring(0, 2);

            var result = (yearNumber * 10000) + (monthNumber * 100) + dayNumber;
            return result;
        }
        
        UserAPI.get()
            .then(function successCallback(response) {
                if (_.result(response, 'data.success') !== true)
                {
                    console.error('Response error in user get.');
                }
                else
                {
                    var _role = _.result(response, 'data.role')
                        , isAdmin = _role === 'Administrator';
                    
                    scp.isAdmin = isAdmin;

                    if ( isAdmin )
                    {
                        columnDefs.push({ headerName: "Seller", field: "SellerName", width: 80 });

                        //scp.gridOptions.api.refreshView();
                        scp.gridOptions.api.setColumnDefs(columnDefs);
                    }
                }
            }, function errorCallback(response) {
                console.error('Error loading user data', response);
            });


        // ------------------------------------------------------------------------------------
        // LOAD DATA
        // ------------------------------------------------------------------------------------
        var loadClassification = function ()
        {
            var _def = $q.defer();

            ClassificationAPI.get().then(function successCallback(response) {
                if (_.result(response, 'data.success') !== true) {
                    console.error('Response error in classification get.');
                }
                else
                {
                    var _data = _.result(response, 'data.rowData', []);

                    scp.classificationList = _data;
                    _def.resolve(_data);
                }
            }, function errorCallback(response) {
                console.error('Error loading classification data', response);
            });

            return _def.promise;
        };

        var loadRegion = function () {
            var _def = $q.defer();
            
            RegionAPI.get().then(function successCallback(response) {
                if (_.result(response, 'data.success') !== true) {
                    console.error('Response error in region get.');
                }
                else
                {
                    var _data = _.result(response, 'data.rowData', []);

                    scp.regionList = _data;
                    scp.regionFilterList = _data;

                    _def.resolve(_data);
                }
            }, function errorCallback(response) {
                console.error('Error loading region data', response);
            });

            return _def.promise;
        };

        var loadCity = function () {
            var _def = $q.defer();

            CityAPI.get().then(function successCallback(response) {
                if (_.result(response, 'data.success') !== true) {
                    console.error('Response error in city get.');
                }
                else {
                    var _data = _.result(response, 'data.rowData', []);

                    scp.cityList = _data;
                    _def.resolve(_data);
                }
            }, function errorCallback(response) {
                console.error('Error loading city data', response);
            });

            return _def.promise;
        };

        var loadSeller = function () {
            var _def = $q.defer();

            SellerAPI.get().then(function successCallback(response) {
                if (_.result(response, 'data.success') !== true) {
                    console.error('Response error in seller get.');
                }
                else {
                    var _data = _.result(response, 'data.rowData', []);

                    scp.sellerList = _data;
                    _def.resolve(_data);
                }
            }, function errorCallback(response) {
                console.error('Error loading seller data', response);
            });

            return _def.promise;
        };


        // ------------------------------------------------------------------------------------
        // BIND DATA
        // ------------------------------------------------------------------------------------
        var bindClassification = function (_collection) {
            _.each(_collection, function (item) {
                var _criteria = { ClassificationId: _.result(item, 'ClassificationId') }
                    , _find = _.find(scp.classificationList, _criteria);

                if (_find)
                {
                    var _assign = { ClassificationName: _.result(_find, 'ClassificationName') };
                    _.assign(item, _assign);
                }
            });
        };


        var bindRegion = function (_collection) {
            _.each(_collection, function (item) {
                var _criteria = { RegionId: _.result(item, 'RegionId') }
                    , _find = _.find(scp.regionList, _criteria);

                if (_find)
                {
                    var _assign = {
                        RegionName: _.result(_find, 'RegionName')
                        , CityId: _.result(_find, 'CityId')
                    };
                    _.assign(item, _assign);
                }
            });
        };


        var bindCity = function (_collection) {
            _.each(_collection, function (item) {
                var _criteria = { CityId: _.result(item, 'CityId') }
                    , _find = _.find(scp.cityList, _criteria);

                if (_find)
                {
                    var _assign = { CityName: _.result(_find, 'CityName') };
                    _.assign(item, _assign);
                }
            });
        };


        var bindSeller = function (_collection) {
            _.each(_collection, function (item) {
                var _criteria = { UserId: _.result(item, 'SellerId') }
                    , _find = _.find(scp.sellerList, _criteria);

                if (_find)
                {
                    var _assign = { SellerName: _.result(_find, 'Name') };
                    _.assign(item, _assign);
                }
            });
        };


        var castDate = function (_collection, columns)
        {
            var parseDate = function (value)
            {
                if( _.isEmpty(value) )
                {
                    return '';
                }

                var date = new Date(parseInt(value.substr(6)))
                    , formattedDate = moment(date).format('DD/MM/YYYY');

                return formattedDate;
            };

            _.each(columns, function (column) {
                var _name = _.result(column, 'name')
                    , _target = _.result(column, 'target');

                _.each(_collection, function (item) {
                    var columnItem = _.result(item, _name);

                    if( columnItem )
                    {
                        var _assign = {};
                        _assign[_target] = parseDate(columnItem);
                        _.assign(item, _assign);
                    }
                });
            });            
        };

        var refreshCustomerRowData = function ()
        {
            scp.gridOptions.api.setRowData(scp.customerFilteredList);
            scp.gridOptions.api.sizeColumnsToFit();
        };

        var bindData = function(valueListObj)
        {
            CustomerAPI.get()
                .then(function successCallback(response) {
                    if (_.result(response, 'data.success') !== true) {
                        console.error('Response error in customer get.');
                    }
                    else
                    {
                        var _data = _.result(response, 'data.rowData', []);

                        scp.customerList = _data;
                        scp.customerFilteredList = scp.customerList;

                        bindClassification(_data);
                        bindRegion(_data);
                        bindCity(_data);
                        bindSeller(_data);
                        castDate(_data, [{ name: 'LastPurchase', target: 'LastPurchaseDate' }]);

                        refreshCustomerRowData();
                    }
                }, function errorCallback(response) {
                    console.error('Error loading customer data', response);
                });
        };

        var allPromiseObj = $q.all({
            classificationList: loadClassification()
            , regionList: loadRegion()
            , cityList: loadCity()
            , sellerList: loadSeller()
        });

        allPromiseObj.then(bindData);

        
        // ------------------------------------------------------------------------------------
        // SEARCH
        // ------------------------------------------------------------------------------------
        scp.search = function()
        {
            var _ret = scp.customerList;

            var _filterName = _.result(scp.customerFilter, 'name');
            if (!_.isEmpty(_filterName))
            {
                _ret = _.filter(_ret, function (item) {
                    var _n = _.result(item, 'Name');
                    if( !_n )
                    {
                        return false;
                    }

                    return _n.match(new RegExp(_filterName, 'i')) !== null;
                });
            }

            var _filterGender = _.result(scp.customerFilter, 'gender');
            if (!_.isEmpty(_filterGender)) {
                _ret = _.filter(_ret, { Gender: _filterGender });
            }

            var _filterCity = _.result(scp.customerFilter, 'city');
            if (!_.isEmpty(_filterCity)) {
                var _cityIdList = _.map(_filterCity, 'CityId');

                _ret = _.filter(_ret, function (item) {
                    return _cityIdList.indexOf(_.result(item, 'CityId')) > -1;
                });
            }

            var _filterRegion = _.result(scp.customerFilter, 'region');
            if (!_.isEmpty(_filterRegion)) {
                var _regionIdList = _.map(_filterRegion, 'RegionId');

                _ret = _.filter(_ret, function (item) {
                    return _regionIdList.indexOf(_.result(item, 'RegionId')) > -1;
                });
            }

            var _filterClassification = _.result(scp.customerFilter, 'classification');
            if (!_.isEmpty(_filterClassification)) {
                var _ClassificationIdList = _.map(_filterClassification, 'ClassificationId');

                _ret = _.filter(_ret, function (item) {
                    return _ClassificationIdList.indexOf(_.result(item, 'ClassificationId')) > -1;
                });
            }

            var _filterSeller = _.result(scp.customerFilter, 'seller');
            if (!_.isEmpty(_filterSeller)) {
                var _SellerIdList = _.map(_filterSeller, 'UserId');

                _ret = _.filter(_ret, function (item) {
                    return _SellerIdList.indexOf(_.result(item, 'SellerId')) > -1;
                });
            }

            if( scp.isUsingDateFilter && scp.isValidDateFilter )
            {
                _ret = _.filter(_ret, function (item) {
                    var _at = _.result(item, 'LastPurchaseDate')
                        , _thisMoment = moment(_at, 'DD/MM/YYYY').add(1, 'seconds');

                    if ( !_thisMoment.isValid() )
                    {
                        return false;
                    }

                    return _thisMoment.isBetween(_beginMoment, _finalMoment);
                });
            }

            scp.customerFilteredList = _ret;
            refreshCustomerRowData();
        };


        scp.clearFields = function ()
        {
            scp.customerFilter.name = null;
            scp.customerFilter.gender = null;
            scp.customerFilter.city = null;
            scp.customerFilter.region = null;
            scp.customerFilter.classification = null;
            scp.customerFilter.seller = null;
            scp.customerFilter.lastPurchaseFrom = null;
            scp.customerFilter.lastPurchaseTo = null;

            scp.isUsingDateFilter = false;
            scp.regionFilterList = scp.regionList;
        };

        scp.validateDateFilter = function()
        {
            var _begin = _.result(scp.customerFilter, 'lastPurchaseFrom')
                , _final = _.result(scp.customerFilter, 'lastPurchaseTo');

            if (_.isEmpty(_begin) && _.isEmpty(_final))
            {
                scp.isUsingDateFilter = false;
                scp.isValidDateFilter = true;
                return;
            }

            scp.isUsingDateFilter = true;
            scp.isValidDateFilter = false;

            _beginMoment = moment(_begin, 'DDMMYYYY');
            _finalMoment = moment(_final, 'DDMMYYYY').endOf('day');

            if( _beginMoment.isValid() && _finalMoment.isValid() && _beginMoment.isBefore(_finalMoment) )
            {
                scp.isValidDateFilter = true;
            }
        };

        
        scp.onWindowResize = function()
        {
            scp.gridOptions.api.sizeColumnsToFit();
        };

        scp.filterRegion = function()
        {
            var _ret = scp.regionList
                , _filterCity = _.result(scp.customerFilter, 'city');

            if (!_.isEmpty(_filterCity))
            {
                var _cityIdList = _.map(_filterCity, 'CityId');

                _ret = _.filter(_ret, function (item) {
                    return _cityIdList.indexOf(_.result(item, 'CityId')) > -1;
                });

                //_.each(scp.customerFilter.region, function (item) {
                //    if( _cityIdList.indexOf(_.result(item, 'CityId')) <0 )
                //    {
                //        _.remove(scp.customerFilter.region, item);
                //    }
                //});
                scp.customerFilter.region = [];
            }

            scp.regionFilterList = _ret;
        };
    }
]);


app.factory('UserAPI', ['$http', function ($http) {
    var _service = {};
    _service.get = function () {
        return $http.get('/User/Get');
    };
    return _service;
}]);


app.factory('CustomerAPI', ['$http', function ($http) {
    var _service = {};
    _service.get = function () {
        return $http.get('/Customer/Get');
    };
    return _service;
}]);


app.factory('ClassificationAPI', ['$http', function ($http) {
    var _service = {};
    _service.get = function () {
        return $http.get('/Classification/Get');
    };
    return _service;
}]);


app.factory('RegionAPI', ['$http', function ($http) {
    var _service = {};
    _service.get = function () {
        return $http.get('/Region/Get');
    };
    return _service;
}]);


app.factory('CityAPI', ['$http', function ($http) {
    var _service = {};
    _service.get = function () {
        return $http.get('/City/Get');
    };
    return _service;
}]);


app.factory('SellerAPI', ['$http', function ($http) {
    var _service = {};
    _service.get = function () {
        return $http.get('/Seller/Get');
    };
    return _service;
}]);


app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});


app.directive('windowObserver', [
	'$window', '$timeout', 'lodash'
	, function($window, $timeout, _)
	{
	    return {
	        restrict: 'A'

			, scope: {
			    notifier: '&'
			}

			, link: function postLink(scope, element, attrs)
			{
			    var w = angular.element($window);

			    scope.$watch(function ()
			    {
			        return {
			            h: w.height()
                        , w: w.width()
			        };
			    }
					, function (newValue, oldValue)
					{
					    $timeout(function(){
					        _.result(scope, 'notifier');
					    });
					}
					, true);

			    w.bind('resize', function () {
			        scope.$apply();
			    });
			}
	    };
	}
]);