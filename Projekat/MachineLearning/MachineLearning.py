import tensorflow as tf
import matplotlib
from matplotlib import pyplot as plt
from fastapi import FastAPI
import uvicorn
import json

#vazno!!!!!!
#pokretanje aplikacije komanda
#uvicorn MachineLearning:app --reload

 
app=FastAPI()

@app.get("/")
def mainPage():
    return "radi api"