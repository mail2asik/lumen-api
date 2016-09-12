'use strict';

angular.module('categories', ['ngTable']);

//Routers
myApp.config(function($stateProvider) {
  
  //Search Categories
  $stateProvider.state('categories', {
	url: '/categories',
    templateUrl: 'partials/categories/categories.html',
	data:{
		auth:true
	}
  });
  
  //Add Category
  $stateProvider.state('addCategory', {
	url: '/addCategory',
    templateUrl: 'partials/categories/addCategory.html',
	data:{
		auth:true
	}
  });
  
  //Category Tab
  $stateProvider.state('category', {
    url: '',
	abstract:true,
    templateUrl: 'partials/categories/categoryTab.html',
	data:{
		auth:true
	}
  });

  //View category
  $stateProvider.state('category.view', {
    url: "/view/{id}",
    views: {
      "viewCategory": {
        templateUrl: "partials/categories/viewCategory.html",
        controller: 'viewCategoryController'
      }
    },
    resolve: {
      categoryResolved: function(categoryServices, $stateParams) {
        return categoryServices.getCategory($stateParams.id);
      }
    },
	data:{
		auth:true
	}
  });

  //Edit category
  $stateProvider.state('category.edit', {
    url: "/edit/{id}",
    views: {
      "editCategory": {
        templateUrl: "partials/categories/editCategory.html",
        controller: 'editCategoryController'
      }
    },
    resolve: {
        categoryResolved: function(categoryServices, $stateParams) {
        return categoryServices.getCategory($stateParams.id);
      }
    },
	data:{
		auth:true
	}
  });  
    
});

//Factories
myApp.factory('categoryServices', ['$http', function($http) {

    var factoryDefinitions = {
	  getCategories: function() {
        return $http.get('partials/categories/mock/categories.json').success(function(data) { return data; });
      },
	  addCategory: function(categoryReq) {
        return $http.post('partials/common/mock/success.json', categoryReq).success(function(data) { return data; });
      },
	  getCategory: function(categoryId) {
        return $http.get('partials/categories/mock/get_category.json?id=' + categoryId).success(function(data) { return data; });
      },
	  updateCategory: function(categoryReq) {
        return $http.post('partials/common/mock/success.json', categoryReq).success(function(data) { return data; });
      },
	}
	
    return factoryDefinitions;
  }
]);

//Controllers
myApp.controller('getCategoriesController', ['$scope', 'categoryServices', 'dataTable', function($scope, categoryServices, dataTable) {
	categoryServices.getCategories().then(function(result){
		$scope.data = result.data;	
		if (!result.data.error) {			
			dataTable.render($scope, '', "categoriestList", result.data.response);
		}	
	});
}]);

myApp.controller('addCategoryController', ['$scope', 'categoryServices', '$location', function($scope, categoryServices, $location) {
	$scope.addCategory = function() {
		if ($scope.addCategoryForm.$valid) {	
			categoryServices.addCategory($scope.category).then(function(result){
				$scope.data = result;
				if (!result.error) {	
					$location.path("/categories");
				}	
			});	
		}
	}
	
	$scope.cancel = function() {
		$location.path("/categories");
	}
}]);

myApp.controller('viewCategoryController', ['$scope', 'categoryResolved', function($scope, categoryResolved) {
	$scope.viewCategory = categoryResolved.data;
}]);

myApp.controller('editCategoryController', ['$scope', 'categoryResolved', 'categoryServices', '$location', '$state', function($scope, categoryResolved, categoryServices, $location, $state) {
  $scope.category = categoryResolved.data;
  
  $scope.updateCategory = function() {
    if ($scope.editCategoryForm.$valid) {	     
	 categoryServices.updateCategory($scope.category).then(function(result){
		$scope.data = result.data;
		if (!result.data.error) {
		   $state.transitionTo('category.view', {
				id: $state.params.id
			});
		}
	 });			
    }
  };
  
  $scope.cancel = function() {
		$location.path("/categories");
  }
}]);