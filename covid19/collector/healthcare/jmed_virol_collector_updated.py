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
    base_url = 'https://onlinelibrary.wiley.com/action/doSearch?AllField=coronavirus+OR+covid-19&SeriesKey=10969071&pageSize=20&startPage=%d'
    papers_info = {}
    papers_original = {}
    driver = webdriver.Firefox(executable_path = r'C:\Users\vekar\Documents\geckodriver\geckodriver.exe')	
    k = 0
    for item in range(0, 12):
        print("Processing lancet Virology %s page.... " % item)
        url = base_url % item
        sys.stdout.flush()
        try:
            driver.get(url)
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
            #time.sleep(5)
            articledetails = driver.find_elements_by_xpath("//*[@class='item__body']")
            print(len(articledetails))
            for articledetail in articledetails:
                 title = ''
                 year = ''
                 month = ''
                 content = ''
                 articleTitle = articledetail.find_element_by_class_name('publication_title')
                 #aLink = articleTitle.find_elements_by_tag_name('a')
                 title = articleTitle.text
                 k = k +1
                 print('Processing jmed Virology article : ', k , title)
                 yearDiv = articledetail.find_element_by_class_name('meta__epubDate').text.split(":")[1]
                 #print('yearDiv : ', yearDiv)
                 year_k = len(yearDiv.split())-1
                 month_k = len(yearDiv.split())-2
                 m = {'jan': 1, 'feb': 2, 'mar': 3, 'apr':4, 'may':5, 'jun':6, 'jul':7, 'aug':8, 'sep':9, 'oct':10, 'nov':11, 'dec':12}
                 month = yearDiv.split()[month_k].strip()[:3].lower();
                 month = m[month] 
                 year = yearDiv.split()[year_k]
                 #print('month : ', month)
                 #print('year : ', year)
                 text_url = articleTitle.get_attribute("href")
                 key_ = text_url.split(".")[len(text_url.split("."))-1]
                 print('key_ : ', key_)
                 driver_content = webdriver.Firefox(executable_path = r'C:\Users\vekar\Documents\geckodriver\geckodriver.exe')
                 driver_content.get(text_url)
                 driver_content.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
                 articleContents = driver_content.find_elements_by_xpath("//*[@class='article-section__content']")
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
    driver.quit() 
    print("%d papers are collected from JMED Virology Mechanism page" % len(papers_info))
	    # Writing output to a JSON file
    with open(JMED_VIROL_INFO_PATH, 'w') as fp:
        json.dump(papers_info, fp)

    with open(JMED_VIROL_ORI_PATH, 'w') as fp:
        json.dump(papers_original, fp)

    # Writing output to a JSON file
    #with open(JMED_VIROL_INFO_PATH, 'w') as fp:
    #    json.dump(papers_info, fp)

    #with open(JMED_VIROL_ORI_PATH, 'w') as fp: