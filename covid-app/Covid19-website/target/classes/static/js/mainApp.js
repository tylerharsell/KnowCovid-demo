
var app = angular.module("mainApp", [ 'ngRoute', 'ui.router','ngSanitize','chart.js','ngTable','ui.bootstrap' ]);

app.controller("myCtrl", function($scope) {
	$scope.name = "Jack";
});

function showRecTab(id){
	$(".rec-tab-content .tab-pane").removeClass("active");
	$("#"+id+"_content").addClass("active");

	$(".rec-tabs .rec-tab").removeClass("active");
	$("#"+id+"_head").addClass("active");

}


function showStep(id){
	$("#"+id).toggle("slow");
	//$("#lab_step_1_1").css("display","");

}