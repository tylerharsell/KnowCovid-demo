package com.web.cyneuro;

import javax.servlet.http.HttpServletRequest;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;


import com.web.cyneuro.user.users;
import com.web.cyneuro.user.service.userService;


@Controller
@SpringBootApplication
public class Application {
	
	
	public static void main(String[] args) {
		System.setProperty("server.contextPath", "/Covid-19");

		SpringApplication.run(Application.class, args);
		
	
	}
	
	@RequestMapping("/")
	public ModelAndView welcomePage(HttpServletRequest request) {
				
    	ModelAndView mav =new ModelAndView("index");
    	return mav;
				
	}
	
	@RequestMapping("/login")
	public ModelAndView loginPage(HttpServletRequest request) {
		System.out.println("Done!!!!!!");
    	ModelAndView mav =new ModelAndView();
    	mav.setViewName("login");
    	return mav;
				
	}
	
	
	
}
