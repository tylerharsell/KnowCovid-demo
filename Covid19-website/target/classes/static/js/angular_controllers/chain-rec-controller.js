

app.controller('renderInput-chain-controller',function($scope,$location, mainService, $routeParams, recSystemService, $sce, $compile){
	var appId = $routeParams.appId;
	$scope.rec1InputParam={};

	$scope.getChainAppDetails = function(){
		
		var input = {};
		input['appId'] = appId;
		input = angular.toJson(input);
	
		mainService.callPostRestAPI("/api/recommender/chainApp/getChainAppDetails", input).then(function (data) {
			console.log(data);
			$scope.rec = data;
			$scope.chainAppDetails =data['chainAppDetails'][0];
			$scope.rec1 = data['chainAppDetails'][0].rec1;
			$scope.recInputs = JSON.parse($scope.rec1.inputParamter);
			$scope.rec2 = data['chainAppDetails'][0].rec2;
		});

	}
	$scope.getChainAppDetails();
	
	$scope.runRecChainOutput =  function(index_html,value,name){
		var input= {};
		input[name] = value;
		input['type'] = 'authors';
		input = angular.toJson(input);
		
		recSystemService.callPostRestAPI("http://localhost:"+$scope.rec2.port+"/"+$scope.rec2.apiUrl , input).then(function (response) {
			console.log(response);
			var outputVarName =  $scope.rec2.outputObjectName ;
			var headerArray = $scope.rec2.objectNameToDisplay.split(",");
			var outputHTML = '';
			
			if(outputVarName !== undefined && outputVarName !== null && outputVarName != ''){
				var output= response[outputVarName];
			}else{
				var output=response;
			}
			

			if($scope.rec2.outputType == 'table'){
				outputHTML = '<table class="table table-striped table-bordered"><thead ><tr>';
				
				
				outputHTML = outputHTML + '<th>#</th>';
				for(headerInd in headerArray){
					outputHTML = outputHTML + '<th class="capitalize" >'+headerArray[headerInd]+'</th>';
	
				}
				outputHTML = outputHTML + '</tr></thead><tbody>';
				if(output.length > 0){
					for(index in output){
						
						var row = output[index];
						outputHTML = outputHTML + '<tr>';
						outputHTML = outputHTML + '<td>'+(parseInt(index)+1)+'</td>';
	
						for(headerInd in headerArray){
							var rowDisplayObjectName = headerArray[headerInd];
							outputHTML = outputHTML + '<td>'+row[rowDisplayObjectName]+'</td>';
						}
						outputHTML = outputHTML + '</tr>';
					}
				}else{
					
					outputHTML = outputHTML + '<tr>';
					outputHTML = outputHTML + '<td colspan="' + ( parseInt(headerArray.length) + 1 ) +'">No Details Found</td>';
					outputHTML = outputHTML + '</tr>';
				}
				outputHTML = outputHTML + '</tbody></table>';
			
			}else if($scope.rec2.outputType == 'list'){
				
				
				if(output.length > 0){
					outputHTML = outputHTML + '<ol>';
					//outputHTML = outputHTML + '<div class="capitalize" >'+headerArray[headerInd]+'</div>';

					for(index in output){
						outputHTML = outputHTML + '<li class="rec-list">';
						var row = output[index];
						for(headerInd in headerArray){
							var rowDisplayObjectName = headerArray[headerInd];
							outputHTML = outputHTML + '<div><span class="capitalize bold-500" >'+headerArray[headerInd]+'</span> : ';
							outputHTML = outputHTML + row[rowDisplayObjectName]+'</div>';
						}
						outputHTML = outputHTML + '</li>';

					}
					outputHTML = outputHTML + '</ol>';

				}else{
					outputHTML = outputHTML + '<div>No Details Found</td>';
				}
				
			}
			console.log(outputHTML);
			angular.element(document.getElementById('chain_output_'+index_html)).append($compile(outputHTML)($scope));

			
		});
	}

	$scope.runChainAppInput = function(){
		var input= {};
		input = $scope.rec1InputParam;
		input = angular.toJson(input);
		
		recSystemService.callPostRestAPI("http://localhost:"+$scope.rec1.port+"/"+$scope.rec1.apiUrl , input).then(function (response) {
			
			var outputHTML = '';
			var rec1 = $scope.rec1;
			
			if(rec1.outputType == 'table'){
				outputHTML = '<table class="table table-striped table-bordered"><thead ><tr>';
				var outputVarName =  rec1.outputObjectName ;// 'topics';
				var headerArray = rec1.objectNameToDisplay.split(",");

				if(outputVarName !== undefined && outputVarName !== null && outputVarName != ''){
					var output= response[outputVarName];
				}else{
					var output=response;
				}
				
				outputHTML = outputHTML + '<th>#</th>';
				for(headerInd in headerArray){
					outputHTML = outputHTML + '<th class="capitalize" >'+headerArray[headerInd]+'</th>';
	
				}
				outputHTML = outputHTML + '</tr></thead><tbody>';
				if(output.length > 0){
					for(index in output){
						
						var row = output[index];
						outputHTML = outputHTML + '<tr>';
						outputHTML = outputHTML + '<td>'+(parseInt(index)+1)+'</td>';
	
						for(headerInd in headerArray){
							var rowDisplayObjectName = headerArray[headerInd];
							outputHTML = outputHTML + '<td>'+row[rowDisplayObjectName]+'</td>';
						}
						outputHTML = outputHTML + '</tr>';
					}
				}else{
					
					outputHTML = outputHTML + '<tr>';
					outputHTML = outputHTML + '<td colspan="' + ( parseInt(headerArray.length) + 1 ) +'">No Details Found</td>';
					outputHTML = outputHTML + '</tr>';
				}
				outputHTML = outputHTML + '</tbody></table>';
			
			}else if(rec1.outputType == 'list'){
				
				var outputVarName =  rec1.outputObjectName ;
				var headerArray = rec1.objectNameToDisplay.split(",");
				if(outputVarName !== undefined && outputVarName !== null && outputVarName != ''){
					var output= response[outputVarName];
				}else{
					var output=response;
				}
				
				
				if(output.length > 0){
					outputHTML = outputHTML + '<ol>';

					for(index in output){
						outputHTML = outputHTML + '<li class="rec-list">';
						var row = output[index];
						for(headerInd in headerArray){
							var rowDisplayObjectName = headerArray[headerInd];
							outputHTML = outputHTML + '<div><span class="capitalize bold-500" >'+headerArray[headerInd]+'</span> : ';

							if($scope.chainAppDetails.inputParam == headerArray[headerInd]){
								outputHTML = outputHTML + '<a  href="javascript:void(0);" title="click here to run '+$scope.rec2.appName+'" ng-click="runRecChainOutput('+index+',\''+row[rowDisplayObjectName]+'\',\''+$scope.chainAppDetails.outputParam+'\');">'+ row[rowDisplayObjectName]+'</a></div>';
								outputHTML = outputHTML + '<div id="chain_output_'+index+'"></div>';
							}else{
								outputHTML = outputHTML + row[rowDisplayObjectName]+'</div>';
							}
						}
						outputHTML = outputHTML + '</li>';

					}
					outputHTML = outputHTML + '</ol>';

				}else{
					outputHTML = outputHTML + '<div>No Details Found</td>';
				}
				
			}
			
			//$scope.finalOutputHTML = $sce.trustAsHtml(outputHTML);
			angular.element(document.getElementById('chain_output')).append($compile(outputHTML)($scope));

			/*var ele = document.getElementById('chain_output');
			console.log(ele.contents());
	        $compile(ele.contents())(scope);*/
			console.log(outputHTML);
		});
	
	}
	
});



