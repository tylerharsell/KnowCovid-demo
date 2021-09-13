package com.web.cyneuro.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.cyneuro.user.users;
import com.web.cyneuro.user.repository.userRepository;

@Service
public class userService {

	@Autowired
	userRepository userDao;
 
	public users FindNameAndPsw(String username, String password) {
		return userDao.findByUsernameAndPassword(username, password);
	}
	public void save(users user1) {
		userDao.save(user1);
	}
	public List<users> findByName(String username) {
		return userDao.findByUsername(username);
	}
	
	public users findByEmail(String email) {
		return userDao.findByEmail(email);
	}
	
	public users FindByEmailAndPsw(String email, String password) {
		return userDao.findByEmailAndPassword(email, password);
	}
	

}
