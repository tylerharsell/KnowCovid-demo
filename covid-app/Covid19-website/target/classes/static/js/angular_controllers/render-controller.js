app.controller('topic-model-recommender', function($scope,$location,$route,$uibModal,NgTableParams, mainService, $routeParams,recSystemService){
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
	
	$scope.isPieVisible = false;
	$scope.isBarVisible = true;
	$scope.isPreventionVisible = false;
	$scope.isPrognosisVisible = false;
	$scope.isMeaningVisible = false;
	$scope.isEtiologyVisible = false;
	$scope.isTherapyVisible = false;
	$scope.isDiagnosisVisible = false;
	$scope.isCategoryVisible = false;
	$scope.getTopics();
	$scope.showOutput =false;
	$scope.showListTopic = false;
	
	$scope.PieDataSetOverride = [ {
		yAxisID : 'y-axis-1'
	} ]; // y-axis-1 is the ID defined in scales under op
	

	$scope.optionsPie = {
		legend : {
			display : true
		},
		responsive : true, // set to false to remove responsiveness. Default
							// responsive value is true.
		scales : {
			yAxes : [ {
				id : 'y-axis-1',
				type : 'linear',
				display : true,
				position : 'left'
			} ]
		}
	};

	$scope.showChart = function(chartSelected) {
		console.log(chartSelected);
		if (chartSelected == "0") {
			$scope.isBarVisible = true;
			$scope.isPieVisible = false;
		} else if(chartSelected == "1") {
			$scope.isPieVisible = true;
			$scope.isBarVisible = false;
		}
		console.log($scope.isPieVisible);
		console.log($scope.isBarVisible);
	}
	
	
	$scope.showListTopics = function() {

		var recId = $routeParams.recId;
		var input = {};
		input = angular.toJson(input);

		mainService.callPostRestAPI("executeScriptListTopic/", input).then(
				function(data) {
					console.log("Showing list of topics:");
					console.log(data);
					var json = [];
					var dataFinal = {};
		
					var labelFinal = {};
					for (a in data) {
						var data_ = [];
						var label_ = [];

						var k = data[a].words_probs;
						var topics = '';
						for (i in k) {
							topics = topics + i + ", ";
							data_.push(k[i]);
							label_.push(i);
						}
						dataFinal[a] = data_;
						labelFinal[a] = label_;
						json.push(topics);
					}
					console.log(dataFinal);
					$scope.topicssummary = json;
					$scope.dataFinal = dataFinal;
					$scope.labelFinal = labelFinal;
				});
		$scope.isCategoryVisible = false;
		$scope.isPreventionVisible = false;
		$scope.isMeaningVisible = false;
		$scope.isDiagnosisVisible = false;
		$scope.isEtiologyVisible = false;
		$scope.isPrognosisVisible = false;
		$scope.isTherapyVisible = false;
		$scope.showListTopic = true;
		console.log($scope.showListTopic);
	}

	$scope.showMeaningCategory = function() {
		$scope.isMeaningVisible = true;
		$scope.isTherapyVisible = false;
		$scope.isPrognosisVisible = false;
		$scope.isEtiologyVisible = false;
		$scope.isDiagnosisVisible = false;
		$scope.isPreventionVisible = false;
	}
	
	$scope.showPrognosisCategory = function() {
		$scope.isMeaningVisible = false;
		$scope.isTherapyVisible = false;
		$scope.isPrognosisVisible = true;
		$scope.isEtiologyVisible = false;
		$scope.isDiagnosisVisible = false;
		$scope.isPreventionVisible = false;
	}
	$scope.showTherapyCategory = function() {
		$scope.isMeaningVisible = false;
		$scope.isPrognosisVisible = false;
		$scope.isTherapyVisible = true;
		$scope.isEtiologyVisible = false;
		$scope.isDiagnosisVisible = false;
		$scope.isPreventionVisible = false;
	}
	$scope.showEtiologyCategory = function() {
		$scope.isMeaningVisible = false;
		$scope.isPrognosisVisible = false;
		$scope.isTherapyVisible = false;
		$scope.isEtiologyVisible = true;
		$scope.isDiagnosisVisible = false;
		$scope.isPreventionVisible = false;
	}
	$scope.showDiagnosisCategory = function() {
		$scope.isMeaningVisible = false;
		$scope.isPrognosisVisible = false;
		$scope.isTherapyVisible = false;
		$scope.isEtiologyVisible = false;
		$scope.isDiagnosisVisible = true;
		$scope.isPreventionVisible = false;
	}
	
	$scope.showPreventionCategory = function() {
		$scope.isMeaningVisible = false;
		$scope.isPrognosisVisible = false;
		$scope.isTherapyVisible = false;
		$scope.isEtiologyVisible = false;
		$scope.isPreventionVisible = true;
		$scope.isDiagnosisVisible = false;
	}
	
	$scope.showListCategory = function() {
		$scope.isCategoryVisible = true;
		$scope.showListTopic = false;
		$scope.showOutput = false;
	}
	
	$scope.filterDocuments = function(topicSelected, levelSelected){
		$scope.showOutput =true;
		$scope.model.chartSelected = "0";

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
			console.log("Showing list of docs:");
			console.log(data);
			$scope.publications = data;
			
			for (i = 0; i < $scope.publications.length; i++) {
						if ($scope.publications[i].level == "1") {
							$scope.publications[i].level = "Systematic reviews";
							
						}
						
						else if ($scope.publications[i].level == "2") {
							$scope.publications[i].level = "Critically-Appraised Topics";
							
						}
						
						else if ($scope.publications[i].level == "3") {
							$scope.publications[i].level = "Critically-Appraised Individual Articles";
							
						}
						
						else if ($scope.publications[i].level == "4") {
							$scope.publications[i].level = "Randomized Controlled Trials";
							
						}
						
						else if ($scope.publications[i].level == "5") {
							$scope.publications[i].level = "Cohort Studies";
							
						}
						
						else if ($scope.publications[i].level == "6") {
							$scope.publications[i].level = "Case-controlled Studies, Case Series & Case Reports";
							
						}
						
						
						else if ($scope.publications[i].level == "7") {
							$scope.publications[i].level = "Background Information, Expert Opinion";
							
						}
					}
					
					/* Start Pagination code */
					$scope.publicationsTable = new NgTableParams({

						page : 1,

						count : 5

					}, {

						total : $scope.publications.length,

						getData : getData

					});
					/* End Pagination code */
					function getData(params) {

							$scope.data = $scope.publications.slice((params
									.page() - 1)
									* params.count(), params.page()
									* params.count());

							return $scope.data;

						}
		});
	}
	
	$scope.getCheckedTrue = function(){
	   alert(1)
	};
	 
 
	  $scope.options = {
			    scales: {
			    	 yAxes: [{
			             ticks: {
			            	 fontSize: 25,
			                 fontColor: 'black'
			             }
			         }],
			         xAxes: [{
			             ticks: {
			            	 fontSize: 25,
			                 fontColor: 'black'
			             }
			         }],
			         
			    }
			  }; 
	
	 $scope.openModal = function () {
	  	 $uibModal.open({
		      templateUrl: 'view/rec_output/modelRate.html',
		      size: 'lg',
		      controller: function ($scope, $uibModalInstance) {	  
		        $scope.ok = function () {
		          $uibModalInstance.close();
		        };
		      
		        $scope.cancel = function () {
		          $uibModalInstance.dismiss('cancel');
		        };
		      }
		    })
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