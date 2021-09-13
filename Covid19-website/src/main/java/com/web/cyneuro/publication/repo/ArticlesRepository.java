package com.web.cyneuro.publication.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.cyneuro.publication.model.articles;


@Repository
public interface ArticlesRepository extends JpaRepository<articles, Long> {

	List<articles> findByTitleContaining(String title);
	
	List<articles> findByJournalContaining(String journal);
	
	List<articles> findByYear(String year);
	
	List<articles> findByMonth(String month);
	
}