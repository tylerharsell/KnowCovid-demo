import pandas as pd
import numpy as np
import nltk
import re
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
import random

st = list(stopwords.words('english'))

extra_words = ['covid', 'patients', 'coronavirus', 'study', 'using', 'may', 'scholar', 'google']
for i in extra_words:
    st.append(i)
st = set(st)

journals_path = [JMED_VIROL_ORI_PATH, NEJM_VIROL_ORI_PATH,
                     CID_VIROL_ORI_PATH, JAMA_VIROL_ORI_PATH, JID_VIROL_ORI_PATH]

journals_info_path = [
    (JMED_VIROL_INFO_PATH, 'Journal of Medical Virology'),
    (NEJM_VIROL_INFO_PATH, 'The New England Journal of Medicine'),
    (CID_VIROL_INFO_PATH, 'Clinical Infectious Diseases'),
    (JAMA_VIROL_INFO_PATH, 'Journal of the American Medical Association'),
    (JID_VIROL_INFO_PATH, 'The Journal of Infectious Diseases'),
]


# performs standard text pre-processing.
def text_processing(text):
    text = ''.join([i for i in text if not i.isdigit()])  # get rid of numbers that may come from graphs
    # tokenize inputted string by word
    tokenizer = nltk.RegexpTokenizer(r"\w+")  # remove punctuation
    text_tokenized = tokenizer.tokenize(text)  # tokenize text by word
    # lowercase
    for i in range(0, len(text_tokenized)):
        text_tokenized[i] = text_tokenized[i].lower()
    tokens_without_sw = [word for word in text_tokenized if not word in st]  # get rid of stop words
    tokens_without_sw = [word for word in tokens_without_sw if (len(word) > 4)]
    return tokens_without_sw


# aids in text processing by only considering n most frequent words ranging from most frequent to most rare
# (defined by frequency_parameter) in order to make results specific
def frequency_filters(texts_list, n, frequency_parameter=None):
    filtered_texts = [text_processing(item) for item in texts_list]
    if frequency_parameter:
        return filtered_texts
    allcontent = ""
    for i in texts_list:
        allcontent = allcontent + i

    all_words = text_processing(allcontent)
    length = len(set(all_words))
    topwords = []  # list that'll contain top N words according to frequency parameters
    # first part of if statement generates most common words and filters out each document
    if frequency_parameter == 'top':
        frequencies = nltk.FreqDist(all_words)

        frequencies = frequencies.most_common(len(all_words))[:n]
        for i in range(n):
            topwords.append(frequencies[i][0])
        j = 0
        for i in filtered_texts:
            i = [word for word in i if word in topwords]
            filtered_texts[j] = i
            j =+ 1
        return filtered_texts

    # second part of if statement generates least common words and filters out each document
    elif frequency_parameter == "bottom":
        frequencies = nltk.FreqDist(all_words)
        frequencies = frequencies.most_common(len(all_words))[-n:]

        for i in range(n):
            topwords.append(frequencies[i][0])
        j = 0
        for i in filtered_texts:
            i = [word for word in i if word in topwords]
            filtered_texts[j] = i
            j = j + 1

        filtered_texts_final = []

        for i in filtered_texts:
            if len(i) != 0:
                filtered_texts_final.append(i)
        return filtered_texts_final
    else:
        middle = length / 2
        half = n / 2
        upper = middle + half
        lower = middle - half
        frequencies = nltk.FreqDist(all_words)
        frequencies = frequencies.most_common()
        frequencies = frequencies[lower:upper]

        for i in range(n):
            topwords.append(frequencies[i][0])
        j = 0
        for i in filtered_texts:
            i = [word for word in i if word in topwords]
            filtered_texts[j] = i
            j = j + 1

        filtered_texts_final = []

        for i in filtered_texts:
            if len(i) != 0:
                filtered_texts_final.append(i)
        return filtered_texts_final


