import pickle
import pandas as pd

f = open('docs.topics.pkl','rb')
data = pickle.load(f)
df = pd.read_pickle('docs.topics.pkl')
get_data = df.iloc[:, :7]
print(get_data.columns.values.tolist())
get_data.to_csv('docs.csv')