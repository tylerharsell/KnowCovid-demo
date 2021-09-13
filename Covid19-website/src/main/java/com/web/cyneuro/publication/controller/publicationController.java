package com.web.cyneuro.publication.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Controller;
import com.web.cyneuro.publication.model.articles;
import com.web.cyneuro.publication.model.RecommendModel;
import com.web.cyneuro.publication.repo.ArticlesRepository;
import com.web.cyneuro.publication.utility.JSONtoObject;

@Controller
@RequestMapping("/publications")
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
		List<articles> articles2 = articlesRepository.findByJournalContaining(search);
		System.out.println(articles1.size());
		System.out.println(articles2.size());
		if(articles1.size()>0) {
			for(articles article: articles1 ) {
				if(!(articlesFinal.contains(article))){
					articlesFinal.add(article);
				}
			}
		}
		if(articles2.size()>0) {
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
}
