package com.web.cyneuro.user;

import javax.persistence.Entity;
import java.util.Date;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import lombok.Data;

@Entity(name = "users_profile")
public class users {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
    private String username; 
    private String email; 
    private String password; 
    private String organization;
    private String title;
    private String description;
    private Date createtime;
    private Date updatetime;
    private char questionnaire;
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
    
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	
	public Date getupdatetime() {
		return updatetime;
	}

	public void setupdatetime(Date updatetime) {
		this.updatetime = updatetime;
	}
	
	public char getQuestionnaire() {
		return questionnaire;
	}

	public void setQuestionnaire(char questionnaire) {
		this.questionnaire = questionnaire;
	}
	
}
