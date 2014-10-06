//Helper function

function pickRand(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
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
             //angular.copy(o.songs.randomElement().song.href, o.currentSong);
             console.log("copied songs");
             o.getSong();
         });
     };
     o.getSong = function () {
         for (var x in o.songs)
             o.currentSong.append(x);
            
     };
    
    
    o.getEmbed = function () {
       return $http.get('/api/embedSong').success(function(data){
               angular.copy(JSON.parse(data), o.embed);
            }); 
    }
  return o;
}])


 
// Controller that handles actions
.controller('MainCtrl', [
	'$scope', '$http','mashups','songs',
	function($scope,$http,mashups,songs,embed,currentSong){
        mashups.getList();
        songs.getList();
        songs.getEmbed();
        
            $scope.songs = songs.songs;
        $scope.mashups = mashups.mashups;
        $scope.embed = songs.embed;
		$scope.test = 'Hello world!';
        $scope.currentSong = songs.currentSong;
       // $scope.currentSong = pickRand(songs.songs);
        

        $scope.getEmbed = function(href){
            $http.get('http://soundcloud.com/oembed?format=json&url=' + href).success(function(data){
               return data;
            }); 
        };
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