# this section of the code assigns clinical topics to the generated LDA topics
def category_allocation(topics_dict):
    indexes = ['Topic0', 'Topic1', 'Topic2', 'Topic3', 'Topic4', 'Topic5']
    columns = ['Therapy', 'Etiology', 'Diagnosis', 'Prognosis', 'Prevention', 'Meaning']

    df = pd.DataFrame(index=indexes, columns=columns)

    words = list(topics_dict.values())
    topics_dict_final = {}

    therapy_counts_list = []
    therapy_count = 0

    for w in words:
        for item in w:
            therapy_bool = item in therapy_words
            if therapy_bool is True:
                therapy_count += 1
        therapy_counts_list.append(therapy_count)
        therapy_count = 0

    df['Therapy'] = therapy_counts_list

    etiology_counts_list = []
    etiology_count = 0

    for w in words:
        for item in w:
            etiology_bool = item in etiology_words
            if etiology_bool is True:
                etiology_count += 1
        etiology_counts_list.append(etiology_count)
        etiology_count = 0
    df['Etiology'] = etiology_counts_list

    diagnosis_counts_list = []
    diagnosis_count = 0

    for w in words:
        for item in w:
            diagnosis_bool = item in diagnosis_words
            if diagnosis_bool is True:
                diagnosis_count += 1
        diagnosis_counts_list.append(diagnosis_count)
        diagnosis_count = 0

    df['Diagnosis'] = diagnosis_counts_list

    prognosis_counts_list = []
    prognosis_count = 0

    for w in words:
        for item in w:
            prognosis_bool = item in prognosis_words
            if prognosis_bool is True:
                prognosis_count += 1
        prognosis_counts_list.append(prognosis_count)
        prognosis_count = 0

    df['Prognosis'] = prognosis_counts_list

    prevention_counts_list = []
    prevention_count = 0

    for w in words:
        for item in w:
            prevention_bool = item in prevention_words
            if prevention_bool is True:
                prevention_count += 1
        prevention_counts_list.append(prevention_count)
        prevention_count = 0

    df['Prevention'] = prevention_counts_list

    meaning_counts_list = []
    meaning_count = 0

    for w in words:
        for item in w:
            meaning_bool = item in meaning_words
            if meaning_bool is True:
                meaning_count += 1
        meaning_counts_list.append(prevention_count)
        meaning_count = 0

    df['Meaning'] = meaning_counts_list

    for column in columns:
        temp_series = df[column]
        max_index = temp_series.idxmax()
        topics_dict_final[column] = topics_dict[max_index]
        df.drop(max_index, inplace=True)

    return topics_dict_final


def get_topic_categories(doc_number, lda_model, bow_corpus, topics_dict_final, labels_dict, labels_val, word_count):
    distribution = {}

    for index, score in sorted(lda_model[bow_corpus[doc_number]], key=lambda tup: -1 * tup[1]):
        distribution[score] = lda_model.print_topic(index, word_count)

    scores = distribution.keys()
    scores = list(scores)
    top_doc_percentage = scores[0]
    doc_words = distribution[top_doc_percentage]

    # format the words string and subsequently classify

    output = re.sub('[0-9]+', '', doc_words)
    output = output.replace("+", "")
    output = output.replace(".", "")
    output = output.replace("*", "")
    output = output.replace(" "" ", "")

    tokenizer = nltk.RegexpTokenizer(r"\w+")  # remove punctuation
    associated_words = tokenizer.tokenize(output)

    topics = ['Therapy', 'Etiology', 'Prognosis', 'Diagnosis', 'Prevention', 'Meaning']

    return_val = ""
    for i in topics:
        topics_keys = list(topics_dict_final[i].keys())
        b = topics_keys == associated_words
        if b is True:
            return_val = i
            break

    if return_val not in labels_dict.keys():
        labels_dict[return_val] = labels_val
        labels_val += 1

    final_return_list = list()
    final_return_list.append(return_val)
    final_return_list.append(top_doc_percentage)
    return final_return_list, labels_val


# perform LDA on individual portions of the clinical categories:
def get_group_texts(df, category):
    gb = df.groupby('CategoryLabels')
    category_df = gb.get_group(category)
    texts = category_df['Texts']
    return texts


# Takes filtered texts and creates bag of words model, dictionary for processed text
def bow_processed_text(cleaned_texts, words, frequency="top"):
    filtered_texts = frequency_filters(cleaned_texts, words, frequency_parameter=frequency)

    dictionary = gensim.corpora.Dictionary(filtered_texts)
    bow_corpus = [dictionary.doc2bow(doc) for doc in filtered_texts]  # bag of words (consist of word and frequency)
    return bow_corpus, dictionary


