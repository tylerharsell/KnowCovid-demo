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

import com.web.cyneuro.reports.reports;
import com.web.cyneuro.reports.genes;
import com.web.cyneuro.reports.drugs;
import com.web.cyneuro.reports.repository.reportsRepository;
import com.web.cyneuro.reports.repository.genesRepository;
import com.web.cyneuro.reports.repository.drugsRepository;
import com.web.cyneuro.reports.service.reportsService;
import com.web.cyneuro.reports.service.genesService;
import com.web.cyneuro.reports.service.drugsService;

@Controller
@RequestMapping("/reports")
@ComponentScan(basePackages = {"com.web.cyneuro"})
public class reportsController {

	@Autowired
	reportsRepository reportsRepository;
	genesRepository genesRepository;
	drugsRepository drugsRepository;
	
	
	@GetMapping("/")
	public String index() {
		return "index";
	}
	
 
	/**
	 * 
	 * Get reports results about genes, and return it.
	 * 
	 * @param request
	 * @param reports
	 * @return
	 */
	@RequestMapping("/doAnalysisGenes")
	public Map<String, List<reports>> genesAnalysis(HttpServletRequest request, reports reports, genes genes) {
//		String title = request.getParameter("title");
//		String abstracts = request.getParameter("abstracts");
//		String full_paper = request.getParameter("full_paper");
//		String genes_name = request.getParameter("genes");
		
		Map<String, List<reports>> paperDict = new HashMap<String, List<reports>>();
		
		List<genes> genes_list = genesRepository.findAll();
		
		if(genes_list.size()>0) {
			for (genes gene : genes_list) {
				String gene_name = gene.getGenes();
				List<reports> all_gene_paper_list = new ArrayList<reports>();
				List<reports> gene_paper_list_title = reportsRepository.findByTitleContaining(gene_name);
				List<reports> gene_paper_list_abstract = reportsRepository.findByAbstractsContaining(gene_name);
				List<reports> gene_paper_list_full = reportsRepository.findByFullPaperContaining(gene_name);
				
				all_gene_paper_list.addAll(gene_paper_list_title);
				all_gene_paper_list.removeAll(gene_paper_list_abstract);
				all_gene_paper_list.addAll(gene_paper_list_abstract);
				all_gene_paper_list.removeAll(gene_paper_list_full);
				all_gene_paper_list.addAll(gene_paper_list_full);
				
				if(!paperDict.containsKey(gene_name)) {
					paperDict.put(gene_name, all_gene_paper_list);
				}else {
					all_gene_paper_list.removeAll(paperDict.get(gene_name));
					all_gene_paper_list.addAll(paperDict.get(gene_name));
					paperDict.put(gene_name, all_gene_paper_list);
				}
			}
		}
		
		
		return paperDict;
	}
	/**
	 * 
	 * Get reports results about drugs, and return it.
	 * 
	 * @param request
	 * @param reports
	 * @return
	 */
	@RequestMapping("/doAnalysisDrugs")
	public Map<String, List<reports>> drugsAnalysis(HttpServletRequest request, reports reports, drugs drugs) {
		
		Map<String, List<reports>> paperDict = new HashMap<String, List<reports>>();
		
		List<drugs> drugs_list = drugsRepository.findAll();
		
		if(drugs_list.size()>0) {
			for (drugs drug : drugs_list) {
				String drug_name = drug.getDrugs();
				List<reports> all_gene_paper_list = new ArrayList<reports>();
				List<reports> gene_paper_list_title = reportsRepository.findByTitleContaining(drug_name);
				List<reports> gene_paper_list_abstract = reportsRepository.findByAbstractsContaining(drug_name);
				List<reports> gene_paper_list_full = reportsRepository.findByFullPaperContaining(drug_name);
				
				all_gene_paper_list.addAll(gene_paper_list_title);
				all_gene_paper_list.removeAll(gene_paper_list_abstract);
				all_gene_paper_list.addAll(gene_paper_list_abstract);
				all_gene_paper_list.removeAll(gene_paper_list_full);
				all_gene_paper_list.addAll(gene_paper_list_full);
				
				if(!paperDict.containsKey(drug_name)) {
					paperDict.put(drug_name, all_gene_paper_list);
				}else {
					all_gene_paper_list.removeAll(paperDict.get(drug_name));
					all_gene_paper_list.addAll(paperDict.get(drug_name));
					paperDict.put(drug_name, all_gene_paper_list);
				}
			}
		}
				
		return paperDict;
	}

}

