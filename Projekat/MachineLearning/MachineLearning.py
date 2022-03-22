import base64
import socket
import threading
from fastapi import FastAPI, Request
from fastapi import Body
import statistics
import pandas as pd
from pydantic import BaseModel
from io import StringIO

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
 
app=FastAPI()

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
        request:Request
):   
    HOST = "127.0.0.1"
    PORT = 65432  
    #server = mreza, nova nit

    result= await request.json()
    #poziv funkcije treniranja u novoj niti
    #napraviti dataframe i proslediti ga neuronskoj mrezi i ostale parametre
    nit=threading.Thread(target=stats.getStats,args=(pd.DataFrame(data=[[1,2,3],[2,3,4]], columns=["kol","kol2","kol34"]),))
    nit.start()

    # #klijent = kontroler
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(b"Hello, world")

        while True:              
            #prima podatke i salje ih sse
            data=s.recv(1024)
            if not data:
                break
            print(f"Received {data!r}")
    return dict(result)
    