# Performs LDA by taking in an inputted text, converting it to a bag of words,
# and then using Gensim LDA method to perform LDA
def perform_lda(bow_corpus, dictionary, num_topics=6):
    # implement LDA
    lda_model = gensim.models.LdaModel(bow_corpus, num_topics=num_topics, id2word=dictionary, iterations=50,
                                           alpha='auto', eta='auto')
    lda_model.save('output/category_model/category.model')

    return lda_model


# Get the documents topic distribution
def get_topic_distribution(lda, j_info, dictionary, docs, num_topics=6):
    # Get the documents topic distribution
    docs_topics = dict()
    ids_list = list()
    levels_list = list()
    title_list = list()
    year_list = list()
    month_list = list()
    url_list = list()
    journal_list = list()
    category_list = list()
    topics_list = [list() for _ in range(num_topics)]

    for k in docs:
        bow = dictionary.doc2bow(docs[k])
        t = dict(lda.get_document_topics(bow))
        ids_list.append(k)
        levels_list.append(j_info[k]['level'])
        title_list.append(j_info[k]['title'])
        year_list.append(j_info[k]['year'])
        month_list.append(j_info[k]['month'])
        url_list.append(j_info[k]['url'])
        journal_list.append(j_info[k]['journal'])
        category_list.append(j_info[k]['category'])

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
            'journal': journal_list,
            'category': category_list
            }

    df = pd.DataFrame(data, columns=['id', 'level', 'title', 'year', 'month', 'url', 'journal', 'category'])

    # add topic columns
    for i in range(num_topics):
        df['topic-' + str(i)] = topics_list[i]


    # save docs topics files
    df.to_pickle("output/category_model/docs.category.topics.pkl")


def get_topics_dict(topics, topics_dict):
    for i in topics:
        words = i[1]
        key_words = []
        for w in words:
            key_words.append(w)

        topic = i[0]
        key = str("Topic" + str(topic))

        topics_dict[key] = dict(i[1])

    topics_dict_final = category_allocation(topics_dict)

    return topics_dict_final


def print_topics(topics_dict_final):
    topics_list = list()
    topic_values = topics_dict_final.values()
    topic_values = list(topic_values)

    for i in range(len(topics_dict_final)):
        topics_list.append({'topic_id': i, 'words_probs': topic_values[i]})

    return topics_list


# prints results of an LDA
def get_lda_results(lda_model, bow_corpus, df, topics_dict_final):
    final_data = pd.DataFrame()
    category_labels = []
    percentages = []
    labels_dict = {}
    labels_val = 1

    for i in range(0, len(bow_corpus)):
        x, labels_val = get_topic_categories(i, lda_model, bow_corpus, topics_dict_final, labels_dict, labels_val, 10)

        label = x[0]
        p = x[1]
        category_labels.append(label)
        percentages.append(p)

    final_data['ID'] = df['ID']
    final_data['Texts'] = df['Document']
    final_data['CategoryLabels'] = category_labels
    final_data['Percentages'] = percentages

    return final_data, labels_dict


def get_terms(texts) -> list:
    texts = [doc.split(' ') for doc in texts]
    terms = set()
    for item in texts:
        for word in item:
            terms.add(word)
    terms = list(terms)
    return terms


# Using Vector similarity for information document retrieval
def get_doc_vec(texts, query):
    df = pd.DataFrame(data=texts, columns=["document"])
    df2 = pd.DataFrame(data=query, columns=["query"])
    terms = get_terms(texts)
    vectorizer = CountVectorizer(vocabulary=terms)
    X = vectorizer.fit_transform(df["document"].values)
    Y = vectorizer.fit_transform(df2["query"].values)
    doc = pd.DataFrame(data=X.toarray(), columns=vectorizer.get_feature_names())
    query = pd.DataFrame(data=Y.toarray(), columns=vectorizer.get_feature_names())
    return doc, query


def get_cos_sim(query, doc, threshold=0.2):
    df = pd.DataFrame(data=texts, columns=["document"])
    sub_texts = []
    cos_list = dict()
    for ind in range(len(doc.values)):
        cos_sim = np.dot(query.values, doc.values[ind])/(norm(query.values), norm(doc.values[ind]))
        if cos_sim[1] >= threshold:
            temp = "docID_"+str(ind)
            cos_list[temp] = cos_sim[1]
            sub_texts.append(df.values[ind][0])

    return cos_list, sub_texts


