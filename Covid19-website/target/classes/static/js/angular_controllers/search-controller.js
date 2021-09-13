
app.controller('publication-recommender',function($scope,$location, mainService, $routeParams,recSystemService){

	$scope.showResult =false;

	$scope.publicationSearch = function(){

		var input = document.getElementById("searchContent").value;
		
		mainService.callPostRestAPI("publications/search", input).then(function (data) {
			console.log(data);
			$scope.publications = data;
			if(data != null){
				$scope.showResult =true;
			}
		});
	}
	
	console.log($scope.showResult);
	$scope.getCheckedTrue = function(){
	   alert(1);
	};
	
});