import base64
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
    file:str

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
    csvString=model.file
    base64_bytes = csvString.encode('utf-8')
    with open(model.FileName, 'wb') as file_to_save:
        decoded_file_data = base64.decodebytes(base64_bytes)
        file_to_save.write(decoded_file_data)
    df=pd.read_csv(model.FileName)
    Statistic=stats.getStats(df)
    return Statistic

@app.post('/param')
async def update_item(
        request:Request
):   
    result= await request.json()
    return dict(result)
    
