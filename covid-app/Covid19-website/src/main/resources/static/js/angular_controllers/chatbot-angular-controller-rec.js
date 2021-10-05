function getRecommendation(recId,keyword){
		//alert(title);
	
	//alert(keyword);
	if(recId == 26){
		$('#keyword').val(keyword).trigger("change");
		$('#type').val("title").trigger("change");
	}
	else if(recId == 21){
		$('#text').val(keyword).trigger("change");
	}
	else if(recId == 29){
		$('#topicName').val(keyword).trigger("change");
	}
	else if(recId == 35){
		$('#text').val(keyword).trigger("change");
	}
	else if(recId = 30){
		if(keyword == 'neuron simulation'){
			$('#req_os').val("LINUX").trigger("change");
			$('#req_vCPU').val("1").trigger("change");
			$('#req_ram').val("4").trigger("change");
			$('#req_network').val("1").trigger("change");
			$('#req_clock').val("2").trigger("change");
			$('#req_gpu').val("true").trigger("change");
			$('#req_storage').val("20").trigger("change");
			$('#req_ssd').val("false").trigger("change");
		}
	}
	

	$("#objectName").click();
}
	

$(document).ready(function () {
    // api.ai Credentials
    // please change the accessToken to configure this to work with yoru Dialogflow agent
	
    var baseUrl = "https://api.dialogflow.com/v1/query?v=20170712&";
    var accessToken = "55995f86374c45d8825eda233efb94f9";
    //var baseUrl = "POST https://dialogflow.googleapis.com/v2/projects/knowcovid19-chatbot-keusyk/agent/sessions/session-id:detectIntent
    //var accessToken = "AIzaSyAauPBdnxH9ijvTr35gcxobyIOsI892eog";

    //Komal_changes
    //var accessToken = "";
    
    // ------------- declare and intialize chat window widget variables ----------------//
    var $chatbox = $('.chatbox'),
        $chatboxTitle = $('.chatbox__title'),
        $chatboxTitleClose = $('.chatbox__title__close'),
        $chatboxCredentials = $('.chatbox__credentials'),
        $chatboxUser = $('.chatbox__start');

    // ------------
    $chatboxTitle.on('click', function () {
        $chatbox.toggleClass('chatbox--tray');
        if ($chatbox.hasClass('chatbox--closed'))
            $chatbox.removeClass('chatbox--closed'),
                $chatbox.addClass('chatbox--tray');

    });

    // -------------  execute this when close button is clicked   ---------------------//
    $chatboxTitleClose.on('click', function (e) {
        e.stopPropagation();
        $chatbox.addClass('chatbox--closed');
    });

    // -------------     ---------------------//
    $chatbox.on('transitionend', function () {
        // if ($chatbox.hasClass('chatbox--closed')) $chatbox.remove();
    });


    // ----------- submit button function in the chatbot window -------------//
    $chatboxCredentials.on('submit', function (e) {
    	e.preventDefault();
        $chatbox.removeClass('chatbox--empty');
        var userName = $('#inputName').val();
        var userEmail = $('#inputEmail').val();
        //Komal_changes
		//setBotResponse('Hello! '+userName+' Welcome to OnTimeRecommend. How can I help you today?')

        // check if user is returning user
        localStorage.clear();
        data = {};
        data['userName']=userName;
		setBotResponse('Hello '+userName+'! Welcome to KnowCovid-19 portal. How can I help you today?')

        /*$.ajax({
            type: "POST",
            //url: "http://localhost:9090/OnTimeRecommendAPI/chatbot/checkForUser",
            url: "http://localhost:9090/OnTimeRecommendAPI/chatbot/checkForUser",
            data: JSON.stringify(data),// now data come in this function
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
            	
            	
            	if(undefined ==  data['userQuadrant'] || data['userQuadrant'] == ''){
            		setBotResponse('To assist you better , can you please fill this short survey to get personalized responses.\
            		<a href= "http://localhost:8080/OnTimeRecommend/getSurvay?id='+data['id'] +'"  style="color:red"> Click Here to take survey </a> ');
            	}else{
            		setBotResponse('Hello! '+userName+' welcome back to CyNeuro portal. How can I help you today?')
            		localStorage.getItem(data['userName'],data['userQuadrant'] );
            		
            		//accessToken = "9cef33e804a846f9a8fa0edc27c4e31e";
            		
            		if(data['userQuadrant'] == '4'){ //both expert
            			accessToken = "9cef33e804a846f9a8fa0edc27c4e31e";
            		}
            		else if(data['userQuadrant'] == '3'){ //hpc expert
            			accessToken = "cf318738f99b4d6b81c4eeb4f2f1cf10";
            		}
            		else if(data['userQuadrant'] == '2'){ //domain expert
            			accessToken = "59382be3d0c243a49d3a591e09830df5";
            		}
            		else{ //novice
            			accessToken = "d07efa878eb140eabdf661499a543731";
            		}
            		
            	}
            },

            error: function (jqXHR, status) {
                // error handler
                console.log(jqXHR);
                alert('fail');
            }
         });*/
       
        //setBotResponse('<span class="alert alert-warning">suggestions 01</span>');
        //sendUserText('My name is ' + userName);
        $("#user_input").focus();
    });


    // given a string set the usertext in the chat window with appropriate styling
    function setUserText(val) {
        var userTextBefore = '<p class="userText">';
        var userTextAfter = '</p>';
        var userTextFinal = userTextBefore + val + userTextAfter;
        $('#chatbox_body_content').append(userTextFinal);
        // set the value of input field to empty string
        $('#user_input').val('');
        // scroll to the bottom of the chatbot body
        $('#chatbox_body_content').scrollTop(1E10);
    }

    function setUserContext(val) {

    }

    // given a string set the bot response in the chat window with appropriate styling
    function setBotResponse(val) {
        if ($.trim(val) == '') {
            val = 'I couldn\'t get that. Let\' try something else!';
        } else {
            val = val.replace(new RegExp('\r?\n', 'g'), '<br />');
        }
        var botResponseBefore = '<p class="botResponse">';
        var botResponseAfter = '</p>';
        var botResponseFinal = botResponseBefore + val + botResponseAfter;
        $('#chatbox_body_content').append(botResponseFinal);
        // scroll to the bottom of the chatbot body
        $('#chatbox_body_content').scrollTop(1E10);
    }

    // send i.e ajax call to the dialog server 
    // pass the user entered text and get the response
    function sendUserText(text, context) {
        //setBotResponse('bot reply goes here');
        //setUserContext();
        $.ajax({
            type: "GET",
            url: baseUrl + "query=" + text + "&lang=en-us&sessionId=" + mysession,
            contentType: "application/json",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            // data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
            success: function (data) {
                main(data);
                console.log(data);
            },
            error: function (e) {
                console.log(e);
            }
        });
      }
      
   
    /*const dialogflow = import('@google-cloud/dialogflow');
	var projectId = "knowcovid19-chatbot-keusyk"; // your dialogflow project id when you click on settings of the DF agent
	var sessionId = "123456"; // session ID
	var config = {
	// use credentials or keyFilename i'm using keyFile
	     credentials: {
	         private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGKwLCZOCYuj0Z\nhTkA0u08kpXAAm7Oy/WjGvkuvsEH8EqsLQv18Rb9U2ZN88GUKywVE0Ry7LQfOA9J\nufJH2I8y3SuIjvkLjTOjqOq9tqM5VJGWnzuYzD31mvh0ZOzTVjrFIJQElFgp/Yzj\nNbusve4fdjwBYgJYggDrrzviIhdPd1NS6Q4qohfyoM1N6U0U+gt8ckKrhE7Tm5L3\npRADcrGoADYjlOZ7PD0o0zE9uH3Bl1OJZRccrzVlpMlxydWwABz2cPrniGk/uP86\na0khiFFbT9JcJ6tUvmj5t2qsEYByMNZoDBR/w2QRaJM1xTAo2t8EvBuT8HwzlNy8\nEIw8O0lBAgMBAAECggEAAyMcLJKnQZO1Mum6gMpWCh7x8vO26FwvO9FJ/5Tyflst\n+3LNHSwfZoxC8tn4hw116bF/5Gfd5B6hk1O3w65oefApZ8SHqcim+CDM8orpI5e0\npFNKAL2+/1vgMguE+kWDsao13aqxiJykddZcbbwmAGaBRa5VBiyssg54nrhWcSIV\nzyMG833zD5IULCqA1ub01Za+wqYGyb1jCu218GkJXeagm6lDDA6LoRi4PtODTU7M\nmxLMC+LAh+petW7Y5Dvo9jQo2zKjRzQamvlhZj3FvG1yhNEDaN3crZN58ll28Io9\n0tCu2eL9KMYZAUT4Nkj675EGKm92JRivwwYINePdVwKBgQDzHTboscQ9EfMLW+Wx\n+8X8RR8eHrx6SjtDOiZyeNgfOTJ86FV44i5rPvaCjHs6kafHxHUpdhFhSzetGt9k\nW1QWApa0YQvd7baJXBpidyqH2+Vrrf1qdYcf+PPnn75zPclj4K9y4B9zJrnHeRhS\nboezY+O9ozFVl/M4CTvmOvDKRwKBgQDQq+2XN7/8TpHwRfzxPIneePCaxJkWWjRS\nIT3A63U+rXqRT4NbA2ENGQcpcAjMDX1SzVnA0jeSjPD3YEdDStnfsRPgSK2HiPCe\nUM9j3Ash6Dzjt0lpPqPXwupecv45AEu41nFRKrjHpSj9fUR/KTCx2N3ciBg056vL\ngmVOzJeMNwKBgBC9xUc23p2Z+9Ofa2zbOqIJnH/1e+Mr83LIsVcWrUNRLAHf+erO\nIIYwGseYpu+8kgI2rB7Dy6SYimf4PsPpahvt57TaLfgFY5mH5yU6sYoTgXPt0lKf\nb0OrYBhmLrY+3fxrv4k4l9HVK9vpodwjUmLvEQLBFyeexBfqwt4y1twHAoGATDjx\nEZKQs1Xz4wN9sJS/e59LrAzyKoMKp5Fy4Dxh2GI/6kJUJfOnCMTCo/VDkV3AEHXo\nOhHPsN2Ay6vEfCUkTpx9OSjzEhYIZpv4FW70Ng+B5mA2FZaG/LI7MALrL+EWx861\nF8P2OR7wSR/v3E8sdVpVOFASH4kcbLsVzGHZXaMCgYEA300knj0pfSG/EJ12Dz8K\nFl0xfsun9xAxiZD7ngP4YifDU1U5GIaj3yQno4L2T+/mcohRwJda4jufEimLP4S5\nlZm9aqd7II3W8hj87K8pnNWKX7S/s+D5uoMXvUHAUR82r07WLE8kuYshMsRhC0JL\nQ8GWZcfO+eS4qP8Cbs7b1t0=\n-----END PRIVATE KEY-----\n',
	         client_email: 'knowcovid19-vidura-v2@knowcovid19-chatbot-keusyk.iam.gserviceaccount.com',
	     }
	        //keyFilename: './google.json'
	};
	
	var sessionClient = new dialogflow.SessionsClient(config);
	
	async function sendTextMessageToDialogFlow(textMessage) {
        // Define session path
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: textMessage,
                    languageCode: 'en'
                }
            }
        }
        try {
            let [responses] = await sessionClient.detectIntent(request)
            console.log(responses);
        } catch (err) {
            console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
            throw err
        }
    };*/
     

    // execute this when user hits enter button in the chat window input
    $("#user_input").keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            // get user query text
            var userText = $('#user_input').val();
            var contextJSON = $('#chat_context').val();

            // set the user text in the chat window 
            setUserText(userText);

            // send the user text to the chat server
            if(accessToken == ''){
            	setBotResponse('Please take surevy first so I can assist you better. Can you please fill this short survey to get personalized responses.\
                		<a href= "http://localhost:8080/OnTimeRecommend/getSurvay?id='+data['id'] +'"  style="color:red"> Click Here to take survey </a> ');
            }else{
            	sendUserText(userText, contextJSON);
				//sendTextMessageToDialogFlow(text);
            }
            

        } // end of if condition
    }); // end of keypress function

    // Session Init (is important so that each user interaction is unique)-----------
    var session = function () {
        // Retrieve the object from storage
        if (sessionStorage.getItem('session')) {
            var retrievedSession = sessionStorage.getItem('session');
        } else {
            // Random Number Generator
            var randomNo = Math.floor((Math.random() * 1000) + 1);
            // get Timestamp
            var timestamp = Date.now();
            // get Day
            var date = new Date();
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var day = weekday[date.getDay()];
            // Join random number+day+timestamp
            var session_id = randomNo + day + timestamp;
            // Put the object into storage
            sessionStorage.setItem('session', session_id);
            var retrievedSession = sessionStorage.getItem('session');
        }
        return retrievedSession;
        // console.log('session: ', retrievedSession);
    }

    // Call Session init
    var mysession = session();


    // To check which recommender view is displaying --------------------------
    var recommenderView = '';
    $("#publication_recommender_link").click(function(){
        recommenderView = 'publication';
        $('#resultID').empty();
        console.log(recommenderView);
    });
    $("#jupyter_recommender_link").click(function(){
        recommenderView = 'jupyter';
        console.log(recommenderView);
    });
    $("#cloud_recommender_link").click(function(){
        recommenderView = 'cloud';
        console.log(recommenderView);
    });
    $("#topic_recommender_link").click(function(){
        recommenderView = 'topic-model';
        console.log(recommenderView);
    });
    // --------------------------------------------------------------------------

    // Main function: this method has the logic to handle differen parts of the response returned from the chat server
    function main(data) {
        console.log(data.result);
        var action = data.result.action;
        var speech = data.result.fulfillment.speech;


        // use incomplete if you use required in api.ai questions in intent
        // check if actionIncomplete = false
        var incomplete = data.result.actionIncomplete;
        if (data.result.fulfillment.messages) { // check if messages are there
            if (data.result.fulfillment.messages.length > 0) { //check if quick replies are there
                var suggestions = data.result.fulfillment.messages[1];
            }
        }
        
        var intentName= data.result.metadata.intentName;
        if(data.result.parameters){
        	if(data.result.parameters.rec_id){
        		 var rec_id = data.result.parameters.rec_id;
        		 if(rec_id  != ''){
        			 $("#rec_menu_"+rec_id).click();
        			 var any = data.result.parameters.any;
        			 if(any && any != ''){
        				 setTimeout(function(){
            				 var any = data.result.parameters.any;
                    			 getRecommendation(rec_id, any);                		 
            			 },2000);  
        			 }
        		 }
        		 
        	}
        }
       
        setBotResponse(speech);
                
		 
		
    }


    // Suggestions -----------------------------------------------------------------------------------------
    function addSuggestion(textToAdd) {
        setTimeout(function () {
            var suggestions = textToAdd.replies;
            console.log(suggestions);
            // var suggLength = textToAdd.replies.length;

            var botResponseBefore = '<div class="suggestions"><div class="sugg-title">Suggestions:</div>';
            var botResponseAfter = '</div>';


            var val = '';


            // Loop through suggestions
            //if(undefined!== suggestions.length()){
            for (i = 0; i < suggestions.length; i++) {
                val += '<span class="sugg-options">' + suggestions[i] + '</span>';
            }

            var botResponseFinal = botResponseBefore + val + botResponseAfter;
            $('#chatbox_body_content').append(botResponseFinal);

            // scroll to the bottom of the chatbot body
            $('#chatbox_body_content').scrollTop(1E10);

        }, 1000);
    }

    // on click of suggestions get value and send to API.AI
    $(document).on("click", ".suggestions span", function () {
        var text = this.innerText;
        setUserText(text);
        sendUserText(text);
        $('.suggestions').remove();
    });
    // Suggestions end -----------------------------------------------------------------------------------------

    /**************************/


    /*****************/
});