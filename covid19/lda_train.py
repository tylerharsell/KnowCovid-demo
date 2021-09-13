from gensim.corpora.dictionary import Dictionary
from gensim.models.ldamodel import LdaModel
from gensim.test.utils import datapath
from text_utils import *
import json
import pandas as pd

if __name__ == "__main__":
    journals_path = [JMED_VIROL_ORI_PATH, NEJM_VIROL_ORI_PATH,
                     CID_VIROL_ORI_PATH, JAMA_VIROL_ORI_PATH, JID_VIROL_ORI_PATH]

    journals_info_path = [
        (JMED_VIROL_INFO_PATH, 'Journal of Medical Virology'),
        (NEJM_VIROL_INFO_PATH, 'The New England Journal of Medicine'),
        (CID_VIROL_INFO_PATH,  'Clinical Infectious Diseases'),
        (JAMA_VIROL_INFO_PATH, 'JAMA'),
        (JID_VIROL_INFO_PATH,  'The Journal of Infectious Diseases'),
    ]

    journals = {}
    for journal in journals_path:
        with open(journal, 'r') as fp:
            journals.update(json.load(fp))

    journals_info = {}
    for journal_info in journals_info_path:
        with open(journal_info[0], 'r') as fp:
            jinfo = json.load(fp)

            for k in jinfo:
                jinfo[k]['journal'] = journal_info[1]

            journals_info.update(jinfo)

    texts = []
    docs = {}
    for k in journals.keys():
        text = journals[k]
        text = remove_url(text)
        text = remove_underline(text)
        text = remove_non_ascii(text)
        text = remove_punctuation(text)
        text = remove_digits(text)
        text = remove_extra_space(text)
        text = to_lowercase(text)

        tokens = text.split()
        tokens = remove_stopwords(tokens)

        if len(tokens) < DOCS_MIN_LEN:
            continue

        texts.append(tokens)
        docs[k] = tokens

    # Generate dictionary and corpus
    dictionary = Dictionary(texts)
    corpus = [dictionary.doc2bow(text) for text in texts]

    # Define the LDA model
    num_topics = 10
    lda = LdaModel(corpus=corpus, id2word=dictionary, num_topics=num_topics, iterations=50, alpha='auto', eta='auto')

    # Save the model to disk.
    lda.save("output/topic_model/lda.model")

    # Get the documents topic distribution
    docs_topics = dict()
    ids_list = list()
    levels_list = list()
    title_list = list()
    year_list = list()
    month_list = list()
    url_list = list()
    journal_list = list()
    topics_list = [list() for _ in range(num_topics)]

    for k in docs:
        bow = dictionary.doc2bow(docs[k])
        t = dict(lda.get_document_topics(bow))
        ids_list.append(k)
        levels_list.append(journals_info[k]['level'])
        title_list.append(journals_info[k]['title'])
        year_list.append(journals_info[k]['year'])
        month_list.append(journals_info[k]['month'])
        url_list.append(journals_info[k]['url'])
        journal_list.append(journals_info[k]['journal'])

        # get topic
        for i in range(num_topics):
            if i in t:
                topics_list[i].append(t[i])
            else:
                topics_list[i].append(0)

    data = {'id': ids_list,
            'level': levels_list,
            'title': title_list,
            'year': year_list,
            'month': month_list,
            'url': url_list,
            'journal': journal_list
            }

    df = pd.DataFrame(data, columns=['id', 'level', 'title', 'year', 'month', 'url', 'journal'])

    # add topic columns
    for i in range(num_topics):
        df['topic-' + str(i)] = topics_list[i]

    # save docs topics files
    df.to_pickle("output/topic_model/docs.topics.pkl")



