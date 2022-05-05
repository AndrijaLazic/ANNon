import json
from typing import List
import numpy as np
import tensorflow as tf
import pandas as pd
from CustomCallback import CustomCallback
from keras.models import load_model
from keras.callbacks import LearningRateScheduler
import model_handling

class Hiperparametri:
  def __init__(self,tip_problema,test_skup,slojevi, mera_greske,mera_uspeha,broj_epoha,ulazne_kolone,izlazna_kolona):
    self.tip_problema=tip_problema
    self.test_skup=test_skup
    #self.kolone=kolone
    self.slojevi=slojevi
    self.mera_greske = mera_greske
    self.mera_uspeha=mera_uspeha
    self.broj_epoha=broj_epoha
    self.ulazne_kolone=ulazne_kolone
    self.izlazna_kolona=izlazna_kolona

class Sloj:
  def __init__(self,broj_cvorova,aktivaciona_funkcija):
    self.broj_cvorova=broj_cvorova
    self.aktivaciona_funkcija=aktivaciona_funkcija

class Kolona:
  def __init__(self,naziv, tip_podataka, enkodiranje):
    self.naziv=naziv
    self.tip_podataka = tip_podataka
    self.enkodiranje = enkodiranje
    #self.nedostajuce_vrednosti = nedostajuce_vrednosti

class Pretprocesiranje:
  def __init__(self, kolone):
      self.kolone = kolone

f = open('KonfiguracioniFajl.json')
Konfiguracija = json.load(f)

def determine_variable_types(data, label):
    nunique = data.nunique()
    count=len(data)
    dtypes = data.dtypes
    categorical = []
    numerical = []
    dnu = dict(nunique)
    dnu.pop(label[0], None)
    for key in dnu:
        print(key)
        if nunique[key] <= 5 and count>50:
            categorical.append(key)
        elif (dtypes[key] != object):
            numerical.append(key)
        print(dtypes[key])
    
    return (categorical, numerical)

#vraca dataframe za datu putanju
def load_data(path):
  df_comma = pd.read_csv(path, nrows=1,sep=",")
  df_semi = pd.read_csv(path, nrows=1, sep=";")
  if df_comma.shape[1]>df_semi.shape[1]:
      print("comma delimited")
      return pd.read_csv(path,sep=',')
  else:
      print("semicolon delimited")
      return pd.read_csv(path,sep=';')
  
def split_data(data,train_percentage=0.8,test_percentage=0.1,val_percentage=0.1):
  #podela 80/10/10
  train,val,test=np.split(data.sample(frac=1),[int(train_percentage*len(data)),int((val_percentage+train_percentage)*len(data))])
  return train,val,test


def df_to_dataset(dataframe,target, shuffle=True, batch_size=32):
  df = dataframe.copy()
  labels = df.pop(target)
  df = {key: value[:,tf.newaxis] for key, value in df.items()}
  ds = tf.data.Dataset.from_tensor_slices((dict(df), labels))
  if shuffle:
    ds = ds.shuffle(buffer_size=len(dataframe))
  ds = ds.batch(batch_size)
  ds = ds.prefetch(batch_size)
  return ds

def get_normalization_layer(name, dataset):
  # Create a Normalization layer for the feature.
  normalizer = tf.keras.layers.Normalization(axis=None)

  # Prepare a Dataset that only yields the feature.
  feature_ds = dataset.map(lambda x, y: x[name])

  # Learn the statistics of the data.
  normalizer.adapt(feature_ds)

  return normalizer

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

def prepare_preprocess_layers(data,target,train):
  categorical_column_names,numerical_column_names=determine_variable_types(data,target)

  if(target in categorical_column_names):
    categorical_column_names.remove(target)
  elif(target in numerical_column_names):
    numerical_column_names.remove(target)

  train_ds=df_to_dataset(train,target,batch_size=32)
  #todo proveriti normalizaciju, da li radi kako treba
  # depth_col=train_features["depth"]
  # layer=get_normalization_layer('depth',train_ds)
  # print(layer(depth_col))

  all_inputs = []
  encoded_features = []
  all_num_inputs=[]

  # Numerical features.
  for header in numerical_column_names:
      numeric_col = tf.keras.Input(shape=(1,), name=header)
      all_inputs.append(numeric_col)
      all_num_inputs.append(numeric_col)

  for header in categorical_column_names:
      if(data.dtypes[header]!=object):
          tip="int64"
      else:
          tip="string"
      categorical_col = tf.keras.Input(shape=(1,), name=header, dtype=tip)
      encoding_layer = get_category_encoding_layer(name=header,
                                                  dataset=train_ds,
                                                  dtype=tip)
      encoded_categorical_col = encoding_layer(categorical_col)
      all_inputs.append(categorical_col)
      encoded_features.append(encoded_categorical_col)

  encoded_features=encoded_features+all_num_inputs
  return all_inputs,encoded_features

