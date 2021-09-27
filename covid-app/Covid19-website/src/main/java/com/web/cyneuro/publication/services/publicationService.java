package com.web.cyneuro.publication.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.cyneuro.publication.model.articles;
import com.web.cyneuro.publication.repo.ArticlesRepository;

@Service
public class publicationService {

	@Autowired
	ArticlesRepository ArticlesRepository;
 
	public List<articles> findByTitleContaining(String title) {
		return ArticlesRepository.findByTitleContaining(title);
	}
	
	public List<articles> findByAbstractsContaining(String title) {
		return ArticlesRepository.findByAbstractsContaining(title);
	}

	
	public Optional<articles> findById(Long id_) {
		return ArticlesRepository.findById(id_);
	}
	

}
