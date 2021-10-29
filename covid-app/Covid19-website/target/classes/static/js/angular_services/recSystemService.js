app.service('recSystemService', function($http, $q, $location, $window) {
   
	return {
	   callPostRestAPI : function(url, data) {

	  return $http({
		    method : "POST",
		    url : url,
		    data : data,
		    headers : {
		        'Content-Type' : 'application/json'
		    }
		}).then( function(response){
				console.log(response);
				return response.data;
		},function(response){
				console.log(response);
				alert("Error While Calling API " + url);
				
				throw new Error("Error While Calling "+url+" API ");
			});
	   }
	  
   }
   
});

