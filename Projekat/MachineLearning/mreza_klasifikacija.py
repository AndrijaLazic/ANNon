import tensorflow as tf
from tensorflow.python import keras
from keras import layers
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

data = pd.read_csv("petfinder-mini.csv", sep=',')
data.tail()

print("Shape before removing duplicates", data.shape)
data.drop_duplicates()
print("Shape after removing duplicates", data.shape)

data.nunique()
data.describe(include='all')
data.isna().sum()

target = data.pop("AdoptionSpeed")
#target = target.to_numpy()

del data["Description"]

def split_data(data,train_percentage=0.8,test_percentage=0.1,val_percentage=0.1):
  #podela 80/10/10
  train,val,test=np.split(data.sample(frac=1),[int(train_percentage*len(data)),int((val_percentage+train_percentage)*len(data))])
  return train,val,test

def determine_variable_types(data):
    nunique = data.nunique()
    dtypes = data.dtypes
    categorical = []
    numerical = []
    for key in dict(nunique):
        if nunique[key] <= 20:
            categorical.append(key)
        elif (dtypes[key] != object):
            numerical.append(key)
    
    return (categorical, numerical)


categorical_feature_names, numerical_feature_names = determine_variable_types(data)
data = data[categorical_feature_names+numerical_feature_names]
data.tail()
target.tail()

@tf.autograph.experimental.do_not_convert
def get_category_encoding_layer(name, dataset, dtype, max_tokens=None):
  # Create a layer that turns strings into integer indices.
  if dtype == 'string':
    index = tf.keras.layers.StringLookup(max_tokens=max_tokens)
  # Otherwise, create a layer that turns integer values into integer indices.
  else:
    index = tf.keras.layers.IntegerLookup(max_tokens=max_tokens)

  # Prepare a `tf.data.Dataset` that only yields the feature.
  feature_ds = dataset.map(lambda x, y: x[name])

  # Learn the set of possible values and assign them a fixed integer index.
  index.adapt(feature_ds)

  # Encode the integer indices.
  encoder = tf.keras.layers.CategoryEncoding(num_tokens=index.vocabulary_size())

  # Apply multi-hot encoding to the indices. The lambda function captures the
  # layer, so you can use them, or include them in the Keras Functional model later.
  return lambda feature: encoder(index(feature))


def get_normalization_layer(name, dataset):
  # Create a Normalization layer for the feature.
  normalizer = tf.keras.layers.Normalization(axis=None)

  # Prepare a Dataset that only yields the feature.
  feature_ds = dataset.map(lambda x, y: x[name])

  # Learn the statistics of the data.
  normalizer.adapt(feature_ds)

  return normalizer

def df_to_dataset(dataframe, target, shuffle=True, batch_size=256):
  df = dataframe.copy()
  value = sorted(set(target))
  lookup = tf.keras.layers.IntegerLookup(vocabulary=value, output_mode="one_hot")
  target = target[:, tf.newaxis]
  labels = lookup(target)
  df = {key: value[:,tf.newaxis] for key, value in df.items()}
  ds = tf.data.Dataset.from_tensor_slices((dict(df), labels))
  if shuffle:
    ds = ds.shuffle(buffer_size=len(dataframe))
  ds = ds.batch(batch_size)
  ds = ds.prefetch(batch_size)
  return ds

#ds = df_to_dataset(data, target, batch_size=64)

df = data.copy()
value = sorted(set(target))
lookup = tf.keras.layers.IntegerLookup(vocabulary=value, output_mode="one_hot")
target2 = target[:, tf.newaxis]

labels = lookup(target2)
df = {key: value[:,tf.newaxis] for key, value in df.items()}
ds = tf.data.Dataset.from_tensor_slices((dict(df), labels))
ds = ds.shuffle(buffer_size=len(data))
ds = ds.batch(32)
ds = ds.prefetch(32)

#age_ds = ds.map(lambda x, y: x['Age'])

all_inputs = []
encoded_features = []

numerical_feature_names.remove("Age")

# Numerical features.
for header in numerical_feature_names:
    numeric_col = tf.keras.Input(shape=(1,), name=header)
    normalization_layer = get_normalization_layer(header, ds)
    encoded_numeric_col = normalization_layer(numeric_col)
    all_inputs.append(numeric_col)
    encoded_features.append(encoded_numeric_col)

age_col = tf.keras.Input(shape=(1,), name = "Age", dtype = "int64")
encoding_layer = get_category_encoding_layer(name="Age", dataset=ds, dtype="int64", max_tokens=5)

encoded_age_col = encoding_layer(age_col)
all_inputs.append(age_col)
encoded_features.append(encoded_age_col)

for header in categorical_feature_names:
    categorical_col = tf.keras.Input(shape=(1,), name=header, dtype="string")
    encoding_layer = get_category_encoding_layer(name=header,
                                                dataset=ds,
                                                dtype="string",
                                                max_tokens=5)
    encoded_categorical_col = encoding_layer(categorical_col)
    all_inputs.append(categorical_col)
    encoded_features.append(encoded_categorical_col)



all_features = tf.keras.layers.concatenate(encoded_features)

x = layers.Dense(32, "relu")(all_features)
x = layers.Dense(10, "relu")(x)
output = layers.Dense(6, activation="softmax")(x)

model = tf.keras.Model(all_inputs, output)

model.compile(optimizer='Adam',
            loss="categorical_crossentropy", #tf.keras.losses.CategoricalCrossentropy(),
            metrics="Accuracy")


model.summary()


history = model.fit(ds, epochs=20)