from distutils.command.build import build
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn import preprocessing
import tensorflow as tf
import keras.layers as layers

df = pd.read_csv('diamonds/diamonds.csv')
df.drop('Unnamed: 0', axis=1, inplace=True)
print(df.head(3))

df.isnull().sum()
df.info()

# plot price vs. carat
sns.pairplot(df, x_vars=['carat'], y_vars = ['price'])
# plot carat vs other Cs
sns.pairplot(df, x_vars=['cut', 'clarity', 'color'], y_vars = ['carat'])
#plt.show()

def histplot(df, listvar):
    fig, axes = plt.subplots(nrows=1, ncols=len(listvar), figsize=(20, 3))
    counter=0
    for ax in axes:
        df.hist(column=listvar[counter], bins=20, ax=axes[counter])
        plt.ylabel('Price')
        plt.xlabel(listvar[counter])
        counter = counter+1
    plt.show()

linear_vars = df.select_dtypes(include=[np.number]).columns
print(list(linear_vars))

#histplot(df,linear_vars)

print('0 values →', 0 in df.values)
df[linear_vars] = df[linear_vars] + 0.01
print('Filled all 0 values with 0.01. Now any 0 values? →', 0 in df.values)

def sorteddf(df, listvar):
    for var in listvar:
        print('sorted by ' + var + ' --> ' + str(list(df[listvar].sort_values(by=var,ascending=False)[var].head())))

#sorteddf(df, linear_vars)

def dfboxplot(df, listvar):
   fig, axes = plt.subplots(nrows=1, ncols=len(listvar), figsize=(20, 3))
   counter=0
   for ax in axes:
       df.boxplot(column=listvar[counter], ax=axes[counter])
       plt.ylabel('Price')
       plt.xlabel(listvar[counter])
       counter = counter+1
   plt.show()

#dfboxplot(df, linear_vars)

def removeoutliers(df, listvars, z):
    from scipy import stats
    for var in listvars:
        df1 = df[np.abs(stats.zscore(df[var])) < z]
    return df1

df = removeoutliers(df, linear_vars, 2)


# this log converts dataframe's features inplace
def convertfeatures2log(df, listvars):
   for var in listvars:
      df[var] = np.log(df[var])

#convertfeatures2log(df, linear_vars)
#histplot(df, linear_vars)

def convert_catg(df1):
   from sklearn.preprocessing import LabelEncoder
   le = LabelEncoder()
   # Find the columns of object type along with their column index
   object_cols = list(df1.select_dtypes(exclude=[np.number]).columns)
   object_cols_ind = []
   for col in object_cols:
       object_cols_ind.append(df1.columns.get_loc(col))

   # Encode the categorical columns with numbers 
   for i in object_cols_ind:
       df1.iloc[:,i] = le.fit_transform(df1.iloc[:,i])

convert_catg(df)
#df.head(3)

X_df = df.drop(['price', 'x', 'y', 'z'], axis=1)
y_df = df[['price']] # two [[ to create a DF

df_columns= X_df.columns

df_le = X_df.copy()
# add a new column in dataframe — join 2 dataframe columns-wise
df_le['price'] = y_df['price'].values
df_le.corr()

normalizer = tf.keras.layers.Normalization(axis=-1)
normalizer.adapt(np.array(X_df))

# X_df.describe().transpose()[['mean', 'std']]
# print(normalizer.mean.numpy())


from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X_df, y_df, test_size=0.3, random_state=42)

X_train.describe().transpose()[['mean', 'std']]

def build_and_compile_model(normalizer):
  model = tf.keras.Sequential([
      normalizer,
      layers.Dense(64, activation='relu'),
      layers.Dense(64, activation='relu'),
      layers.Dense(1)
  ])

  model.compile(loss='mean_squared_error',
                optimizer=tf.keras.optimizers.Adam(0.001)) #learning_rate = 0.001
  return model

carat_npa = np.array(X_df[['carat']])

carat_normalizer = tf.keras.layers.Normalization(input_shape=[1,], axis=None)
carat_normalizer.adapt(carat_npa)

carat_model = build_and_compile_model(carat_normalizer)
carat_model.summary()

# data_train = pd.DataFrame(X_train,  columns=df_columns)
# data_test = pd.DataFrame(X_test,  columns=df_columns)

def plot_loss(history):
  plt.plot(history.history['loss'], label='loss')
  plt.plot(history.history['val_loss'], label='val_loss')
  plt.ylim([0, 10])
  plt.xlabel('Epoch')
  plt.ylabel('Error [Diamonds]')
  plt.legend()
  plt.grid(True)


history = carat_model.fit(X_train['carat'], y_train, validation_split=0.3, verbose=0, epochs=100)

plot_loss(history)
plt.show()


dnn_model = build_and_compile_model(normalizer)
dnn_model.summary()

history = dnn_model.fit(
    X_train,
    y_train,
    validation_split=0.3,
    verbose=0, epochs=10)

plot_loss(history)


def plot_carat(x, y):
  plt.scatter(X_train['carat'], y_train, label='Data')
  plt.plot(x, y, color='k', label='Predictions')
  plt.xlabel('Carat')
  plt.ylabel('Price')
  plt.legend()


x = tf.linspace(0.0, 2, 2)
y = carat_model.predict(x)

plot_carat(x, y)
plt.show()