def make_model(all_inputs,encoded_features,layers:List[Sloj],loss_metric,success_metric, number_of_classes=0,mean_value=1):
  all_features = tf.keras.layers.concatenate(encoded_features)
  x=tf.keras.layers.Normalization(axis=-1)(all_features)
  for layer in layers:
    x=tf.keras.layers.Dense(layer.broj_cvorova,activation=layer.aktivaciona_funkcija)(x)
  if (number_of_classes!=0):
    output = tf.keras.layers.Dense(number_of_classes+1, activation="softmax")(x)
  else:
    output = tf.keras.layers.Dense(1)(x)

  model = tf.keras.Model(all_inputs, output)
  initial_learning_rate = 1.0
  if mean_value<5000:
      initial_learning_rate=0.1
  lr_schedule = tf.keras.optimizers.schedules.ExponentialDecay(
      initial_learning_rate,
      decay_steps=1000,
      decay_rate=0.96,
      staircase=True)
  model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=lr_schedule),
                loss=loss_metric,
                metrics=success_metric)
  return model


def train_model(model,train_data,validation_data,target,client_id,epoch_number=20):
  model.fit(df_to_dataset(train_data,target,shuffle=False), epochs=epoch_number, validation_data=df_to_dataset(validation_data,target,shuffle=False),callbacks=CustomCallback(root=Konfiguracija["KonfiguracijaServera"]["mlURL"],path="publish/epoch/end",send_as_json=True,to_send=client_id))

def test_model(model,test_data,target):
  return model.evaluate(df_to_dataset(test_data,target,shuffle=False))

def make_regression_model(data,hiperparametri:Hiperparametri):
  relevant_columns=hiperparametri.ulazne_kolone+[hiperparametri.izlazna_kolona]
  data=data[relevant_columns]

  data.drop_duplicates()
  data.dropna(inplace=True)
  train,val,test=split_data(data,(100-hiperparametri.test_skup-10)/100,hiperparametri.test_skup/100,0.1)

  all_inputs,encoded_features=prepare_preprocess_layers(data,hiperparametri.izlazna_kolona,train)
  model=make_model(all_inputs,encoded_features,hiperparametri.slojevi,hiperparametri.mera_greske,hiperparametri.mera_uspeha,mean_value=data[hiperparametri.izlazna_kolona].mean())
  return model,train,val,test

def make_classification_model(data, hiperparametri:Hiperparametri):
  relevant_columns=hiperparametri.ulazne_kolone+[hiperparametri.izlazna_kolona]
  data=data[relevant_columns]

  data.drop_duplicates()
  data.dropna(inplace=True)
  broj_klasa = data[hiperparametri.izlazna_kolona].nunique()
  train,val,test=split_data(data,(100-hiperparametri.test_skup-10)/100,hiperparametri.test_skup/100,0.1)

  all_inputs,encoded_features=prepare_preprocess_layers(data,hiperparametri.izlazna_kolona,train)
  model=make_model(all_inputs,encoded_features,hiperparametri.slojevi,hiperparametri.mera_greske,hiperparametri.mera_uspeha, broj_klasa)
  return model,train,val,test

# data=load_data("titanic/train.csv")
# target="Survived"
# data.dropna(inplace=True)

# train,val,test=split_data(data,0.8,0.1,0.1)

# all_inputs,encoded_features=prepare_preprocess_layers(data,target,train)
# model=make_model(all_inputs,encoded_features)
# train_model(model,train,val,target,1)
# test_model(model,test,target)

# slojevi = [Sloj(64, 'relu'), Sloj(20, 'relu'), Sloj(32, 'relu')]
# hiperparametri = Hiperparametri('klasifikacija', 0.1, slojevi, 'sparse_categorical_crossentropy', 'Accuracy', 20, 
# ['Type', 'Gender', 'Color1', 'Color2', 'MaturitySize', 'FurLength', 'Vaccinated', 'Sterilized', 'Health', 'Age', 'Fee', 'PhotoAmt'],
# 'AdoptionSpeed')
# data = pd.read_csv('datasets/petfinder-mini.csv')
# classification_model, classification_train, classification_val, classification_test = make_classification_model(data, hiperparametri)

#train_model(classification_model, classification_train, classification_val, hiperparametri.izlazna_kolona, 1, 5)
