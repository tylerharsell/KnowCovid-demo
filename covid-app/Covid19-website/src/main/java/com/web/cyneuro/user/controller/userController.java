package com.web.cyneuro.user.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

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

import com.web.cyneuro.user.users;
import com.web.cyneuro.user.service.userService;

@Controller
@RequestMapping("/user")
@ComponentScan(basePackages = {"com.web.cyneuro"})
public class userController {

	@Autowired
	userService userService;
	
	
	@GetMapping("/")
	public String index() {
		return "index";
	}
	
  
	/**
	 * Go to register page
	 * 
	 * @return
	 */
	@RequestMapping("/register")
	public String register() {
		return "register";
	}
 
	/**
	 * 
	 * Doing registration, then go to index page or go to register page(when failed)
	 * 
	 * @param request
	 * @param user
	 * @return
	 */
	@RequestMapping("/doregister")
	public ModelAndView register(HttpServletRequest request, users user, Map<String, Object> map) {
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String password2 = request.getParameter("password2");
		String email = request.getParameter("email");
		String organization = request.getParameter("organization");
		String title = request.getParameter("title");
		String topics = request.getParameter("topics");
		String description = request.getParameter("description");
		
		if (password.equals(password2)) {
			if (registerUser(email) == true) {
				users user1 = new users();
				user1.setUsername(username);
				user1.setPassword(password);
				user1.setEmail(email);
				user1.setOrganization(organization);
				user1.setTitle(title);
				user1.setDescription(description);
				SimpleDateFormat sdf = new SimpleDateFormat();
		        sdf.applyPattern("yyyy-MM-dd HH:mm:ss a");  
		        Date date = new Date();
		        user1.setCreatetime(date);
				userService.save(user1);
				ModelAndView mav =new ModelAndView("redirect:/login");
				return mav;
			} else {
				map.put("msg", "Email address is invalid! Please try another email.");
				ModelAndView mav = new ModelAndView("redirect:/user/register?error=true");
				return mav;
			}
		} else {
			map.put("msg", "Two passwords are not equal.");
			ModelAndView mav = new ModelAndView("redirect:/user/register?error=true");
			return mav;
		}
	}
 
	public Boolean registerUser(String email) {
		Boolean a = true;
		if (userService.findByEmail(email) == null) {
			return a;
		} else {
			return false;
		}
	}
 
	
 
	/**
	 * Doing login
	 * 
	 * @param request
	 * @return
	 */
	@PostMapping("/dologin")
	public ModelAndView dologin(HttpServletRequest request, Map<String, Object> map) {
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		if (email == null || password == null) {
			map.put("msg", "Username or password is required!");
			ModelAndView mav = new ModelAndView("redirect:/login?error=true");
			return mav;
		}
		users user = userService.FindByEmailAndPsw(email, password);
		if (user != null) {
			map.put("msg", "Successfully!");
			map.put("username", user.getUsername());
			System.out.print(user.getUsername());
			ModelAndView mav =new ModelAndView("redirect:/#!/introduction");
			return mav;
		} else {
			map.put("msg", "Login failed! Please try again.");
			System.out.println(map);
//				model.addAttribute("msg", "Login failed! Please try again!");
			ModelAndView mav = new ModelAndView("redirect:/login?error=true");
			return mav;			
		}
	}
	
	@RequestMapping("/logout")
	public String logoutUser( HttpServletRequest request){
		
		HttpSession httpSession = request.getSession();
		httpSession.removeAttribute("UserSessionVO");
		
		return "redirect:/";
		
	}
	
	/**
	 * Starting questionnaire
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/getSurvay")
	public ModelAndView getSurvay(HttpServletRequest request) {

		ModelAndView mav = new ModelAndView("survay");; 
		mav.addObject("id", request.getParameter("id"));
		return mav;
			
	}

}

