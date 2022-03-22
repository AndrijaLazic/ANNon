import asyncio
import base64
import socket
import threading
from fastapi import FastAPI, Request
from fastapi import Body
import statistics
import pandas as pd
from pydantic import BaseModel
from io import StringIO
from sse_starlette.sse import EventSourceResponse
from fastapi.middleware.cors import CORSMiddleware
import CustomCallback
import nntf2

import statistics as stats
#vazno!!!!!!
#pokretanje aplikacije komanda
#uvicorn MachineLearning:app --reload

class UploadedFile(BaseModel):
    FileName:str
    Putanja:str

class FileWithStatistic:
    FileName:str
    Statistic:dict

    def __init__(self,fileModel,statistic) -> None:
        self.FileName=fileModel.FileName
        self.Statistic=statistic

class Parameters(BaseModel):
    FilePath:str
    Input:list
    Output:str
    Encoding:str
    LayerNumber:int 
    NeuronNumver:int
    ActivationFunction:str
 
app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def mainPage():
    return "radi api"


@app.post('/send')
async def update_item(
        model:UploadedFile
):
    fajl = pd.read_csv (model.Putanja)
    Statistic=stats.getStats(fajl)
    return Statistic

@app.post('/param')
async def post_params(
        model:Parameters
):   
    #ovde se salju parametri i koristice logGenerator=odnosno nn kao 
    event_generator = logGenerator(model)
    return EventSourceResponse(event_generator)

async def logGenerator(model):
    HOST = "127.0.0.1"
    PORT = 65432  
    #server = mreza, nova nit
    # data=pd.read_csv(model.FilePath)
    # numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    # numeric_columns = data.select_dtypes(include=numerics).columns.values.tolist()
    # categorical_columns=data.select_dtypes(include=["object"]).columns.values.tolist()
    # print(type(numeric_columns))
    # print(categorical_columns)
    # print([data.columns[-1]])

    #pravljenje modela i pozivanje njegovoh treniranja

    # nnmodel=nntf2.get_model(data,numeric_columns,categorical_columns,[data.columns[1]],"multi_hot",2,10,"relu")
    # nit=threading.Thread(target=nnmodel.fit,args={"x":dict(data),"y":data[-1],"epochs":20,"batch_size":8,"callbacks":[CustomCallback(HOST,PORT)]}) #poziv funkcije treniranja
    # nit.start()

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(b"Hello, world")

        while True:              
            #prima podatke i salje ih sse
            data=s.recv(1024)
            if not data:
                break
            print(f"Received {data!r}")
            yield data