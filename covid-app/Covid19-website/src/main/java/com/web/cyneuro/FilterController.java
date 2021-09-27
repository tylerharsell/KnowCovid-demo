package com.web.cyneuro;

import static org.junit.Assert.assertEquals;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.StringWriter;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.python.core.Py;
import org.python.core.PySystemState;
import org.python.util.PythonInterpreter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@Service
public class FilterController {
	
	@Autowired
	private Environment env;
	RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
//    headers.setContentType(MediaType.APPLICATION_JSON);
	
	@PostMapping("/executeScriptListTopic")
	@ResponseBody
    public String executeScript(@RequestBody String request) throws Exception {
    	JSONParser parser = new JSONParser();

		JSONObject json=(JSONObject) parser.parse(request);
	    	String command = env.getProperty("python.topiclist.command");
	    	System.out.print(command);
	//		String result = executeScriptProcess(command);
	    	String url = env.getProperty("python.service.url");
	    	url += "/get_topics";
	    	System.out.print(url);
	    	String result = "";
	    	try {
	    		result = restTemplate.getForObject(url, String.class);
	    		System.out.print(result);
	    		result = result.replace("'", "\"");
	    	} catch (Exception e) {
	    		e.printStackTrace();
	    	}
		
		
	    return result;
    }
    
	@PostMapping("/executeScriptFilterDocs")
	@ResponseBody
    public String executeScriptFilterDocs(@RequestBody String request) throws Exception {

    		JSONParser parser = new JSONParser();
		JSONObject json=(JSONObject) parser.parse(request);
		String topicSelected = String.valueOf(json.get("topicSelected"));
		String levelSelected = String.valueOf(json.get("levelSelected"));
		
    		String command = env.getProperty("python.filterdocs.command");
    		String url = env.getProperty("python.service.url");
    		url += "/filter_documents";
    		System.out.print(url);
//		String result = executeScriptProcess(command + " "+topicSelected + " " + levelSelected);
//    		HttpHeaders headers = new HttpHeaders();
//    		headers.setContentType(MediaType.parseMediaType(MediaType.APPLICATION_OCTET_STREAM + ";charset=UTF-8"));
//    		HttpEntity<String> httpEntity = new HttpEntity<>(request, headers);
    		MultiValueMap<String, String> paramMap = new LinkedMultiValueMap<>();
    	    paramMap.add("topic_id",topicSelected);
    	    paramMap.add("level", levelSelected);
		String result = "";
		try {
			System.out.print(paramMap);
			result = restTemplate.postForObject(url, paramMap, String.class);
			result = result.replace("'", "\"");
			System.out.println(result);
		}catch (Exception e) {
			e.printStackTrace();
		}
        return result;
    }
    
    
    public String executeScriptProcess(String command) throws Exception {

    	
		BufferedReader reader = null;
		InputStreamReader in=null;
		String finalOutput = "";

		try {
			Process process = Runtime.getRuntime().exec(command);
			in = new InputStreamReader(process.getInputStream());
			LineNumberReader input = new LineNumberReader(in);
			System.out.println("\n"+input.readLine());
			process.waitFor();
			String output = "";
			while ((output = input.readLine()) != null) {
				finalOutput = finalOutput + output;
			}
			
			in.close();
			process.waitFor();

		} catch (Exception e) {
			throw e;
		}finally {			
			if(null != in)
				in.close();
		
		}
		
		return finalOutput;

	}
}
