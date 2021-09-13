from gensim.corpora.dictionary import Dictionary
from gensim.models.ldamodel import LdaModel
from gensim.test.utils import datapath
from text_utils import *
import json
import pandas as pd
import sys


def filter_doc_topic(topic_id, level, num_docs):
    df = pd.read_pickle(DOCS_CATEGORY_TOPICS_PATH)

    docs = df[(df['topic-'+str(topic_id)] > 0) & (df['level'] == level)].sort_values(
        by='topic-'+str(topic_id), ascending=False)[:num_docs]

    return docs.to_json(orient='records')


if __name__ == "__main__":
    topic_id = int(sys.argv[1])
    level = int(sys.argv[2])

    #print(topic_id)
    #print(level)
    print(filter_doc_topic(topic_id, level, 20))
