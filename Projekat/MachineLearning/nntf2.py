import warnings
warnings.filterwarnings('ignore')
from re import X
import matplotlib
import numpy as np 
import pandas as pd 
import seaborn as sns
import tensorflow as tf
import matplotlib.pyplot as plot
import matplotlib
import baza

def preprocess_dataframe(data, categorical_feature_names, numeric_feature_names, predicted_feature_name):
    all_features_names = categorical_feature_names + numeric_feature_names + predicted_feature_name
    data = data[all_features_names]
    data = data.dropna() #todo - izabrati nacin upravljanja nedostajucim vrednostima
    target = data.pop(predicted_feature_name[0])
    return (data, target)


def create_dict_of_tensors(data, categorical_feature_names):
     inputs = {}
     for name, column in data.items():
          if type(column[0]) == str:
               dtype = tf.string
          elif (name in categorical_feature_names):
               dtype = tf.int64
          else:
               dtype = tf.float32
          
          inputs[name] = tf.keras.Input(shape=(), name=name, dtype=dtype)
     return inputs


def stack_dict(inputs, fun=tf.stack):
    values = []
    for key in sorted(inputs.keys()):
      values.append(tf.cast(inputs[key], tf.float32))
    return fun(values, axis=-1)

def create_normalizer(numeric_feature_names, data):
    numeric_features = data[numeric_feature_names]
    
    normalizer = tf.keras.layers.Normalization(axis=-1)
    normalizer.adapt(stack_dict(dict(numeric_features)))
    return normalizer

def normalize_numeric_input(numeric_feature_names, inputs, normalizer):
    numeric_inputs = {}
    for name in numeric_feature_names:
      numeric_inputs[name]=inputs[name]

    numeric_inputs = stack_dict(numeric_inputs)
    numeric_normalized = normalizer(numeric_inputs) 
    return numeric_normalized


def encode_categorical_features(categorical_feature_names, data, inputs, encoding):
    encoding_col = []
    for name in categorical_feature_names:
      value = sorted(set(data[name]))

      if type(value[0]) is str:
        lookup = tf.keras.layers.StringLookup(vocabulary=value, output_mode=encoding)
      else:
        lookup = tf.keras.layers.IntegerLookup(vocabulary=value, output_mode=encoding)

      x = inputs[name][:, tf.newaxis]
      x = lookup(x)
      encoding_col.append(x)
    return encoding_col

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


def get_model(data, label, encoding, number_of_layers, number_of_nodes, activation_functions, loss_fuc):
  categorical_feature_names, numeric_feature_names = determine_variable_types(data, label)
  (data, target) = preprocess_dataframe(data, categorical_feature_names, numeric_feature_names, label)
  inputs = create_dict_of_tensors(data, categorical_feature_names)
  #preprocessing categorical features
  normalizer = create_normalizer(numeric_feature_names, data)
  numeric_normalized = normalize_numeric_input(numeric_feature_names, inputs, normalizer)
  preprocessed = []
  preprocessed.append(numeric_normalized)
  #print(numeric_normalized)
  encoding_col = encode_categorical_features(categorical_feature_names, data, inputs, encoding)
  preprocessed = preprocessed + encoding_col

  preprocesssed_result = tf.concat(preprocessed, axis=-1)
  
  preprocessor = tf.keras.Model(inputs, preprocesssed_result)
  #building the model
  network = tf.keras.Sequential()
  
  for i in range(number_of_layers):
    network.add(tf.keras.layers.Dense(units=number_of_nodes[i], kernel_initializer='normal', activation=activation_functions[i]))
  network.add(tf.keras.layers.Dense(1))

  x = preprocessor(inputs)
  result = network(x)
  model = tf.keras.Model(inputs, result)

  model.compile(optimizer='adam',
                  loss=loss_fuc,
                  metrics=['accuracy'])
  #history = model.fit(dict(data), target, epochs=20, batch_size=8)
  return (model, target, data)

#dataset_name = "CarPricesData/CarPircesData.csv"

#dataset_name = "titanic/train.csv"
#data = pd.read_csv(dataset_name)
#predicted_feature_name = ['Survived']
#data.head()
# categorical_feature_names = ['Pclass','Sex']
# numeric_feature_names = ['Fare', 'Age']

default_classification_loss = tf.keras.losses.BinaryCrossentropy(from_logits=True)
default_regression_loss = 'mean_squared_error'
#model = get_model(data, predicted_feature_name, 'one_hot', 2, 10, "relu", classification_loss)

diamonds = pd.read_csv("diamonds/diamonds.csv")

# categorical_feature_names = ['cut','color']
# numeric_feature_names = ['x', 'y', 'z', 'carat']
predicted_feature_name = ['price']

model, target, data = get_model(diamonds, predicted_feature_name, 'one_hot', 2, [10, 10], ['relu', 'relu'], default_regression_loss)
history = model.fit(dict(data), target, epochs=20, batch_size=8)

#cuva model u bazu i ucitava ga opet
# id= baza.saveModel(model)
# model=baza.loadModelById(id)
# model.fit(dict(data), target, epochs=1, batch_size=8)