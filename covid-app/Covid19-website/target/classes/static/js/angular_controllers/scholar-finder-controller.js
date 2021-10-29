
app.controller('scholar-finder-controller', function ($scope, $http, $window, $sce) {
	
	
	$scope.searchScholar = function () {
		
		scolars_with_expertise = document.getElementById('recOutput').value;

		scholar_experties_map = {};
		scolars_with_expertise= JSON.parse(scolars_with_expertise);
		
		scolars_with_expertise.sort(function(a, b){
			return b.points-a.points
		})

		var x_ = [];
		var y_ = [];
		var name_=[];
		var i = 0;
		$scope.data1=[];
		$scope.data2=[];
		$scope.data3=[];
		
		$scope.labels1=[];
		$scope.labels2=[];
		$scope.labels3=[];
		
		for(scolar in scolars_with_expertise){
			x_.push(scolars_with_expertise[scolar].coordinate[0]);
			y_.push(scolars_with_expertise[scolar].coordinate[1]);
			name_.push(scolars_with_expertise[scolar].name);
			if(i == 0){
				var expertise = scolars_with_expertise[scolar].expertiseEntry;
				for(expert in  expertise){
					var expt= expertise[expert];
					for(e in  expt){
						$scope.labels1.push(e);
						$scope.data1.push(expt[e]);
					}
				}
				
			}
			
			if(i == 1){
				var expertise = scolars_with_expertise[scolar].expertiseEntry;
				for(expert in  expertise){
					var expt= expertise[expert];
					for(e in  expt){
						$scope.labels2.push(e);
						$scope.data2.push(expt[e]);
					}
				}
				
			}
			
			if(i == 2){
				var expertise = scolars_with_expertise[scolar].expertiseEntry;
				for(expert in  expertise){
					var expt= expertise[expert];
					for(e in  expt){
						$scope.labels3.push(e);
						$scope.data3.push(expt[e]);
					}
				}
				
			}
			i = i+1 ;
			

		}
		var x_length = x_.length;
		var y_length = y_.length;
		var name_length = name_.length;
		
		$scope.scolars_with_expertise = scolars_with_expertise;
		var trace1 = {
		  x: x_.slice(0, 3),
		  y: y_.slice(0, 3),
		  mode: 'markers+text',
		  type: 'scatter',
		  text:name_.slice(0, 3),
		  textposition: 'top center',
		  textfont: {
			family:  'Raleway, sans-serif'
		  },
		  marker: { size: 10 }
		};

		var trace2 = {
		  x: x_.slice(3, x_length),
		  y: y_.slice(3, y_length),
		  mode: 'markers+text',
		  type: 'scatter',
		  text: name_.slice(3,name_length),
		  textfont : {
			family:'Raleway, sans-serif'
			},
		  textposition: 'bottom center',
		  marker: { size: 7,color:'black' }
		};

		var data = [ trace1, trace2 ];
		
		


		var layout = { 
		  xaxis: {
			range: [ -2.5, 2.5 ] 
		  },
		  yaxis: {
			range: [-2, 2]
		  },
		  showlegend:false,
		  title:'Scholars Plot'
		};



		Plotly.newPlot('myDiv', data, layout, {showSendToCloud: false});

		
	    
		//$scope.scolars_result= angular.fromJson( '[{"name":"Prasad Calyam","designation":"Associate Professor, University of Missouri","expertises":["Cloud Computing","Cyber Security","Computer Networking","Networked-Multimedia Apps","Advanced Cyberinfrastructure"],"probability":[{"data":"1.0","performance":"0.9","network":"0.92","cloud":"0.95","learning":"0.98","services":"0.89","applications":"0.8","alogorithm":"0.85","approach":"0.79"}],"publications":[{"title":"Performance measurement and analysis of H. 323 traffic","authors":"P Calyam, M Sridharan, W Mandrawa, P Schopis","conf":"International Workshop on Passive and Active Network Measurement, 137-146","year":"2004"},{"title":"A “GAP-model” based framework for online VVoIP QoE measurement","authors":"P Calyam, E Ekici, CG Lee, M Haffner, N Howes","conf":"Journal of Communications and Networks 9 (4), 446-456","year":"2007"},{"title":"Vdbench: A benchmarking toolkit for thin-client based virtual desktop environments","authors":"A Berryman, P Calyam, M Honigford, AM Lai","conf":"2010 IEEE Second International Conference on Cloud Computing Technology","year":"2010"}]},{"name":"Prasad Calyam","designation":"Associate Professor, University of Missouri","expertises":["Cloud Computing","Cyber Security","Computer Networking","Networked-Multimedia Apps","Advanced Cyberinfrastructure"],"probability":[{"data":"1.0","performance":"0.9","network":"0.92","cloud":"0.95","learning":"0.98","services":"0.89","applications":"0.8","alogorithm":"0.85","approach":"0.79"}],"publications":[{"title":"Performance measurement and analysis of H. 323 traffic","authors":"P Calyam, M Sridharan, W Mandrawa, P Schopis","conf":"International Workshop on Passive and Active Network Measurement, 137-146","year":"2004"},{"title":"A “GAP-model” based framework for online VVoIP QoE measurement","authors":"P Calyam, E Ekici, CG Lee, M Haffner, N Howes","conf":"Journal of Communications and Networks 9 (4), 446-456","year":"2007"},{"title":"Vdbench: A benchmarking toolkit for thin-client based virtual desktop environments","authors":"A Berryman, P Calyam, M Honigford, AM Lai","conf":"2010 IEEE Second International Conference on Cloud Computing Technology","year":"2010"}]}]');
		
	}
	$scope.searchScholar();
	
	$scope.viewScholar = function (expertise) {
				
		
	}

});

app.controller('temp-recommender-workflow', function ($scope, $http, $window, $sce) {

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
});