app.controller('chain-rec-controller',function($scope,$location, mainService, $routeParams,recSystemService){
	
	$scope.chainApp = {};
	$scope.chainAppDetails = {};
	
	$scope.getAllRecommenderDetails = function(){
		
		var input = {};
		input = angular.toJson(input);
	
		mainService.callPostRestAPI("/api/recommender/getAllRecommenderDetailsWithoutKnowledgeBase", input).then(function (data) {
			console.log(data);
			$scope.recList = data;
		});

	}
	
	$scope.getAllRecommenderDetails();
	$scope.chainValidate = '';
	$scope.validateRecommender = function(){
		
		var rec1ID = $scope.chainAppDetails.rec1Id;
		var rec2ID = $scope.chainAppDetails.rec2Id;
		
		var input = {};
		input['rec1Id']= rec1ID;
		input['rec2Id']= rec2ID;
		input = angular.toJson(input);
		
		mainService.callPostRestAPI("/api/recommender/chainApp/checkValidity", input).then(function (data) {
			$scope.chainValidate = 'true';
			$scope.rec1 = data['rec1'];
			$scope.inputParams = $scope.rec1.objectNameToDisplay.split(",");
			$scope.rec2 = data['rec2'];
			$scope.outputParams = JSON.parse($scope.rec2.inputParamter);
			
		});

		
	}
	
	$scope.chainApps = function(){
		var chainAppDetails = []; 
		chainAppDetails.push($scope.chainAppDetails);
		$scope.chainApp.chainAppDetails= chainAppDetails;
		var input = {};
		input = $scope.chainApp ;	
		input = angular.toJson(input);

		mainService.callPostRestAPI("/api/recommender/chainApp/chainApps", input).then(function (data) {
			console.log(data);
			alert("Chain App is ready for use. Click on Available Recommender System menu to use.");
		});
	}
	
});
