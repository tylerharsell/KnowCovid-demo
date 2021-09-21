from gensim.corpora.dictionary import Dictionary
from gensim.models.ldamodel import LdaModel
from gensim.test.utils import datapath
from text_utils import *
import json
import pandas as pd


def print_topics(num_words=10):
    LDA_MODEL_PATH = '/Users/chengxiyao/Lab_researches/git_code/covid19/output/topic_model/lda.model'
    lda = LdaModel.load(LDA_MODEL_PATH)

    # print topics
    print
    topics = lda.show_topics(num_words=num_words, formatted=False)

    topics_list = list()
    for t in topics:
        topics_list.append({'topic_id': int(t[0]), 'words_probs': dict(t[1])})

    return topics_list
	

if __name__ == "__main__":
    # api to show all topics
    print('python done!')
    print(print_topics(num_words=10))
