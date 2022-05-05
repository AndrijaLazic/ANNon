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
        if nunique[key] <= min(20, count//5):
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

def df_to_dataset(dataframe, target, shuffle=True, one_hot_label=False, batch_size=32):
  df = dataframe.copy()
  if one_hot_label:
    target = get_one_hot_target(target)
  df = {key: value[:,tf.newaxis] for key, value in df.items()}
  ds = tf.data.Dataset.from_tensor_slices((dict(df), target))
  if shuffle:
    ds = ds.shuffle(buffer_size=len(dataframe))
  ds = ds.batch(batch_size)
  ds = ds.prefetch(batch_size)
  return ds

def get_one_hot_target(target):
  value = sorted(set(target))
  if type(value[0]) is str:
    lookup = tf.keras.layers.StringLookup(vocabulary=value, output_mode="one_hot")
  else:
    lookup = tf.keras.layers.IntegerLookup(vocabulary=value, output_mode="one_hot")
  target2 = target[:, tf.newaxis]
  labels = lookup(target2)
  return labels

@tf.autograph.experimental.do_not_convert
def get_normalization_layer(name, dataset):
  # Create a Normalization layer for the feature.
  normalizer = tf.keras.layers.Normalization(axis=None)

  # Prepare a Dataset that only yields the feature.
  feature_ds = dataset.map(lambda x, y: x[name])

  # Learn the statistics of the data.
  normalizer.adapt(feature_ds)

  return normalizer

@tf.autograph.experimental.do_not_convert
def get_category_encoding_layer(feature_ds, dtype, max_tokens=None):
  if dtype == 'string':
    index = tf.keras.layers.StringLookup(max_tokens=max_tokens)
  else:
    index = tf.keras.layers.IntegerLookup(max_tokens=max_tokens)
  index.adapt(feature_ds)

  encoder = tf.keras.layers.CategoryEncoding(num_tokens=index.vocabulary_size())
  return lambda feature: encoder(index(feature))

@tf.autograph.experimental.do_not_convert
def prepare_preprocess_layers(data,target,train, one_hot_label=False):
  categorical_column_names,numerical_column_names=determine_variable_types(data,target)

  if(target in categorical_column_names):
    categorical_column_names.remove(target)
  elif(target in numerical_column_names):
    numerical_column_names.remove(target)

  train_target = train.pop(target)
  train_ds=df_to_dataset(train, train_target, one_hot_label=one_hot_label, batch_size=32)

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
      feature_ds = train_ds.map(lambda x, y: x[header])
      categorical_col = tf.keras.Input(shape=(1,), name=header, dtype=tip)
      encoding_layer = get_category_encoding_layer(feature_ds=feature_ds,
                                                  dtype=tip)
      encoded_categorical_col = encoding_layer(categorical_col)
      all_inputs.append(categorical_col)
      encoded_features.append(encoded_categorical_col)

  encoded_features=encoded_features+all_num_inputs
  return all_inputs, encoded_features, train_ds

def make_model(all_inputs,encoded_features,layers:List[Sloj],loss_metric,success_metric, broj_klasa=0, mean_value=1):
  all_features = tf.keras.layers.concatenate(encoded_features)
  x=tf.keras.layers.Normalization(axis=-1)(all_features)
  for layer in layers:
    x=tf.keras.layers.Dense(layer.broj_cvorova,activation=layer.aktivaciona_funkcija)(x)
  if (broj_klasa == 0):
    output = tf.keras.layers.Dense(1)(x)
  else:
    output = tf.keras.layers.Dense(broj_klasa+1, activation="softmax")(x)

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


def train_model(model,train_data,validation_data,client_id,epoch_number=20):
  model.fit(train_data, epochs=epoch_number, validation_data=validation_data,callbacks=CustomCallback(root=Konfiguracija["KonfiguracijaServera"]["mlURL"],path="publish/epoch/end",send_as_json=True,to_send=client_id))

def test_model(model,test_data):
  return model.evaluate(test_data)

def make_regression_model(data,hiperparametri:Hiperparametri):
  relevant_columns=hiperparametri.ulazne_kolone+[hiperparametri.izlazna_kolona]
  data=data[relevant_columns]

  data.drop_duplicates()
  data.dropna(inplace=True)
  train,val,test=split_data(data,(100-hiperparametri.test_skup-10)/100,hiperparametri.test_skup/100,0.1)

  all_inputs, encoded_features, train_ds=prepare_preprocess_layers(data,hiperparametri.izlazna_kolona,train, one_hot_label=False)
  val_target = val.pop(hiperparametri.izlazna_kolona)
  test_target = test.pop(hiperparametri.izlazna_kolona)
  val_ds = df_to_dataset(val, val_target)
  test_ds = df_to_dataset(test, test_target)
  model=make_model(all_inputs,encoded_features,hiperparametri.slojevi,hiperparametri.mera_greske,hiperparametri.mera_uspeha)
  return model,train_ds,val_ds,test_ds

def make_classification_model(data, hiperparametri:Hiperparametri):
  relevant_columns=hiperparametri.ulazne_kolone+[hiperparametri.izlazna_kolona]
  data=data[relevant_columns]

  data.drop_duplicates()
  data.dropna(inplace=True)
  broj_klasa = data[hiperparametri.izlazna_kolona].nunique()
  if broj_klasa > 20 or broj_klasa == 2:
    broj_klasa=0
  train,val,test=split_data(data,(100-hiperparametri.test_skup-10)/100,hiperparametri.test_skup/100,0.1)
  if (hiperparametri.mera_greske=='categorical_crossentropy'):
    one_hot_label=True
  else:
    one_hot_label=False
  all_inputs, encoded_features, train_ds=prepare_preprocess_layers(data,hiperparametri.izlazna_kolona,train, one_hot_label)
  val_target = val.pop(hiperparametri.izlazna_kolona)
  val_ds = df_to_dataset(val, val_target, one_hot_label=one_hot_label)
  test_target = test.pop(hiperparametri.izlazna_kolona)
  test_ds = df_to_dataset(test, test_target, one_hot_label=one_hot_label)
  model=make_model(all_inputs,encoded_features,hiperparametri.slojevi,hiperparametri.mera_greske,hiperparametri.mera_uspeha, broj_klasa)
  return model,train_ds,val_ds,test_ds

data=load_data("datasets/diamonds.csv")
slojevi = [Sloj(20, 'relu'), Sloj(20, 'relu'), Sloj(20, 'relu')]
hiperparametri = Hiperparametri('regresija', 0.1, slojevi, 'mae', 'mae', 10, 
['carat', 'cut', 'color', 'clarity', 'depth', 'X', 'Y', 'Z'],
'price')
regression_model, regression_train, regression_val, regression_test = make_regression_model(data, hiperparametri)
train_model(regression_model, regression_train, regression_val, 1, 15)

# slojevi = [Sloj(64, 'relu'), Sloj(20, 'relu'), Sloj(32, 'relu')]
# hiperparametri = Hiperparametri('klasifikacija', 0.1, slojevi, 'categorical_crossentropy', 'Accuracy', 20, 
# ['Type', 'Gender', 'Color1', 'Color2', 'MaturitySize', 'FurLength', 'Vaccinated', 'Sterilized', 'Health', 'Age', 'Fee', 'PhotoAmt'],
# 'AdoptionSpeed')
# data = pd.read_csv('datasets/petfinder-mini.csv')

# data=load_data("datasets/titanic/train.csv")
# slojevi = [Sloj(20, 'relu'), Sloj(20, 'relu'), Sloj(10, 'relu')]
# hiperparametri = Hiperparametri('klasifikacija', 0.1, slojevi, tf.keras.losses.BinaryCrossentropy(from_logits=True), 'Accuracy', 10, 
# ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Cabin', 'Embarked'],
# 'Survived')

# classification_model, classification_train, classification_val, classification_test = make_classification_model(data, hiperparametri)

# train_model(classification_model, classification_train, classification_val, 1, 15)
