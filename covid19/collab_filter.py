import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sklearn.metrics as metrics
from sklearn.neighbors import NearestNeighbors
from scipy.spatial.distance import correlation, cosine
import ipywidgets as widgets
from IPython.display import display, clear_output
from sklearn.metrics import pairwise_distances
from sklearn.metrics import mean_squared_error
from math import sqrt
import sys, os
from contextlib import contextmanager

M = np.asarray([[2.2, 0, 2.6, 4.4, 3.4, 5, 2.2, 3.6],
                [0, 2.6, 0, 3.2, 0, 5, 2.8, 1.7],
                [4.5, 0, 2.5, 3.7, 0, 3.3, 5, 0],
                [2.8, 3.2, 4.2, 0, 0, 3.4, 3.7, 4.4],
                [3.1, 3.4, 0, 1.9, 4.3, 0, 4.7, 4.1],
                [3.0, 2.7, 0, 2.9, 0, 3.6, 2.5, 2.3]])

M=pd.DataFrame(M)

#declaring k,metric as global which can be changed by the user later
k=4
metric='cosine' #can be changed to 'correlation' for Pearson correlation similaries

print(M)

cosine_sim = 1-pairwise_distances(M, metric="cosine")

print(pd.DataFrame(cosine_sim))


# This function finds k similar users given the user_id and ratings matrix M
# Note that the similarities are same as obtained via using pairwise_distances
def findksimilarusers(user_id, ratings, metric=metric, k=k):
    similarities = []
    indices = []
    model_knn = NearestNeighbors(metric=metric, algorithm='brute')
    model_knn.fit(ratings)

    distances, indices = model_knn.kneighbors(ratings.iloc[user_id - 1, :].values.reshape(1, -1), n_neighbors=k + 1)
    similarities = 1 - distances.flatten()
    print('{0} most similar users for User {1}:\n'.format(k, user_id))
    for i in range(0, len(indices.flatten())):
        if indices.flatten()[i] + 1 == user_id:
            continue

        else:
            print('{0}: User {1}, with similarity of {2}'.format(i, indices.flatten()[i] + 1, similarities.flatten()[i]))

    return similarities, indices

similarities, indices = findksimilarusers(1,M, metric='cosine')

