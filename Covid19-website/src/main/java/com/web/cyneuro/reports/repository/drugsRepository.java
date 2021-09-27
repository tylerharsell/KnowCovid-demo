package com.web.cyneuro.reports.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;
 
import com.web.cyneuro.reports.drugs;


@Repository
@EnableJpaRepositories
public interface drugsRepository extends JpaRepository<drugs, Long> {
	
	public List<drugs> findAll();

	
}