package com.web.cyneuro.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.web.cyneuro.user.users;


@Repository
public interface userRepository extends JpaRepository<users, Long> {

	public users findByUsernameAndPassword(String username, String password);
	
	public List<users> findByUsername(String username);
	
	public users findByEmail(String email);
	
	public users findByEmailAndPassword(String email, String password);
	
}
