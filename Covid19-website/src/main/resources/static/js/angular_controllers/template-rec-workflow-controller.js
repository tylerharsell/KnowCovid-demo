$screenID = '';

app.controller('recommender-workflow', function ($scope, $http, $window, $sce) {
	
	$scope.recomm_section = 'recommendersystems';
	$scope.child = {} ;
	
	$scope.openRecommender = function (recommender_section) {
		$scope.recomm_section = recommender_section;
		$scope.classActive = [];
		$scope.classActive[recommender_section] = 'active';

		if (recommender_section == 'template_recommender') {
			$scope.visibleSection = 'firstpage';
			$screenID = 'firstpage';
		}
		else if (recommender_section == 'scholar_finder') {
			$scope.visibleSection = 'scholar_page1';
			$screenID = 'scholar_page1';
		}
	}
	
	$scope.openMainPageRecommender = function () {
		$scope.recomm_section ='recommendersystems';
		$scope.classActive = [];
	}


});


app.controller('temp-recommender-workflow', function ($scope, $http, $window, $sce) {


	var parentScope = $scope.$parent;
	parentScope.child = $scope;

	$scope.clouddetails = {};
	$scope.req_operatingsystem = function (operating_system) {
		req_os_ = [];
		if ($scope.clouddetails.req_os) {
			req_os_ = $scope.clouddetails.req_os;
		}

		if ($scope.operatingsystem[operating_system]) {
			req_os_.push(operating_system);
		} else {
			for (var i = 0; i < req_os_.length; i++) {
				if (req_os_[i] == operating_system) {
					req_os_.splice(i, 1);
					break;
				}
			}
		}


		$scope.clouddetails.req_os = req_os_;
		console.log($scope.clouddetails);
	}
 
	

	$scope.callOptimizer = function (clouddetails) {

		console.log(clouddetails);
		clouddetails = '{"req_os":"LINUX","req_vCPU":"8","req_ram":"12","req_network":"5","req_clock":"2","req_gpu":false,"req_storage":"20","req_ssd":false}';

		var req = {
			method: 'POST',
			url: '/callOptimizer',
			headers: {
				'Content-Type': 'json',
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			params: {"clouddetails" : clouddetails}

		}


		/*$http(req).then(function (response) {
			console.log(response);
			//var response = JSON.parse(responseText);

			if (response.status == 200) {

				$scope.$parent.visibleSection = 'temprecomdstep2';
				$screenID = 'temprecomdstep2';
				var cloudTemplateSuggetion = response.data;
				$scope.cloudTemplateSuggetion = cloudTemplateSuggetion;
				 
			} else {
				alert("Issue with API");
			}


		});*/
		
		$http(req).then(function (response) {
			console.log(response);
			var response = JSON.parse(response.data.data);
			
			if (response.status == 200) {

				$scope.$parent.visibleSection = 'temprecomdstep2';
				$screenID = 'temprecomdstep2';

				var cloudTemplateSuggetion = response.data;
				$scope.cloudTemplateSuggetion = cloudTemplateSuggetion;
				 
			} else {
				alert("Issue with API");
			}


		}); 
		


	}


	$scope.viewTemplateDetails = function (cloudTemplate) {
		var html = '';
		var  instances = cloudTemplate.instances;
		for (key_cloud in instances) {

			var instance = instances[key_cloud];
			html = html + ' <tr >';

			html = html + '<td>' + instance.instance_csp + '</td>';
			html = html + '<td>' + instance.instance_name + '</td>';
			html = html + '<td>' + instance.instance_count + '</td>';
			html = html + '<td>' + instance.instance_details.OS + '</td>';
			html = html + '<td>' + instance.instance_details.vCPU + '</td>';
			html = html + '<td>' + instance.instance_details.ram + '</td>';
			html = html + '<td>' + instance.instance_details.price + '</td>';
			html = html + '<td>' + instance.instance_details.network + '</td>';
			html = html + '<td>' + instance.instance_details.clock + '</td>';

			html = html + ' </tr >';
		}


		$scope.UsedToInsertHTMLCode = $sce.trustAsHtml(html);

	}
	
	$scope.selectTemplate = function(cloudTemplate ,is_popup){
		
		$scope.$parent.visibleSection = 'temprecomdstep4';
		
		$screenID = 'temprecomdstep4';
		
		var type_cloud = [];
		var  instances = cloudTemplate.instances;
		for (key_cloud in instances) {
			var instance = instances[key_cloud];

			if(type_cloud && type_cloud.indexOf(instance.instance_csp) == -1){
				type_cloud.push(instance.instance_csp);
			}
		}
		
		var check_aws = type_cloud.indexOf("AWS");
		var check_local = type_cloud.indexOf("LOCAL");
		
		if(check_aws >= 0 && check_local >= 0){
			cloudTemplate['typeofInstance'] = 'aws_local';
		}
		else if(check_aws >= 0 && check_local == -1){
			cloudTemplate['typeofInstance'] = 'aws';

		}
		else if(check_aws == -1 && check_local >= 0){
			cloudTemplate['typeofInstance'] = 'local';

		}
		
		var req = {
			method: 'POST',
			url: '/allocateResources',
			headers: {
				'Content-Type': 'json',
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			params:{"cloudTemplate":cloudTemplate}

		}

		$http(req).then(function (data) {
			console.log(data);
			$scope.$parent.visibleSection = 'temprecomdstep3';
			$screenID = 'temprecomdstep3';

			
		});
		
		

	}
	$scope.loader_status=false;
	$scope.link_text='Check Status';
	
	$scope.downloadFile = function(){
		var req = {
				method: 'POST',
				url: '/downloadFile',
				headers: {
					'Content-Type': 'json',
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}

			}

			$http(req).then(function (response) {
				alert('check output folder');
				//alert(1);
				//$scope.$parent.visibleSection = 'temprecomdstep3;
				
			});
	}
	
	$scope.checkStatus = function(){
		$scope.output_status='';
		$scope.loader_status=true;
		var req = {
				method: 'POST',
				url: '/checkStatus',
				headers: {
					'Content-Type': 'json',
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}

			}

			$http(req).then(function (response) {
				console.log(response.data);
				$scope.loader_status=false;
				$scope.output_status = response.data.msg
				$scope.link_text='Refresh Status';
				//alert(1);
				//$scope.$parent.visibleSection = 'temprecomdstep3;
				
			});
	}
	
	

	$scope.proceed = function () {

		console.log($scope.workflowtype);
		if (!$scope.workflowtype) {
			//alert("Please select workflow type.");
			$scope.errorworkflowtype = true;

		} else if ($scope.workflowtype.name == 'temprecomd') {

			$scope.$parent.visibleSection = 'temprecomdstep1';
			$screenID = 'temprecomdstep1';
			$scope.firstSection = false;
			$scope.errorworkflowtype = false;

			var closeWorkflowModal = document.getElementById('selectWorkflowModal');
			closeWorkflowModal.click();


		}


	}


});


$('#upload').on('click', function(e) {

    e.preventDefault();

		var form_data = new FormData($("#modal_form_id")[0]);
		
		if(document.getElementById('img1') && document.getElementById('img1').value == ''){
			alert("Please choose image.");
			return false;
		}else{
			$.ajax({
				url: '/uploadFile',
				type: 'POST',              
				processData: false,  // tell jQuery not to process the data
				contentType: false,  // tell jQuery not to set contentType
				data : form_data,

			headers: {
						'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
					},

				success: function(result){
					console.log('Uploaded');
					
				},
				error: function(data){
					console.log(data);
				}
			});
		}
});