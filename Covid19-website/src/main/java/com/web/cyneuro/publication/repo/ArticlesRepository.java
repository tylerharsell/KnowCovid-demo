package com.web.cyneuro.publication.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.cyneuro.publication.model.articles;


@Repository
public interface ArticlesRepository extends JpaRepository<articles, Long> {

	List<articles> findByTitleContaining(String title);
		
	Optional<articles> findById(Long id);
	
	List<articles> findAll();
	
	List<articles> findByAbstractsContaining(String genes);
	
	
}