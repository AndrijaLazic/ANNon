import tensorflow as tf
import matplotlib
from matplotlib import pyplot as plt
from fastapi import FastAPI
import uvicorn
import json
import requests
#vazno!!!!!!
#pokretanje aplikacije komanda
#uvicorn MachineLearning:app --reload

 
app=FastAPI()

@app.get("/")
def mainPage():
    return "radi api"


@app.post("/")
def postMethod(data):
    res = requests.post("https://localhost:7286/api/MachineLearning")
    return "poslato " + res