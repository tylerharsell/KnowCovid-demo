package com.web.cyneuro.publication.controller;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.web.cyneuro.publication.model.articles;
import com.web.cyneuro.publication.repo.ArticlesRepository;

@Controller
@RequestMapping("/publications")
@ComponentScan(basePackages = {"com.web.cyneuro"})
public class publicationController {

	@Autowired
	private ArticlesRepository articlesRepository;
	
	
	@PostMapping("/search")
	@ResponseBody
    public List<articles> runModel(@RequestBody String req) throws Exception {
    	System.out.println(req);
    	if(req == null) {
    		return null;
    	}else {
    	
		List<articles> articlesFinal = new ArrayList();
		String search = "";
		search = req.toLowerCase().replaceAll(" of "," ");
		search = search.toLowerCase().replaceAll(" or "," ");
		search = search.toLowerCase().replaceAll(" the "," ");
		search = search.toLowerCase().replaceAll(" in "," ");
		search = search.toLowerCase().replaceAll(" on "," ");
		search = search.toLowerCase().replaceAll("covid19","covid-19");
		search = search.toLowerCase().replaceAll("covid 19","covid-19");
		
		List<articles> articles1 = articlesRepository.findByTitleContaining(search);
		List<articles> articles2 = articlesRepository.findByAbstractsContaining(search);
		System.out.println(articles1.size());
		if(articles1.size()>0) {
			for(articles article: articles1 ) {
				if(!(articlesFinal.contains(article))){
					articlesFinal.add(article);
				}
			}
		}
		if (articles2.size()>0) {
			for(articles article: articles2 ) {
				if(!(articlesFinal.contains(article))){
					articlesFinal.add(article);
				}
			}
		}
		System.out.println(articlesFinal);
		return  articlesFinal;
    	}
    }
   
    @Autowired
    public Environment env;
	RestTemplate restTemplate = new RestTemplate();
    
    @PostMapping("/search_python")
	@ResponseBody
    public List<articles> runQuery(@RequestBody String req) throws Exception {
    	System.out.println(req);
    	if(req == null) {
    		return null;
    	}else {
    	
		List<articles> articlesFinal = new ArrayList();
		
		String search = "";
		search = req.toLowerCase().replaceAll(" of "," ");
		search = search.toLowerCase().replaceAll(" or "," ");
		search = search.toLowerCase().replaceAll(" the "," ");
		search = search.toLowerCase().replaceAll(" in "," ");
		search = search.toLowerCase().replaceAll(" on "," ");
		search = search.toLowerCase().replaceAll("covid19","covid-19");
		search = search.toLowerCase().replaceAll("covid 19","covid-19");
		String url = env.getProperty("python.service.url");
		url += "/query";
		System.out.println(url);
		MultiValueMap<String, String> paramMap = new LinkedMultiValueMap<>();
	    paramMap.add("query",req);
	    String result = restTemplate.postForObject(url, paramMap, String.class);
	    System.out.println(result);
	    
	    result = result.replace("[", "").replace("]", "");
	    String[] id_list = result.split(", ");
	    for(int i = 0; i<id_list.length;i++) {
	    	Long id_ = Long.parseLong(id_list[i]);
	    	Optional<articles> article = articlesRepository.findById(id_);
	    	try {
	    	articlesFinal.add(article.get());
	    	}catch (Exception e){
	    		e.printStackTrace();
	    	}
	    }
		
		System.out.println(articlesFinal);
		return  articlesFinal;
    	}
    }

}
