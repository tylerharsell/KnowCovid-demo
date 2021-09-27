package com.web.cyneuro.reports.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.cyneuro.reports.genes;
import com.web.cyneuro.reports.repository.genesRepository;

@Service
public class genesService {

	@Autowired
	genesRepository genesRep;
 
	public List<genes> findAll() {
		return genesRep.findAll();
	}
	

}
