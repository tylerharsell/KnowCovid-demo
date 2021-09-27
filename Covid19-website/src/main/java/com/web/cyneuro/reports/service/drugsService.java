package com.web.cyneuro.reports.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.cyneuro.reports.drugs;
import com.web.cyneuro.reports.repository.drugsRepository;

@Service
public class drugsService {

	@Autowired
	drugsRepository drugsRep;
 
	public List<drugs> findAll() {
		return drugsRep.findAll();
	}

}
