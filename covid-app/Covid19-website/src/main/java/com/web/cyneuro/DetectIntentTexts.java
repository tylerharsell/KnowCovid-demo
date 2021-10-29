package com.web.cyneuro;

import com.google.api.gax.rpc.ApiException;
import com.google.cloud.dialogflow.v2.DetectIntentResponse;
import com.google.cloud.dialogflow.v2.QueryInput;
import com.google.cloud.dialogflow.v2.QueryResult;
import com.google.cloud.dialogflow.v2.SessionName;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.TextInput;
import com.google.common.collect.Maps;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Service
public class DetectIntentTexts {
	
	@PostMapping("/Dialogflow_response")
	@ResponseBody
    public String getResponse(@RequestBody String request) throws Exception {
		String projectId = "";
		List<String> texts = null;
		texts.add(request);
		String sessionId = "";
		String languageCode = "en-US";
		Map<String, QueryResult> result = detectIntentTexts(projectId, texts, sessionId, languageCode);
		System.out.print(result);
		return "Success!";
	}
	

  // DialogFlow API Detect Intent sample with text inputs.
  public static Map<String, QueryResult> detectIntentTexts(String projectId, List<String> texts, String sessionId, String languageCode)
      throws IOException, ApiException {
    Map<String, QueryResult> queryResults = Maps.newHashMap();
    // Instantiates a client
    try (SessionsClient sessionsClient = SessionsClient.create()) {
      // Set the session name using the sessionId (UUID) and projectID (my-project-id)
      SessionName session = SessionName.of(projectId, sessionId);
      System.out.println("Session Path: " + session.toString());

      // Detect intents for each text input
      for (String text : texts) {
        // Set the text (hello) and language code (en-US) for the query
        TextInput.Builder textInput =
            TextInput.newBuilder().setText(text).setLanguageCode(languageCode);

        // Build the query with the TextInput
        QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

        // Performs the detect intent request
        DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);

        // Display the query result
        QueryResult queryResult = response.getQueryResult();

        System.out.println("====================");
        System.out.format("Query Text: '%s'\n", queryResult.getQueryText());
        System.out.format(
            "Detected Intent: %s (confidence: %f)\n",
            queryResult.getIntent().getDisplayName(), queryResult.getIntentDetectionConfidence());
        System.out.format(
            "Fulfillment Text: '%s'\n",
            queryResult.getFulfillmentMessagesCount() > 0
                ? queryResult.getFulfillmentMessages(0).getText()
                : "Triggered Default Fallback Intent");

        queryResults.put(text, queryResult);
      }
    }
    return queryResults;
  }
}