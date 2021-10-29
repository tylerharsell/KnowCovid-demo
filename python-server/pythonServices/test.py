import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

if __name__ == '__main__':
	# vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
	# doc_vec = pickle.load(open('documnet_vecs.pkl', 'rb'))
	# query = "What is the status of Nucleic Acid Amplification test with PCR used for COVID-19 or SARSCoV-2?"
	# query_vec = vectorizer.transform([query])
	# results = cosine_similarity(doc_vec, query_vec)
	# print(len(results))


	docs = pickle.load(open('docs.topics.pkl', 'rb'))
	for columns in docs.columns:
		docs[columns].replace("\"", "", inplace=True)

	docs.to_pickle('docs.topics.pkl')
	print(docs.columns)
	print(docs)
	print('Done!!!')