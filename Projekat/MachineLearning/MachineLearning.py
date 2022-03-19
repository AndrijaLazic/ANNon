import base64
from fastapi import FastAPI
from fastapi import Body
import statistics
import pandas as pd
from pydantic import BaseModel

import statistics as stats
#vazno!!!!!!
#pokretanje aplikacije komanda
#uvicorn MachineLearning:app --reload

class UploadedFile(BaseModel):
    filename:str
    file:dict

 
app=FastAPI()

@app.get("/")
def mainPage():
    return "radi api"


@app.post('/send')
async def update_item(
        payload: dict=Body(...)
):
    csvString=payload["file"]
    base64_bytes = csvString.encode('utf-8')
    with open(payload["FileName"], 'wb') as file_to_save:
        decoded_file_data = base64.decodebytes(base64_bytes)
        file_to_save.write(decoded_file_data)
    df=pd.read_csv(payload["FileName"])
    jsonString=stats.getStats(df)
    #return json.loads(str(payload).replace("\'","\""))
    return jsonString
    
