from gensim.corpora.dictionary import Dictionary
from gensim.models.ldamodel import LdaModel
from gensim.test.utils import datapath
from text_utils import *
import json
import pandas as pd


def print_topics(num_words=10):
    lda = LdaModel.load('output/topic_model/lda.model')

    # print topics
    topics = lda.show_topics(num_words=num_words, formatted=False)

    topics_list = list()
    for t in topics:
        topics_list.append({'topic_id': int(t[0]), 'words_probs': dict(t[1])})

    return topics_list


def filter_doc_topic(topic_id, level, num_docs=20):
    df = pd.read_pickle("output/topic_model/docs.topics.pkl")

    docs = df[(df['topic-'+str(topic_id)] > 0) & (df['level'] == level)].sort_values(
        by='topic-'+str(topic_id), ascending=False)[:num_docs]

    return docs.to_json(orient='records')


if __name__ == "__main__":
    # api to show all topics
    topics = print_topics(num_words=5)

    print(topics)

    # api to filter docs based on topic id and level

    #print(filter_doc_topic(topic_id=0, level=1, num_docs=20))
