from typing import List
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi import Body
import statistics as stats
import pandas as pd
from pydantic import BaseModel

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
 

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
    



manager = ConnectionManager()
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

@app.websocket("/test/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            #todo
            await websocket.send_text(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/publish/epoch/end")
async def post_data(request:Request):
    #u model.fit treba staviti parametar callbacks=[keras.callbacks.RemoteMonitor(root="http://localhost:8000",path="/publish/epoch/end",send_as_json=False)]
    print("uslo")
    result=await request.form()
    return result