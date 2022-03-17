import tensorflow as tf
import matplotlib
from matplotlib import pyplot as plt
from fastapi import FastAPI
import uvicorn
import json
import requests
from fastapi import Body
#vazno!!!!!!
#pokretanje aplikacije komanda
#uvicorn MachineLearning:app --reload

 
app=FastAPI()

@app.get("/")
def mainPage():
    return "radi api"


@app.post('/send')
async def update_item(
        payload: dict = Body(...)
):
   return payload

    