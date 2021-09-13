
app.controller('topic-model-recommender',function($scope,$location, mainService, $routeParams,recSystemService){
	$scope.getTopics = function(){
		
		var recId = $routeParams.recId;
		var input = {};
		input = angular.toJson(input);
	
		mainService.callPostRestAPI("executeScriptListTopic/", input).then(function (data) {
			console.log(data);
			var json = [];
			var dataFinal = {};
			var labelFinal = {};
			for(a in data){
				var data_ = [];
				var label_ = [];

				var k = data[a].words_probs;
				var topics = '';
				for(i in k){
					topics = topics + i + ", ";
					data_.push(k[i]);
					label_.push(i);
				}
				dataFinal[a]=data_;
				labelFinal[a]=label_;
				json.push(topics);
			}
			console.log(dataFinal);
			$scope.topicssummary=json;
			$scope.dataFinal=dataFinal;
			$scope.labelFinal=labelFinal;
		});
	}
	
	$scope.getTopics();
	$scope.showOutput =false;
	
	$scope.filterDocuments = function(topicSelected, levelSelected){
		$scope.showOutput =true;

		var input = {};
		 var ele = document.getElementsByName('topics'); 
         
         for(i = 0; i < ele.length; i++) { 
             if(ele[i].checked) {
	            //alert(ele[i].value);
             	$scope.model.topicSelected=ele[i].value;
             }
         } 
         
		input['topicSelected']= $scope.model.topicSelected;
		input['levelSelected']= levelSelected;
		input = angular.toJson(input);
		
		mainService.callPostRestAPI("executeScriptFilterDocs/", input).then(function (data) {
			console.log(data);
			$scope.publications = data;
		});
	}
	
	$scope.getCheckedTrue = function(){
	   alert(1)
	};
	
});

app.controller('renderInput-controller',function($scope,$location, mainService, $routeParams,recSystemService){

	$scope.recInputParam={};
	$scope.getRecommenderDetails = function(){
		
		var recId = $routeParams.recId;
		var input = {};
		input['recId']= recId;
		input = angular.toJson(input);
	
		mainService.callPostRestAPI("recommender-registry-services/getRecommenderDetails", input).then(function (data) {
			console.log(data);
			$scope.rec = data;
			
			$scope.recInputs = JSON.parse($scope.rec.inputParamter);
			console.log($scope.recInputs);
		});

	}
	
	$scope.getRecommenderDetails();
	
	$scope.showOutput = '';
	$scope.runRecommenderDetails = function(){
		$scope.showOutput = '';
		
		for(inputparam in $scope.recInputParam){
			try{
				if($scope.recInputParam[inputparam].toLowerCase() == "false"){
					$scope.recInputParam[inputparam] = false;
				}
				if($scope.recInputParam[inputparam].toLowerCase() == "true"){
					
					$scope.recInputParam[inputparam] = true;
				}
			}catch(e){
				console.log(e);
			}
		}

		var input = {}
		input['recInputParam'] = $scope.recInputParam;
		input['recId'] = $scope.rec['recId'];
		input['domain'] = 'neuro';
		input = angular.toJson(input);
		
		mainService.callPostRestAPI("recommendation-service/getRecommendation" , input).then(function (response) {
			$scope.showOutput = 'true';
			document.getElementById('recOutput').value=angular.toJson(response);
			console.log(response);
			$scope.recOutput = response;
		});
	}
	
});


app.controller('list-rec-controller',function($scope,$location, mainService, $routeParams){
	
	
	$scope.statusSDK = [];
	
	$scope.getAllRecommenderDetails = function(){
		
		var input = {};
		input['clientId'] = 4
		input = angular.toJson(input);
	
		mainService.callPostRestAPI("recommendation-service/getRecommenderListClient/", input).then(function (data) {
			console.log(data);
			$scope.recList = data;
		});

	}
	
	$scope.getAllRecommenderDetails();
	

	
});
