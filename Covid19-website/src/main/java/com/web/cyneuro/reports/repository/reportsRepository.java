package com.web.cyneuro.reports.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.web.cyneuro.reports.reports;
import com.web.cyneuro.reports.genes;
import com.web.cyneuro.reports.drugs;


@Repository
public interface reportsRepository extends JpaRepository<reports, Long> {
	
	public List<reports> findByTitleContaining(String genes);
	
	public List<reports> findByAbstractsContaining(String genes);

	public List<reports> findByFullPaperContaining(String genes);
}