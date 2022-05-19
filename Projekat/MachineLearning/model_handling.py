import json
import tensorflow as tf
import uuid
import io,os
from keras.models import load_model


def save_model(model,params=None,history=None):
    filename=str(uuid.uuid4())
    filepath = os.path.join("modeli",filename)
    os.makedirs(filepath)
    model.save(filepath)
    params_dict=json.loads(params)
    params_dict["loss"]=history["loss"]
    params_dict["val_loss"]=history["val_loss"]
    save_parameters(json.dumps(params_dict),filepath)
    return filename

def save_parameters(params,path):
    filename=os.path.join(path,"parametri.json")
    f = open(filename,"w")
    f.write(params)
    f.close()

def load(filename):
    filepath = os.path.join("modeli",filename)
    model=load_model(filepath)
    return model

def get_params(filename):
    filepath = os.path.join("modeli",filename,"parametri.json")
    f=open(filepath,"r")
    content=f.read()
    return content

