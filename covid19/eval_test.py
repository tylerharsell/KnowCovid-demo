import pandas as pd
import numpy as np
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from nltk.corpus import stopwords
import torch
#nltk.download('popular')
#nltk.download('stopwords')
from nltk.stem import PorterStemmer
import gensim
from gensim import corpora, models
from category_terms import *
from constants import *
from text_utils import *
import json
from numpy.linalg import norm

st = set(stopwords.words('english'))


def main():
    query1_words = ['acid', 'pcr', 'test', 'amplification', 'sarscov']
    query2_words = ['igm', 'serology', 'tests', 'igg', 'used']
    query3_words = ['antibodies', 'immuno', 'monoclonal', 'assays', 'current']

    """
    query1 = "What is the status of Nucleic Acid Amplification test with PCR used for COVID-19 or SARSCoV-2?"
    query2 = "What is the status of serology tests with IgM or IgG used for COVID-19?"
    query3 = "What is the current status of Immuno-assays with hyper-immune polyclonal antibodies or monoclonal " \
             "antibodies used for COVID-19?"

    doc, q1 = get_doc_vec(texts, get_processed_query(query1))
    cos_list, sub_texts = get_cos_sim(q1, doc, threshold=0.5)
    print("Number of articles relevant to query 1:", len(cos_list))

    get_query_precentage(sub_texts, query1_words)

    doc, q2 = get_doc_vec(texts, get_processed_query(query2))
    cos_list, sub_texts = get_cos_sim(q2, doc, threshold=0.5)
    print("Number of articles relevant to query 2:", len(cos_list))

    get_query_precentage(sub_texts, query2_words)

    doc, q3 = get_doc_vec(texts, get_processed_query(query3))
    cos_list, sub_texts = get_cos_sim(q3, doc, threshold=0.5)
    print("Number of articles relevant to query 3:", len(cos_list))

    get_query_precentage(sub_texts, query3_words)
    """


if __name__=='__main__':
    main()