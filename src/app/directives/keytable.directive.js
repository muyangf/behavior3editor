(function() {
  'use strict';
  var deepClone = function(obj){
    return JSON.parse(JSON.stringify(obj));
  };
  angular
    .module('app')
    .directive('b3KeyTable', keytable)
    .controller('KeyTableController', KeyTableController);

  keytable.$inject = ['$parse'];
  function keytable($parse) {
    var directive = {
      require          : '^ngModel',
      restrict         : 'EA',
      replace          : true,
      bindToController : true,
      controller       : 'KeyTableController',
      controllerAs     : 'keytable',
      templateUrl      : 'directives/keytable.html',
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      // get the value of the `ng-model` attribute
      scope.keytable.heading = attrs.heading;
      scope.keytable._onChange = $parse(attrs.ngChange);

      var variable = attrs.ngModel;
      scope.$watch(variable, function(model) {
        scope.keytable.reset(model);
      });
    }
  }

  KeyTableController.$inject = ['$scope'];
  function KeyTableController($scope) {
    // HEAD //
    var vm = this;
    vm._onChange = null;
    vm.model  = $scope.keytable.model || $scope.model || null;
    vm.rows   = [];
    vm.rowsList   = [];
    vm.add    = add;
    vm.remove = remove;
    vm.change = change;
    vm.changeList = changeList;
    vm.reset  = reset;

    _activate();
    
    // BODY //
    function _activate() {
      console.log('_activate');
      if (vm.model) {
        for (var key in vm.model) {
          add(key, vm.model[key], false);
        }
      } else {
        vm.model = {};
      }
    }

    function reset(model) {
      console.log('reset');

      vm.rows = [];
      vm.rowsList   = [];
      vm.model = model;
      _activate();
    }

    function add(key, value, fixed) {
      console.log('add');

      if ((typeof value === "number" || typeof value === "string") || (value.constructor === Array && (typeof value[0] === "number" || typeof value[0] === "string"))) {
        vm.rows.push({key:key, value:deepClone(value), fixed:fixed===true});
      }else {
        vm.rowsList.push({key:key, value:deepClone(value), fixed:fixed===true});
      }
    }

    function remove(i) {
      console.log('remove');

      vm.rows.splice(i, 1);
    }

    function change1() {
      for (var key in vm.model){
        if (vm.model.hasOwnProperty(key)){
          delete vm.model[key];
        }
      }
      for (var i=0; i<vm.rows.length; i++) {
        var r = vm.rows[i];
        console.log(r);
        if (! r.key) continue;

        var value = r.value;
        if (!isNaN(value) && value !== '') {
          value = parseFloat(value);
        }

        vm.model[r.key] = value;
        
        if (vm._onChange) {
          vm._onChange($scope);
        }
      }
    }

    function change() {
      console.log('change');

      for (var i = 0; i < vm.rows.length; i++) {
        var r = vm.rows[i];
        if (! r.key) continue;

        var value = r.value;
        var key = r.key;
        console.log('key',key);
        console.log('value',value);
        console.log('vm.model[key]',vm.model[key]);

        // if (!isNaN(value) && value !== '') {
        //   value = parseFloat(value);
        // }
        if (value === '') {
          alert(key + " 的值不能为空！");
          return;
        }
        if (vm.model.hasOwnProperty(key) && value !== ''){
          //判断是否是数组
          if (vm.model[key].constructor === Array){

            if (typeof value === "string"){
              if (typeof vm.model[key][0] === "number"){
                vm.model[key] = value.split(",").map(Number);
              // } else if (typeof vm.model[key][0].constructor === Array) {
              //   vm.model[key] = value.split(",");
              }else if (typeof vm.model[key][0] === "string") {
                vm.model[key] = value.split(",");
              }
            }

          }else if (typeof vm.model[key] === "number") {
            vm.model[key] = parseFloat(value);
          }else {
            vm.model[key] = value;
          }
        }
      }

      if (vm._onChange) {
        vm._onChange($scope);
      }
    }

    function changeList(index) {
      console.log('changeList');

      for (var i = 0; i < vm.rowsList.length; i++) {
        var r = vm.rowsList[i];
        if (! r.key) continue;

        var key = r.key;
        var value = r.value;

        if (value === '') {
          alert(key + " 的值不能为空！");
          return;
        }
        if (vm.model.hasOwnProperty(key) && value !== ''){

          console.log(index);
          console.log('key',key);
          console.log('value',value);


          if(vm.model[key].constructor === Array ){
            console.log('dddddddddddd');
            if(vm.model[key][0].constructor === Array && vm.model[key].length-1 >= index){
              if (typeof vm.model[key][0][0]=== "string"){

                console.log('vm.model[key]',vm.model[key]);
                console.log('split',value[index].toString());
                vm.model[key][index] = value[index].toString().split(",");
              }else if(typeof vm.model[key][0][0]=== "number"){
                vm.model[key][index] = value[index].toString().split(",").map(Number);
              }
            }
          }
        }
      }
      if (vm._onChange) {
        vm._onChange($scope);
      }
    }
  }



})();