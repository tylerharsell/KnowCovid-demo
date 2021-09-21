from bs4 import BeautifulSoup
import os
from urllib.request import *
from selenium import webdriver
#from webdriver_manager.chrome import ChromeDriverManager
import json
import sys
import time
from constants import *
from urllib.request import Request, urlopen


def collector():
    topic_list = ["Mechanism", "Transmission", "Diagnosis", "Treatment", "Prevention"]

    # NOTE: added an extra '%' before each '%20' to support character format
    base_url = 'https://www.nejm.org/search?q=coronavirus+covid19&asug=%22covid-19%22#qs=%3Fq%3Dcoronavirus%2Bcovid19%26requestType%3Dajax%26asug%3D%2522covid-19%2522%26viewClass%3D%26page%3D1%26manualFilterParam%3DcontentAge_delimiter_contentAge_firstDelimiter'
    papers_info = {}
    papers_original = {}
    k = 0
    for item in range(1, 7):
        driver = webdriver.Firefox(executable_path = r'C:\Users\vekar\Documents\geckodriver\geckodriver.exe')	
        print("Processing New England Journal of Medicine %s page.... " % item)
        url = 'https://www.nejm.org/search?q=%22covid-19%22&asug=#qs=%3Fq%3D%2522covid-19%2522%26requestType%3Dajax%26asug%3D%26viewClass%3D%26page%3D'+ str(item) +'%26manualFilterParam%3DcontentAge_delimiter_contentAge_delimiter_contentAge_delimiter_contentAge_delimiter_contentAge_delimiter_contentAge_firstDelimiter'
        #print(url)
        sys.stdout.flush()
        try:
            driver.get(url)
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
            #time.sleep(5)
            articledetails = driver.find_elements_by_xpath("//*[@class='m-result ']")
            print(len(articledetails))
            for articledetail in articledetails:
                 title = ''
                 year = ''
                 month = ''
                 content = ''
                 try:
                      articleTitle = articledetail.find_element_by_class_name('m-result__title')
                      #aLink = articleTitle.find_elements_by_tag_name('a')
                      title = articleTitle.text
                      k = k +1
                      print('Processing New England Journal of Medicine article : ', k , title)
                      #break
                      yearDiv = articledetail.find_element_by_class_name('m-result__date').text.split(",")[1]
                      month_k = articledetail.find_element_by_class_name('m-result__date').text.split(",")[0]
                      m = {'jan': 1, 'feb': 2, 'mar': 3, 'apr':4, 'may':5, 'jun':6, 'jul':7, 'aug':8, 'sep':9, 'oct':10, 'nov':11, 'dec':12}
                      month = month_k.split()[0].strip()[:3].lower();
                      month = m[month] 
                      year = yearDiv
                      #print('month : ', month)
                      #print('year : ', year)
                      articleLink = articledetail.find_element_by_class_name('m-result__link')
                      text_url = articleLink.get_attribute("href")
                      key_ =  articleLink.get_attribute("data-search-result-id")
                      #print('text_url : ', text_url)
                      #print('key_ : ', key_)
                      driver_content = webdriver.Firefox(executable_path = r'C:\Users\vekar\Documents\geckodriver\geckodriver.exe')
                      driver_content.get(text_url)
                      driver_content.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
                      articleContents = driver_content.find_elements_by_xpath("//*[@class='m-inline-tabs__tab s-active']")
                      #print(len(articleContents))
                      for articleContent in articleContents:
                            content = content + articleContent.text
                      #print(content)
                      papers_original[key_] = content
                      papers_info[key_] = {'title': title, 'url': text_url, 'year': year, 'month': month}
                      driver_content.quit()
                      #break
                 except Exception as e:
                      # changed error code so that we can tell the difference between the two oops codes
                      print(e)
                      print("Big OOps: " + url)
                      continue
        except Exception as e:
            # changed error code so that we can tell the difference between the two oops codes
            print(e)
            print("Big OOps: " + url)
            continue
        driver.quit()
    print("%d papers are collected from New England Journal of Medicine Virology Mechanism page" % len(papers_info))
	    # Writing output to a JSON file
    with open(NEJM_VIROL_INFO_PATH, 'w') as fp:
        json.dump(papers_info, fp)

    with open(NEJM_VIROL_ORI_PATH, 'w') as fp:
        json.dump(papers_original, fp)

    # Writing output to a JSON file
    #with open(JMED_VIROL_INFO_PATH, 'w') as fp:
    #    json.dump(papers_info, fp)

    #with open(JMED_VIROL_ORI_PATH, 'w') as fp: