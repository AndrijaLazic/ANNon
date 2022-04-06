import io
from types import ClassMethodDescriptorType
from typing import Dict, List

from rsa import verify
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect,HTTPException
from fastapi.responses import HTMLResponse
from fastapi import Body
import statistics as stats
import pandas as pd
from pydantic import BaseModel
from example import fja
from asgiref.sync import sync_to_async
import requests
import statistics as stats
import csv
#vazno!!!!!!
#pokretanje aplikacije komanda
#uvicorn MachineLearning:app --reload

#za testiranje slanja stanja tokom treniranja, samo kliknuti na send da bi se pokrenulo
html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <h2>Your ID: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var client_id = Date.now()
            document.querySelector("#ws-id").textContent = client_id;
            var ws = new WebSocket(`ws://localhost:8000/test/${client_id}`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""



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
        self.active_connections: Dict= {}

    async def connect(self, websocket: WebSocket,client_id:str):
        await websocket.accept()
        self.active_connections[client_id]=websocket

    def disconnect(self,client_id:str):
        self.active_connections.pop(client_id,True)

    async def receive_text(self,client_id:str):
        return await self.active_connections[client_id].receive_text()

    async def send_text(self,client_id:str,data:str):
        await self.active_connections[client_id].send_text(data)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()
app=FastAPI()

@app.get("/")
def mainPage():
    return HTMLResponse(html)


@app.post('/send')
async def update_item(
        model:UploadedFile
):  
    s=requests.get('https://localhost:7286/api/FajlKontroler/DajFajl?NazivFajla='+model.FileName+'&imeKorisnika=Korisnik',verify=False).content
    fajl=pd.read_csv(io.StringIO(s.decode('utf-8')))

    if(fajl.empty):
        raise HTTPException(status_code=404, detail="Fajl ne postoji")
    Statistic=stats.getStats(fajl)
    return Statistic

@app.websocket("/test/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket,client_id)
    try:
        while True:
            data = await websocket.receive_text()
            #ovde treba pozvati asinhronu fju koja prihvata id_klijenta i kada zove model.fit,zove i CustomCallback sa parametrima:
            #root="http://localhost:8000"
            #path="/publish/epoch/end"
            #send_as_json=True
            #to_send=client_id
            #primer sablona funkcije je u example.py
            
            #sledeci poziv radi
            await sync_to_async(fja)(client_id)
            #print(client_id)
            #await manager.send_text(client_id,"radisdadasd")
    except WebSocketDisconnect:
        manager.disconnect(client_id)


@app.post("/publish/epoch/end")
async def post_data(request:Request):
    result=await request.json()
    await manager.send_text(result['to_send'],str(result))
    await manager.receive_text(result['to_send'])
    print(result)