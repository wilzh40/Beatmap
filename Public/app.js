//Helper function
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}


angular.module('mashup', ['ui.router'])

// Service for mashups
.factory('mashups', ['$http', function($http){
    var o = {
         mashups: [
         /* {title: 'post 1', upvotes: 5},
          {title: 'post 2', upvotes: 2},
          {title: 'post 3', upvotes: 15},
          {title: 'post 4', upvotes: 9},
          {title: 'post 5', upvotes: 4}*/
        ]

      };
     o.getList = function () {
         return $http.get('/api/mashups').success(function(data){
             angular.copy(data, o.mashups);
         });

     };
    
    o.create = function(mashup) {
      return $http.post('/api/mashups', post).success(function(data){
        o.posts.push(data);
      });
    };

  return o;
}])

.factory('songs', ['$http', function($http){
    var o = {
         songs: [
         /* {title: 'post 1', upvotes: 5},
          {title: 'post 2', upvotes: 2},
          {title: 'post 3', upvotes: 15},
          {title: 'post 4', upvotes: 9},
          {title: 'post 5', upvotes: 4}*/
        ],
        currentSong: [] ,
        embed: []

      };
     o.getList = function () {
         return $http.get('/api/songs').success(function(data){
             angular.copy(data, o.songs);
         });
     };
     o.getSong = function () {
         return o.songs.randomElement();
     };
    
    
    o.getEmbed = function (url) {
        return $http.get('http://soundcloud.com/oembed?format=json&url=' + url).success(function(data){
            angular.copy(data, o.embed);
        }) 
    }
  return o;
}])


// Controller that handles actions
.controller('MainCtrl', [
	'$scope', '$http','mashups','songs',
	function($scope,$http,mashups,songs){
        mashups.getList();
        songs.getList();
        $scope.songs = songs.songs;
        $scope.mashups = mashups.mashups;
        
		$scope.test = 'Hello world!';
 
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
