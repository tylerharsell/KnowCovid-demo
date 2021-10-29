from flask import Flask, request, url_for, send_file, Response, jsonify
import py_eureka_client.eureka_client as eureka_client
from flask_restful import Resource, Api
from flask_cors import CORS
import pandas as pd
import requests
import numpy as np
import time
import math
import json
from collections import OrderedDict
from gensim.models.ldamodel import LdaModel
import pickle
from sklearn.metrics.pairwise import cosine_similarity

# Global values
LDA_MODEL_PATH = 'lda.model'
DOCS_TOPICS_PATH = 'docs.topics.pkl'
VEC_MODEL = 'vectorizer.pkl'
DOCUMENT_VEC = 'documnet_vecs.pkl'

app = Flask(__name__)
api = Api(app)
CORS(app)

@app.route('/init', methods=['GET'])
def start():
	print('Hello!')
	return 'Hello!'

@app.route('/get_topics', methods=['GET'])
def print_topics(num_words=10):
	lda = LdaModel.load(LDA_MODEL_PATH)

	# print topics
	topics=lda.show_topics(num_words=num_words, formatted=False)
	print(type(topics))

	topics_list = list()
	for t in topics:
		topics_list.append({'topic_id': int(t[0]), 'words_probs': dict(t[1])})
	print(type(topics_list))
	return str(topics_list)

@app.route('/filter_documents', methods=['POST'])
def filter_doc_topic():
	topic_id = request.form.get('topic_id', type=int,default='')
	level = request.form.get('level', type=int,default='')
	df = pd.read_pickle(DOCS_TOPICS_PATH)
	print(len(df))
	for columns in df.columns:
		df[columns].replace("\"", "", inplace=True)
		df[columns].replace("\'", "", inplace=True)
	print(topic_id, level)

	docs = df[(df['topic-' + str(topic_id)] > 0) & (df['level'] == level)].sort_values(
		by='topic-' + str(topic_id), ascending=False)
	print(len(docs))
	print(type(docs))

	return docs.to_json(orient='records')

@app.route('/query', methods=['POST'])
def query_similarity():
	query = request.form.get('query', type=str,default='')
	vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
	doc_vec = pickle.load(open('documnet_vecs.pkl', 'rb'))
	query_vec = vectorizer.transform([query])
	results = cosine_similarity(doc_vec, query_vec)
	print(len(results))
	res_dict = {}
	i = 0
	for re in results:
		res_dict[i] = re
		i += 1
	print(len(res_dict))
	res_dict = {k: v for k, v in sorted(res_dict.items(), key=lambda item: item[1], reverse=True) }

	return str([i for i in res_dict.keys()][:50])

@app.route('/get_gene_dict', methods=['GET'])
def get_gene_dict():
	r = open('gene_dict.json', 'r')
	data = json.loads(r.read())
	print(data)

	return data

@app.route('/get_gene_len_dict', methods=['GET'])
def get_gene_len_dict():
	r = open('gene_len_dict.json', 'r')
	data = json.loads(r.read())
	data_new = {}
	i = 1
	for key in data:
		if i <= 10:
			data_new[key] = data[key]
			i += 1

	return data_new

@app.route('/get_drug_dict', methods=['GET'])
def get_drug_dict():
	r = open('drug_dict.json', 'r')
	data = json.loads(r.read())

	return data

@app.route('/get_drug_len_dict', methods=['GET'])
def get_drug_len_dict():
	r = open('drug_len_dict.json', 'r')
	data = json.loads(r.read())
	data_new = {}
	i = 1
	for key in data:
		if i <= 10:
			data_new[key] = data[key]
			i += 1

	return data_new

if __name__ == "__main__":
	app.run(host="0.0.0.0", debug=True)