package com.web.cyneuro.publication.utility;

import java.util.Arrays;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class RestClient {

	//public static final String API_SANDBOX_URL = "http://204.76.187.58:8080/OnTimeRecommendAPI/";
	//public static final String API_SANDBOX_URL = "http://localhost:9090/OnTimeRecommendAPI/";
	
	public static final String API_SANDBOX_URL = "http://localhost:8050/";
	
	public static String callRestAPI(Object input, String url, HttpMethod methodType) {

		String URL = API_SANDBOX_URL + url;

		String response = null;
		ResponseEntity<String> result = null;
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.setContentType(MediaType.APPLICATION_JSON);
		requestHeaders.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = null;

		if (methodType == HttpMethod.POST) {
			String inputJSON = "";
			if(null != input) {
				inputJSON = JSONtoObject.ObjecttoJson(input);
				
			}
			entity = new HttpEntity<String>(inputJSON, requestHeaders);
			result = restTemplate.exchange(URL, HttpMethod.POST, entity, String.class);

		} else if (methodType == HttpMethod.GET) {
			entity = new HttpEntity<String>(requestHeaders);
			result = restTemplate.exchange(URL, HttpMethod.GET, entity, String.class);
		}

		if (result.getStatusCode().equals(HttpStatus.OK)) {
			response = result.getBody();
		}

		return response;

	}
	
	public static String callRestAPIForRecommender(Object input, String url, HttpMethod methodType) {


		String response = null;
		ResponseEntity<String> result = null;
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.setContentType(MediaType.APPLICATION_JSON);
		requestHeaders.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = null;

		if (methodType == HttpMethod.POST) {
			String inputJSON = "";
			if(null != input) {
				inputJSON = JSONtoObject.ObjecttoJson(input);
				
			}
			entity = new HttpEntity<String>(inputJSON, requestHeaders);
			result = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

		} else if (methodType == HttpMethod.GET) {
			entity = new HttpEntity<String>(requestHeaders);
			result = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
		}

		if (result.getStatusCode().equals(HttpStatus.OK)) {
			response = result.getBody();
		}

		return response;

	}

	public static String callRestGITHUBAPI(Object input, String url, HttpMethod methodType) {

		String result = null;

		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<String> entity = null;
		ResponseEntity<String> response = null;

		if (methodType == HttpMethod.POST) {

			String inputJSON = JSONtoObject.ObjecttoJson(input);
			entity = new HttpEntity<String>(inputJSON, headers);
			response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

		} else if (methodType == HttpMethod.GET) {
			entity = new HttpEntity<String>(headers);
			response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

		}

		if (response.getStatusCode().equals(HttpStatus.OK)) {
			result = response.getBody();
		}

		return result;

	}

}
