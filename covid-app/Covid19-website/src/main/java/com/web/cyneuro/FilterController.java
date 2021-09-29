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

import org.apache.commons.lang3.StringUtils;
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
  
	
	@PostMapping("/executeScriptListTopic")
	@ResponseBody
    public String executeScript(@RequestBody String request) throws Exception {
    	JSONParser parser = new JSONParser();

		JSONObject json=(JSONObject) parser.parse(request);
	    	String command = env.getProperty("python.topiclist.command");
	    	System.out.println(command);
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
		
//    		String command = env.getProperty("python.filterdocs.command");
    		String url = env.getProperty("python.service.url");
    		url += "/filter_documents";
    		System.out.println("=====");
    		System.out.println(url);
//		String result = executeScriptProcess(command + " "+topicSelected + " " + levelSelected);

    		MultiValueMap<String, String> paramMap = new LinkedMultiValueMap<>();
    	    paramMap.add("topic_id",topicSelected);
    	    paramMap.add("level", levelSelected);
		String result = "";
		JSONObject result1 = null;
		try {
			result = restTemplate.postForObject(url, paramMap, String.class);
			result = result.replace("'", "\"");
//			System.out.print(result.length());
			result = jsonString(result);
//			System.out.print(result.charAt(7490));
//			System.out.print(result.charAt(7491));
//			System.out.print(result.charAt(7492));
//			System.out.print(result.charAt(7493));
//			JSONParser parser1 = new JSONParser();  
//			result1 = (JSONObject) parser1.parse(result);  
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
    
    public static String jsonString(String s) {
        char[] temp = s.toCharArray();
        int n = temp.length;
        for (int i = 0; i < n; i++) {
            if (temp[i] == ':') {
                int quentIndex = i + 1;
                while (StringUtils.isBlank(String.valueOf(temp[quentIndex]))) {
                    quentIndex++;
                }
                if (temp[quentIndex] == '"') {
                    for (int j = quentIndex + 1; j < n; j++) {
                        if (temp[j] == '"') {
                            if (temp[j + 1] != ',' && temp[j + 1] != '}') {
                                temp[j] = '”';
                            } else if (temp[j + 1] == ',' || temp[j + 1] == '}') {
                                break;
                            }
                        }
                    }
                }
            }
        }
        return new String(temp);
    }
}
