package com.web.cyneuro.reports.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.cyneuro.reports.reports;
import com.web.cyneuro.reports.repository.reportsRepository;

@Service
public class reportsService {

	@Autowired
	reportsRepository reportsRep;
 
	public List<reports> findByTitleContaining(String genes) {
		return reportsRep.findByTitleContaining(genes);
	}
	
	public List<reports> findByAbstractsContaining(String genes) {
		return reportsRep.findByAbstractsContaining(genes);
	}
	
	public List<reports> findByFullPaperContaining(String genes) {
		return reportsRep.findByFullPaperContaining(genes);
	}
	

}
