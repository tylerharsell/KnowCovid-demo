package com.web.cyneuro.publication.utility;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

public class JSONtoObject {

	public static <T> T  jsonToObject(String json, Class<?> classType ){

		Object map = null;
		try {
			ObjectMapper mapper = new ObjectMapper();

			map = mapper.readValue(json, classType);
			
		} catch (Exception e) {

			e.printStackTrace();
		} 

		return (T) map;
	
	}
	
	public static String ObjecttoJson(Object obj) {

		String output = null;
		
		try {
			
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			output = mapper.writeValueAsString(obj);
			
		} catch (Exception e) {

			e.printStackTrace();
		}


		return output;
		
	}
}
