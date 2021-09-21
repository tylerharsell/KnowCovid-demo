from bs4 import BeautifulSoup
import os
from urllib.request import *
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import json
import sys
import time
from constants import *


def collector():
    topic_list = ["Mechanism", "Transmission", "Diagnosis", "Treatment", "Prevention"]

    # NOTE: added an extra '%' before each '%20' to support character format
    base_url = 'https://www.ncbi.nlm.nih.gov/research/coronavirus-api/feed/?filters=%%7B%%22topics%%22%%3A%%5B%%22%s' \
               '%%22%%5D%%2C%%22journal%%22%%3A%%5B%%22J%%20Med%%20Virol%%22%%5D%%7D'
    papers_info = {}
    papers_original = {}

    for item in topic_list:
        print("Processing JMED Virology %s page.... " % item)
        url = base_url % item
        sys.stdout.flush()
        try:
            response = urlopen(url)
            soup_info = BeautifulSoup(response.read(), "xml")

            for guid in soup_info.find_all('guid'):
                _url = guid.text
                # Get the article id from URL
                _id = _url.split('/')[-1]
                # Accessed from the PubMed online library
                pubmed_url = 'https://www.ncbi.nlm.nih.gov/pubmed/%s'
                r = urlopen(pubmed_url % _id)
                soup_ref = BeautifulSoup(r.read(), 'html.parser')

                for dd in soup_ref.find_all('dd'):
                    for link in dd.find_all('a', href=True):
                        _link = link.text
                        link_id = _link.split('.')[-1]
                        # Accessed from Wiley Online Library
                        lib_url = 'https://onlinelibrary.wiley.com/doi/%s'
                        urlpage = lib_url % _link

                        # scrape the webpage using chrome webdriver
                        # run chrome webdriver from executable path of your choice (Chrome, Firefox)
                        driver = webdriver.Chrome(
                            executable_path='/Users/rolandoruche/PycharmProjects/DSTM_Healthcare_domain/src/collector/healthcare/chromedriver')
                        # get web page
                        driver.get(urlpage)
                        # execute script to scroll down the page
                        driver.execute_script(
                            "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")

                        # Fetching Title
                        results_title = driver.find_elements_by_xpath("//*[@class='citation__title']")
                        for result in results_title:
                            title = result.text

                        # Fetching year
                        results_year = driver.find_elements_by_xpath("//*[@class='epub-date']")
                        for result in results_year:
                            date = result.text
                            year = date.split()[2]

                        # Fetching content
                        content = ""
                        results_content = driver.find_elements_by_xpath("//*[@class='article-section__content']")
                        for result in results_content:
                            allPtags = result.find_elements_by_tag_name('p')
                            content = content + ' ' + result.text
                            content = content.strip()

                        # keep valid record
                        if len(content) > 1000:
                            papers_original[link_id] = content
                            papers_info[link_id] = {'title': title, 'url': urlpage, 'year': year}
                            print(papers_info[link_id], len(content))
                        # close driver
                        driver.quit()
                        break

        except Exception:
            # changed error code so that we can tell the difference between the two oops codes
            print("Big OOps: " + url)
            continue

    print("%d papers are collected from JMED Virology Mechanism page" % len(papers_info))

    # Writing output to a JSON file
    with open(JMED_VIROL_INFO_PATH, 'w') as fp:
        json.dump(papers_info, fp)

    with open(JMED_VIROL_ORI_PATH, 'w') as fp:
        json.dump(papers_original, fp)
