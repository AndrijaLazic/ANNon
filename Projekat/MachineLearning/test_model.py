import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

# Make NumPy printouts easier to read.
np.set_printoptions(precision=3, suppress=True)
import tensorflow as tf

from tensorflow import keras
from tensorflow.python.keras import layers

raw_dataset = pd.read_csv('diamonds/diamonds.csv')
column_names = ['carat', 'cut', 'color', 'clarity', 'depth', 'price',
                'x', 'y', 'z']

dataset = raw_dataset.copy()

def determine_variable_types(data, label):
    nunique = data.nunique()
    dtypes = data.dtypes
    # nunique.drop(label, inplace=True, axis=1)
    # dtypes.drop(label, inplace=True, axis=1)
    categorical = []
    numerical = []
    dnu = dict(nunique)
    dnu.pop(label[0], None)
    for key in dnu:
        if nunique[key] <= 20:
            categorical.append(key)
        elif (dtypes[key] != object):
            numerical.append(key)
    
    return (categorical, numerical)

categorical_features, numeric_features = determine_variable_types(dataset, ['price'])

def label_encode_categorical_features(data, categorical_feature_names):
  from sklearn.preprocessing import LabelEncoder
  label_encoder = LabelEncoder()
  for name in categorical_feature_names:
    data[name] = label_encoder.fit_transform(data[name])
  
  return data

dataset.isna().sum()
dataset = dataset.dropna()
dataset = label_encode_categorical_features(dataset, categorical_features)

#dataset.nunique()

dataset = pd.get_dummies(dataset, columns=['Origin'], prefix='', prefix_sep='')
dataset.tail()

train_dataset = dataset.sample(frac=0.8, random_state=0)
test_dataset = dataset.drop(train_dataset.index)

#sns.pairplot(train_dataset[['MPG', 'Cylinders', 'Displacement', 'Weight']], diag_kind='kde')


train_features = train_dataset.copy()
test_features = test_dataset.copy()

train_labels = train_features.pop('MPG')
test_labels = test_features.pop('MPG')

train_dataset.describe().transpose()[['mean', 'std']]

normalizer = tf.keras.layers.Normalization(axis=-1)

normalizer.adapt(np.array(train_features))

first = np.array(train_features[:1])

with np.printoptions(precision=2, suppress=True):
  print('First example:', first)
  print()
  print('Normalized:', normalizer(first).numpy())


def plot_loss(history):
  plt.plot(history.history['loss'], label='loss')
  plt.plot(history.history['val_loss'], label='val_loss')
  plt.ylim([0, 10])
  plt.xlabel('Epoch')
  plt.ylabel('Error [MPG]')
  plt.legend()
  plt.grid(True)

#test_results = {}


def build_and_compile_model(norm):
  model = keras.Sequential([
      norm,
      layers.Dense(64, activation='relu'),
      layers.Dense(64, activation='relu'),
      layers.Dense(1)
  ])

  model.compile(loss='mean_absolute_error',
                optimizer=tf.keras.optimizers.Adam(0.001))
  return model


dnn_model = build_and_compile_model(normalizer)
dnn_model.summary()


history = dnn_model.fit(
    train_features,
    train_labels,
    validation_split=0.2,
    verbose=0, epochs=100)

plot_loss(history)

plt.show()