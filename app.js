angular.module('mashup', ['ui.router'])
.factory('apis', [function(){
	var o = {
		apis: [
		{title: 'post 1', upvotes: 5},
	  {title: 'post 2', upvotes: 2},
	  {title: 'post 3', upvotes: 15},
	  {title: 'post 4', upvotes: 9},
	  {title: 'post 5', upvotes: 4}

		]
	};
	return o;
}])
.controller('MainCtrl', [
	'$scope', 'apis',
	function($scope,apis){
		$scope.test = 'Hello world!';
		$scope.apis = apis.apis
		

		$scope.addPost = function(){
			if($scope.title == '') { return; }
			$scope.posts.push({
				title: $scope.title, 
				link: $scope.link,
				upvotes: 0});
			$scope.title = '';
			$scope.link = '';
			console.log("added")
			$scope.posts.push({
				title: $scope.title,
				link: $scope.link,
				upvotes: 0,
				comments: [
				{author: 'Joe', body: 'Cool post!', upvotes: 0},
				{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
				]
			});



		};
		$scope.incrementUpvotes = function(post){
			post.upvotes +=1;
		}
	}]);