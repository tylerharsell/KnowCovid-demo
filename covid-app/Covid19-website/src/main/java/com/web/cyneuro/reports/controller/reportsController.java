package com.web.cyneuro.reports.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

import com.web.cyneuro.publication.model.articles;
import com.web.cyneuro.reports.genes;
import com.web.cyneuro.reports.drugs;
import com.web.cyneuro.publication.repo.ArticlesRepository;
import com.web.cyneuro.reports.repository.genesRepository;
import com.web.cyneuro.reports.repository.drugsRepository;
import com.web.cyneuro.publication.services.publicationService;
import com.web.cyneuro.reports.service.genesService;
import com.web.cyneuro.reports.service.drugsService;

@Controller
@RequestMapping("/reports")
@ComponentScan(basePackages = {"com.web.cyneuro"})
public class reportsController{

	
	@Autowired
	publicationService publicationService;
	@Autowired
	genesService genesService;
	@Autowired
	drugsService drugsService;	
 
	/**
	 * 
	 * Get articles results about genes, and return it.
	 * 
	 * @param request
	 * @param articles
	 * @return
	 */
	@RequestMapping("/doAnalysisGenes")
	public Map<String, List<articles>> genesAnalysis(HttpServletRequest request, articles articles, genes genes) {
//		String title = request.getParameter("title");
//		String abstracts = request.getParameter("abstracts");
//		String full_paper = request.getParameter("full_paper");
//		String genes_name = request.getParameter("genes");
		
		Map<String, List<articles>> paperDict = new HashMap<String, List<articles>>();
		
		List<genes> genes_list = genesService.findAll();
		
		if(genes_list.size()>0) {
			for (genes gene : genes_list) {
				String gene_name = gene.getName();
				List<articles> all_gene_paper_list = new ArrayList<articles>();
				List<articles> gene_paper_list_title = publicationService.findByTitleContaining(gene_name);
				List<articles> gene_paper_list_abstract = publicationService.findByAbstractsContaining(gene_name);
				
				all_gene_paper_list.addAll(gene_paper_list_title);
				all_gene_paper_list.removeAll(gene_paper_list_abstract);
				all_gene_paper_list.addAll(gene_paper_list_abstract);

				
				if(!paperDict.containsKey(gene_name)) {
					paperDict.put(gene_name, all_gene_paper_list);
				}else {
					all_gene_paper_list.removeAll(paperDict.get(gene_name));
					all_gene_paper_list.addAll(paperDict.get(gene_name));
					paperDict.put(gene_name, all_gene_paper_list);
				}
			}
		}
		
		System.out.print(paperDict.size());
		return paperDict;
	}
	/**
	 * 
	 * Get articles results about drugs, and return it.
	 * 
	 * @param request
	 * @param articles
	 * @return
	 */
	@RequestMapping("/doAnalysisDrugs")
	public Map<String, List<articles>> drugsAnalysis(HttpServletRequest request, articles articles, drugs drugs) {
		
		Map<String, List<articles>> paperDict = new HashMap<String, List<articles>>();
		
		List<drugs> drugs_list = drugsService.findAll();
		
		if(drugs_list.size()>0) {
			for (drugs drug : drugs_list) {
				String drug_name = drug.getName();
				List<articles> all_gene_paper_list = new ArrayList<articles>();
				List<articles> gene_paper_list_title = publicationService.findByTitleContaining(drug_name);
				List<articles> gene_paper_list_abstract = publicationService.findByAbstractsContaining(drug_name);
				
				all_gene_paper_list.addAll(gene_paper_list_title);
				all_gene_paper_list.removeAll(gene_paper_list_abstract);
				all_gene_paper_list.addAll(gene_paper_list_abstract);

				if(!paperDict.containsKey(drug_name)) {
					paperDict.put(drug_name, all_gene_paper_list);
				}else {
					all_gene_paper_list.removeAll(paperDict.get(drug_name));
					all_gene_paper_list.addAll(paperDict.get(drug_name));
					paperDict.put(drug_name, all_gene_paper_list);
				}
			}
		}
		
		System.out.print(paperDict.size());	
		return paperDict;
	}

}

