package com.web.cyneuro;

import static org.junit.Assert.assertEquals;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.StringWriter;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.python.core.Py;
import org.python.core.PySystemState;
import org.python.util.PythonInterpreter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FilterController {
	
	@Autowired
	private Environment env;
	
	@PostMapping("/executeScriptListTopic")
	@ResponseBody
    public String executeScript(@RequestBody String request) throws Exception {
    	JSONParser parser = new JSONParser();

		JSONObject json=(JSONObject) parser.parse(request);
    	String command = env.getProperty("python.topiclist.command");
    	System.out.print(command);
		String result = executeScriptProcess(command);
		System.out.print(result);
		result = result.replace("'", "\"");
		
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
		String result = executeScriptProcess(command + " "+topicSelected + " " + levelSelected);
		result = result.replace("'", "\"");
		System.out.println(result);
        return result;
    }
    
    
    public String executeScriptProcess(String command) throws Exception {

    	
		BufferedReader reader = null;
		InputStreamReader in=null;
		String finalOutput = "";

		try {
//			String[] commands = {"python", "/Users/chengxiyao/Lab_researches/git_code/covid19/list_topic.py"};
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
		
//		try {
//			String[] commands = new String[] {"python3", "/Users/chengxiyao/Lab_researches/git_code/covid19/list_topic.py"};
//			Process process = Runtime.getRuntime().exec(commands);
//			InputStreamReader ir = new InputStreamReader(process.getInputStream());
//			LineNumberReader input = new LineNumberReader(ir);
//			finalOutput = input.readLine();
//			
//			input.close();
//			ir.close();
//			int re  = process.waitFor();
//			System.out.println(finalOutput);
//			
//			InputStream errorStream = process.getErrorStream();
//			BufferedReader error = new BufferedReader(new InputStreamReader(errorStream, "gbk"));
//
//			String line = null;
//			while ((line = error.readLine()) != null){
//			System.out.println(line);
//			}
//			error.close();
//		} catch (Exception e) {
//			System.out.println("There is an error!");
//			System.out.println(e);
//		}
		return finalOutput;

	}
}
