package com.web.cyneuro.publication.model;

import javax.persistence.Entity;
import java.util.Date;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;



import javax.persistence.Column;
import lombok.Data;

@Entity(name = "articles")
public class articles {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
    private String title;
    private String abstracts;
    private String publish_time;
    private String authors;
    private String journal;
    private String url;
    private String clinical_category;
    private Integer level; 
    
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}
	
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getAbstracts() {
		return abstracts;
	}

	public void setAbstracts(String abstracts) {
		this.abstracts = abstracts;
	}
	
	public String getPublish_time() {
		return publish_time;
	}

	public void setPublish_time(String publish_time) {
		this.publish_time = publish_time;
	}
	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
	public String getJournal() {
		return journal;
	}

	public void setJournal(String journal) {
		this.journal = journal;
	}
	
	public String getAuthors() {
		return authors;
	}

	public void setAuthor(String authors) {
		this.authors = authors;
	}
	
	public String getClinical_category() {
		return clinical_category;
	}

	public void setClinical_category(String clinical_category) {
		this.clinical_category = clinical_category;
	}
}
