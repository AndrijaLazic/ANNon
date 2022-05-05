import io
import json
from os import truncate
from typing import Dict, List

from requests.models import Response

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect,HTTPException
from fastapi.responses import HTMLResponse
from fastapi import Body
import statistics as stats
from matplotlib import testing
import pandas as pd
from pydantic import BaseModel, Json
from requests.api import request
from example import fja
from asgiref.sync import sync_to_async
import requests
import statistics as stats
from mreza import *
import model_handling
#vazno!!!!!!
#pokretanje aplikacije komanda
#uvicorn MachineLearning:app --reload


class UploadedFile(BaseModel):
    userID:str
    FileName:str
    Putanja:str

class TestRequest(BaseModel):
    userID:str
    metric:str

class FileWithStatistic:
    FileName:str
    Statistic:dict

    def __init__(self,fileModel,statistic) -> None:
        self.FileName=fileModel.FileName
        self.Statistic=statistic
class ResponseModel:
    Status:int
    Content:str
    def __init__(self,status,content) -> None:
        self.Status = status
        self.Content = content

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__)
    

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict= {}
        self.filePaths:Dict={}
        self.testSets:Dict={}
        self.models:Dict={}

    async def connect(self, websocket: WebSocket,client_id:str):
        await websocket.accept()
        self.active_connections[client_id]=websocket

    def disconnect(self,client_id:str):
        self.active_connections.pop(client_id,True)
        self.filePaths.pop(client_id,True)

    async def receive_text(self,client_id:str):
        return await self.active_connections[client_id].receive_text()

    async def send_text(self,client_id:str,data:str):
        await self.active_connections[client_id].send_text(data)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

    async def addFilePath(self,client_id:str,path:str):
        self.filePaths[client_id]=path

    async def getFilePath(self,client_id:str):
        return self.filePaths[client_id]
    
    async def addTestSet(self,client_id:str,set,target):
        self.testSets[client_id]=(set,target)
    
    async def getTestSet(self,client_id):
        return self.testSets[client_id]
    async def addModel(self,client_id:str,model):
        self.models[client_id]=model
    async def getModel(self,client_id):
        return self.models[client_id]


manager = ConnectionManager()
app=FastAPI()
#konfiguracija
f = open('KonfiguracioniFajl.json')
Konfiguracija = json.load(f)
#print(Konfiguracija['KonfiguracijaServera']['backURL'])

@app.post('/send')
async def update_item(
        model:UploadedFile
):  
    s=requests.get(Konfiguracija['KonfiguracijaServera']['backURL']+'api/FajlKontroler/DajFajl?NazivFajla='+model.FileName+'&imeKorisnika=Korisnik',verify=False).content
    try:
        fajl=pd.read_csv(io.StringIO(s.decode('utf-8')),sep='|')
    except Exception:

        return ResponseModel(1,"Greska pri parsiranju fajla.").toJSON()

    if(fajl.empty):
        raise HTTPException(status_code=404, detail="Fajl ne postoji")
    
    await manager.addFilePath(model.userID,Konfiguracija['KonfiguracijaServera']['backURL']+'api/FajlKontroler/DajFajl?NazivFajla='+model.FileName+'&imeKorisnika=Korisnik')
    Statistic=stats.getStats(fajl)
    return ResponseModel(0,Statistic).toJSON()

@app.websocket("/test/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket,client_id)
    try:
        while True:
            data = await websocket.receive_text()
            model=json.loads(data)
            s=requests.get(await manager.getFilePath(client_id),verify=False).content
            fajl=pd.read_csv(io.StringIO(s.decode('utf-8')),sep='|')
            if(fajl.empty):
                raise HTTPException(status_code=404, detail="Fajl ne postoji")

            slojevi=[Sloj(sloj["BrojNeurona"],sloj["AktivacionaFunkcija"]) for sloj in model["ListaSkrivenihSlojeva"]]
            hiperparametri=Hiperparametri(
                model["TipProblema"],
                model["odnosPodataka"],
                slojevi,model["MeraGreske"],
                model["MeraUspeha"],
                model["BrojEpoha"],
                model["UlazneKolone"],
                model["IzlaznaKolona"])
            if hiperparametri.tip_problema == 'regresija':
                model,train,val,test=make_regression_model(fajl,hiperparametri)
            elif hiperparametri.tip_problema == 'klasifikacija':
                model,train,val,test=make_classification_model(fajl,hiperparametri)
            await manager.addTestSet(client_id,test,hiperparametri.izlazna_kolona)
            filename=await sync_to_async(train_model)(model,train,val,client_id,hiperparametri.broj_epoha)
            await manager.addModel(client_id,model)
            #testiranje
            #await sync_to_async(test_model)(filename,train,hiperparametri.izlazna_kolona)
            #await manager.send_text(client_id,"radisdadasd")
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@app.post("/publish/epoch/end")
async def post_data(request:Request):
    result=await request.json()
    await manager.send_text(result['to_send'],str(result))
    await manager.receive_text(result['to_send'])
    print(result)

@app.post("/compare")
async def start_testing(
    model:TestRequest
):
    test,target=await manager.getTestSet(model.userID)
    model=await manager.getModel(model.userID)
    result=test_model(model,test,target)
    #ovako samo za regresiju
    recnik={"loss":result[0],"metric":result[1]}
    ret=ResponseModel(0,json.dumps(recnik)).toJSON()
    return ret
    
#promeni da se ne prima ovaj testrequest nego samo userid neka bude string ili sta god
@app.post("/save")
async def saveModel(req: TestRequest):
    try:
        #model = await manager.getModel(req.userID)
        #model_handling.save_model(model)
        return ResponseModel(0, "Proslo").toJSON()
    except :
        return ResponseModel(1,"Greska pri cuvanju modela!").toJSON()
    