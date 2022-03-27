from nntf2 import get_model
from nntf2 import determine_variable_types
import pandas as pd

data = pd.read_csv("diamonds/diamonds.csv")
data.head()
data.nunique()

# categorical_feature_names = ['cut','color']
# numeric_feature_names = ['x', 'y', 'z', 'carat']
predicted_feature_name = ['price']

categorical_feature_names, numeric_feature_names = determine_variable_types(data, predicted_feature_name)

 
X=data[numeric_feature_names].values
y=data[predicted_feature_name].values
 
### Sandardization of data ###
from sklearn.preprocessing import StandardScaler
PredictorScaler=StandardScaler()
TargetVarScaler=StandardScaler()
 
# Storing the fit object for later reference
PredictorScalerFit=PredictorScaler.fit(X)
TargetVarScalerFit=TargetVarScaler.fit(y)
 
# Generating the standardized values of X and y
X=PredictorScalerFit.transform(X)
y=TargetVarScalerFit.transform(y)
#type(X)

model, target, data = get_model(data, predicted_feature_name, 'one_hot', 2, 10, "relu")
#history = model.fit(dict(data_train), target_train, epochs=20, batch_size=8)

from sklearn.model_selection import train_test_split
data_train, data_test, target_train, target_test = train_test_split(data, target, test_size=0.2, random_state=42)

# data_train.shape
# data_test.shape
# target_train.shape
# target_test.shape

from keras.models import Sequential
from keras.layers import Dense

model = Sequential()
 
# Defining the Input layer and FIRST hidden layer, both are same!
model.add(Dense(units=5, input_dim=7, kernel_initializer='normal', activation='relu'))
 
# Defining the Second layer of the model
# after the first layer we don't have to specify input_dim as keras configure it automatically
model.add(Dense(units=5, kernel_initializer='normal', activation='tanh'))
 
# The output neuron is a single fully connected node 
# Since we will be predicting a single number
model.add(Dense(1, kernel_initializer='normal'))
 
# Compiling the model
model.compile(loss='mean_squared_error', optimizer='adam')
 
# Fitting the ANN to the Training set
model.fit(data_train, target_train ,batch_size = 20, epochs = 50, verbose=1)
