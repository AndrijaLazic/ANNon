import io,os
import pymongo, gridfs
from gridfs import GridFS
from pymongo import MongoClient
from bson import ObjectId
import tensorflow as tf
from keras.models import load_model

MONGO_HOST = "127.0.0.1"
MONGO_PORT = 27017
MONGO_DB = "modeli"

myclient = pymongo.MongoClient(MONGO_HOST, MONGO_PORT)
mydb = myclient[MONGO_DB]
fs = gridfs.GridFS(mydb)
model_name = 'model.h5'

def saveModel(model):
    model.save("model.h5")
    #postojeci sacuvani model upisuje u bazu
    with io.FileIO(model_name, 'r') as fileObject:
        docId = fs.put(fileObject, filename=model_name)
    os.remove("model.h5")
    return docId

def loadModelById(id):
    #pravi fajl iz baze, trazi po id-ju, iz ovog fajla ce se napraviti model kada treba da se koristi
    with open('tf_model_fromMongo.h5', 'wb') as fileObject:
        fileObject.write(fs.get(ObjectId(id)).read() )
    model=load_model("tf_model_fromMongo.h5")
    os.remove("tf_model_fromMongo.h5")
    return model