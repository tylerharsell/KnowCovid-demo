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

    # NOTE: added an extra '%' before each '%20' to support character format
    base_url = 'https://www.thelancet.com/action/doSearch?journalCode=laninf&occurrences=all&searchText=Coronavirus+or+covid-19&seriesISSNFltraddfilter=1473-3099&seriesISSNFltraddfilter=1474-4457&searchType=quick&searchScope=series&rows=100&startPage='
    papers_info = {}
    papers_original = {}
    driver = webdriver.Firefox(executable_path = r'C:\Users\vekar\Documents\geckodriver\geckodriver.exe')	
    k = 0
    for item in range(0, 1):
        print("Processing lancet Virology %s page.... " % item)
        url = base_url
        sys.stdout.flush()
        try:
            driver.get(url)
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
            #time.sleep(5)
            articledetails = driver.find_elements_by_xpath("//*[@class='article-details']")
            print(len(articledetails))
            for articledetail in articledetails:
                 title = ''
                 year = ''
                 content = ''
                 try:
                       articleTitle = articledetail.find_element_by_tag_name('h2')
                       aLink = articleTitle.find_elements_by_tag_name('a')
                       title = aLink[1].text
                       k = k +1
                       print('Processing lancet Virology article : ', k , title)
                       yearDiv = articledetail.find_element_by_class_name('published-online')
                       len_k = len(yearDiv.text.split())-1
                       year = yearDiv.text.split()[len_k]
                       month = yearDiv.text.split()[1]
                       #print('month : ', month)
                       m = {'jan': 1, 'feb': 2, 'mar': 3, 'apr':4, 'may':5, 'jun':6, 'jul':7, 'aug':8, 'sep':9, 'oct':10, 'nov':11, 'dec':12}
                       month = month.split()[0].strip()[:3].lower();
                       month = m[month] 
                       formats = articledetail.find_element_by_class_name('formats')
                       aLinkContent = formats.find_elements_by_tag_name('a')
                       text_url = aLinkContent[1].get_attribute("href")
                       #print('text_url : ', text_url)
                       key_ = aLinkContent[2].get_attribute("data-pii")
                       key_ = key_.replace("(", "").replace(")", "")
                       #print('key_ : ', key_)
                       driver_content = webdriver.Firefox(executable_path = r'C:\Users\vekar\Documents\geckodriver\geckodriver.exe')
                       driver_content.get(text_url)
                       driver_content.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
                       articleContents = driver_content.find_elements_by_xpath("//*[@class='section-paragraph']")
                       #print('articleContents ', len(articleContents))
                       for articleContent in articleContents:
                             content = content + articleContent.text
                             #print(content)
                       papers_original[key_] = content
                       papers_info[key_] = {'title': title, 'url': text_url, 'year': year,  'month': month}
                       driver_content.quit()
                 #break
                 except Exception as e:
                       # changed error code so that we can tell the difference between the two oops codes
                       print("Error, ", e)
                       break
                       print("Big OOps: " + url)
                       continue
        except Exception as e:
            # changed error code so that we can tell the difference between the two oops codes
            print(e)
            print("Big OOps: " + url)
            continue
    driver.quit() 
    print("%d papers are collected from lancet Virology Mechanism page" % len(papers_info))
	    # Writing output to a JSON file
    with open(LANCET_VIROL_INFO_PATH, 'w') as fp:
        json.dump(papers_info, fp)

    with open(LANCET_VIROL_ORI_PATH, 'w') as fp:
        json.dump(papers_original, fp)

    # Writing output to a JSON file
    #with open(JMED_VIROL_INFO_PATH, 'w') as fp:
    #    json.dump(papers_info, fp)

    #with open(JMED_VIROL_ORI_PATH, 'w') as fp: