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
    #base_url = 'https://jamanetwork.com/searchresults?q=coronavirus+or+covid19&f_ContentType=Article&exPrm_qqq=%7b!payloadDisMaxQParser+pf%3dTags+qf%3dTags%5e0.0000001+payloadFields%3dTags+bf%3d%7d%22coronavirus+or+covid19%22&exPrm_hl.q=coronavirus+or+covid19&page=%d'
    papers_info = {}
    papers_original = {}
    driver = webdriver.Firefox(executable_path = r'C:\Users\vekar\Documents\geckodriver\geckodriver.exe')	
    k = 0
    for item in range(1, 11):
        print("Processing JAMA %s page.... " % item)
        url =  'https://jamanetwork.com/searchresults?q=coronavirus+or+covid19&f_ContentType=Article&exPrm_qqq=%7b!payloadDisMaxQParser+pf%3dTags+qf%3dTags%5e0.0000001+payloadFields%3dTags+bf%3d%7d%22coronavirus+or+covid19%22&exPrm_hl.q=coronavirus+or+covid19&page='+str(item)
        sys.stdout.flush()
        try:
            driver.get(url)
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
            #time.sleep(5)
            articledetails = driver.find_elements_by_xpath("//*[@class='article search-result']")
            print(len(articledetails))
            for articledetail in articledetails:
                 title = ''
                 year = ''
                 month = ''
                 content = ''
                 try:
                      articleTitle = articledetail.find_element_by_class_name('article--title')
                      aLink = articleTitle.find_elements_by_tag_name('a')[0]
                      title = aLink.text
                      k = k +1
                      print('Processing JAMA article : ', k , title)
                      date = articledetail.find_element_by_class_name('article--pub-date').text.split(); 
                      year = date[len(date)-1]
                      month_k = date[0]
                      m = {'jan': 1, 'feb': 2, 'mar': 3, 'apr':4, 'may':5, 'jun':6, 'jul':7, 'aug':8, 'sep':9, 'oct':10, 'nov':11, 'dec':12}
                      month = month_k.split()[0].strip()[:3].lower();
                      month = m[month] 
                      #print('month : ', month)
                      #print('year : ', year)
                      #break
                      #articleLink = articledetail.find_element_by_class_name('m-result__link')
                      text_url = aLink.get_attribute("href")
                      key_ =  articledetail.find_element_by_class_name('article--citation').text.split("/")[1].strip()
                      #print('text_url : ', text_url)
                      #print('key_ : ', key_)
                      #break
                      driver_content = webdriver.Firefox(executable_path = r'C:\Users\vekar\Documents\geckodriver\geckodriver.exe')
                      driver_content.get(text_url)
                      driver_content.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
                      articleContents = driver_content.find_elements_by_xpath("//*[@class='article-full-text']")
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
    print("%d papers are collected from Clinical Infectious Diseases Mechanism page" % len(papers_info))
    # Writing output to a JSON file
    with open(JAMA_VIROL_INFO_PATH, 'w') as fp:
        json.dump(papers_info, fp)

    with open(JAMA_VIROL_ORI_PATH, 'w') as fp:
        json.dump(papers_original, fp)