import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

if __name__ == '__main__':
	print('Reading data...')
	df = pd.read_csv('metadata.csv')
	print('Training...')
	vectorizer = TfidfVectorizer()
	corpus = []
	document = []
	df = df.dropna()
	content_abstract = list(df['abstract'])
	print(len(df))
	i = 0
	for ab in content_abstract:
		if ab != None:
			ab = str(ab).replace('OBJECTIVE: ', '')
			corpus.append(ab)
			i += 1
		else:
			print(ab)
	content_title = list(df['title'])
	for tt in content_title:
		if tt != None:
			tt = str(tt)
			corpus.append(tt)
	for tt,ab in zip(content_title, content_abstract):
		all_con = str(tt) + str(ab).replace('OBJECTIVE: ', '')
		document.append(all_con)
	X = vectorizer.fit(corpus)
	document_vec = vectorizer.transform(document)
	with open('vectorizer.pkl', 'wb') as fin:
		pickle.dump(vectorizer, fin)
	with open('documnet_vecs.pkl', 'wb') as fin:
		pickle.dump(document_vec, fin)
	query = "What is the status of Nucleic Acid Amplification test with PCR used for COVID-19 or SARSCoV-2?"
	query_vec = vectorizer.transform([query])
	results = cosine_similarity(document_vec, query_vec)
	print(len(results))
	# for i in results.argsort()[-10:][::-1]:
	# 	print(df.iloc[i, 0], "--", df.iloc[i, 1])