def get_processed_query(query):
    text = remove_url(query)
    text = remove_underline(text)
    text = remove_non_ascii(text)
    text = remove_punctuation(text)
    text = remove_digits(text)
    text = remove_extra_space(text)
    return [to_lowercase(text)]


def get_query_precentage(texts, q_words):
    terms = get_terms(texts)
    c = 0
    query_percentage = []
    for i in q_words:
        for j in texts:
            if i in j:
                c = c + 1
        percent = (c / len(terms)) * 100
        query_percentage.append(percent)
        c = 0
    percent_df = pd.DataFrame()
    percent_df['words'] = q_words
    percent_df['percentage'] = query_percentage
    print(percent_df)


# Collects and processes documents by NLP techniques
def process_documents(journals: dict, journals_info: dict):
    for journal in journals_path:
        with open(journal, 'r') as fp:
            journals.update(json.load(fp))

    for journal_info in journals_info_path:
        with open(journal_info[0], 'r') as fp:
            jinfo = json.load(fp)

            for k in jinfo:
                jinfo[k]['journal'] = journal_info[1]
            journals_info.update(jinfo)

    docs = {}
    texts = dict()
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

        texts[k] = tokens
        docs[k] = tokens

    return texts, docs


# Cleans documents and converts to panda DataFrame
def cnvrt_2_df(texts):
    df = pd.DataFrame()
    df['ID'] = [item for item in texts.keys()]
    df['Document'] = [' '.join(texts[item]) for item in texts.keys()]

    readings = list(df['Document'])

    c_readings = [x for x in readings if str(x) != 'nan']
    #c_readings = [x.split() for x in c_readings]
    df['Document'] = c_readings

    return df


def get_journals_info(j_info, fd, labels_dict):
    data = {}
    # labels_dict = {'Therapy': 1, 'Etiology': 2, 'Prognosis': 3, 'Diagnosis': 4, 'Prevention': 5, 'Meaning': 6}
    ids = [item for item in fd['ID']]
    labels = [item for item in fd['CategoryLabels']]
    labels = [labels_dict[item] for item in labels]
    for i in range(len(fd)):
        data[ids[i]] = labels[i]

    # Store category labels
    for info in journals_info_path:
        with open(info[0], 'r') as fp:
            jinfo = json.load(fp)
            for k in jinfo:
                if k in data.keys():
                    j_info[k]['category'] = data[k]

            j_info.update(j_info)

    return j_info


def get_tdf() -> dict:
    # Process text
    journals = {}
    journals_info = {}
    texts, docs = process_documents(journals, journals_info)

    df_cr = cnvrt_2_df(texts)

    bow_corpus, dictionary = bow_processed_text(df_cr['Document'], words=len(df_cr) / 2, frequency="top")

    lda_model = perform_lda(bow_corpus, dictionary)

    lda = lda_model.load(CATEGORY_MODEL_PATH)
    topics = lda.show_topics(formatted=False, num_words=10)

    topics_dict = {}
    tdf = get_topics_dict(topics, topics_dict)

    return tdf


def filter_doc_topic(df, topic_id, level, num_docs):
    #df = pd.read_pickle(DOCS_TOPICS_PATH)
    docs = df[(df['topic-'+str(topic_id)] > 0) & (df['level'] == level)].sort_values(
        by='topic-'+str(topic_id), ascending=False)[:num_docs]

    return docs.to_json(orient='records')


if __name__ == "__main__":
    torch.multiprocessing.freeze_support()

    # Process text
    journals = {}
    journals_info = {}
    texts, docs = process_documents(journals, journals_info)

    df_cr = cnvrt_2_df(texts)

    bow_corpus, dictionary = bow_processed_text(df_cr['Document'], words=len(df_cr) / 2, frequency="top")

    lda_model = perform_lda(bow_corpus, dictionary)

    lda = lda_model.load(CATEGORY_MODEL_PATH)
    topics = lda.show_topics(formatted=False, num_words=10)

    topics_dict = {}
    tdf = get_topics_dict(topics, topics_dict)

    # topics_list = print_topics(tdf)
    # print(topics_list)

    final_data, labels_dict = get_lda_results(lda_model, bow_corpus, df_cr, tdf)

    get_journals_info(journals_info, final_data, labels_dict)

    get_topic_distribution(lda, journals_info, dictionary, docs, num_topics=6)

    #print(filter_doc_topic(df, 2, 1, 20))
