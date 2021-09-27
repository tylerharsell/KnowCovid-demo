from gensim.corpora.dictionary import Dictionary
from gensim.models.ldamodel import LdaModel
from gensim.test.utils import datapath
import json
import pandas as pd
import sys


def filter_doc_topic(topic_id, level):
    DOCS_TOPICS_PATH = 'docs.topics.pkl'
    df = pd.read_pickle(DOCS_TOPICS_PATH)
    print(DOCS_TOPICS_PATH)

    docs = df[(df['topic-'+str(topic_id)] > 0) & (df['level'] == level)].sort_values(
        by='topic-'+str(topic_id), ascending=False)
    print(len(docs))
    return docs.to_json(orient='records')


if __name__ == "__main__":
    topic_id = int(sys.argv[1])
    level = int(sys.argv[2])
    filter_doc_topic(topic_id, level)
    #print(topic_id)
    #print(level)
    # print(filter_doc_topic(topic_id, level, 20))