import numpy as np
import pandas as pd
import json
from scipy import stats

def determine_variable_types1(data):
    nunique = data.nunique()
    count=len(data)
    dtypes = data.dtypes
    categorical = []
    numerical = []
    dnu = dict(nunique)
    for key in dnu:
        if nunique[key] <= min(20, count//5):
            categorical.append(key)
        elif (dtypes[key] != object):
            numerical.append(key)
    
    return (categorical, numerical)

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def getStats(data):

    analiza=dict()
    analiza["numericke_kolone"]=[]
    analiza["kategoricke_kolone"]=[]
    broj_redova=data.shape[0]
    kategorijske_kolone,_=determine_variable_types1(data)

    for column in kategorijske_kolone:
        data[column]=pd.Categorical(data[column])
    numericals=pd.DataFrame()
    if("int64" in data.dtypes.values or "float64" in data.dtypes.values):
        numericals=data.describe(include=["int64","float64"])
    categoricals=pd.DataFrame()
    if(len(kategorijske_kolone)>0):
        categoricals=data.describe(include=["category"])
    irrelevants=pd.DataFrame()
    if(object in data.dtypes.values):
        irrelevants=data.describe(include=[object])
    for column_name in categoricals.columns:
        recnik=dict()
        recnik["ime_kolone"]=column_name
        opis=categoricals[column_name]
        recnik["broj_praznih_polja"]=broj_redova-opis["count"]
        jedinstvene=data[column_name].value_counts()

        if(len(jedinstvene)<=7):
            grafik=dict(jedinstvene.head(7))
        else:
            grafik=dict(jedinstvene.head(6))
            naziv="others("+str(opis["unique"]-len(grafik.keys()))+")"
            broj=broj_redova-sum(grafik.values())
            grafik[naziv]=broj
        #grafik=column_chart
        recnik["broj_jedinstvenih_polja"]=opis["unique"]
        recnik["najcesca_vrednost"]=opis["top"]
        recnik["najveci_broj_ponavljanja"]=opis["freq"]
        recnik["column_chart_data"]=grafik
        analiza["kategoricke_kolone"].append(recnik)
        
    for column_name in irrelevants.columns:
        recnik=dict()
        recnik["ime_kolone"]=column_name
        opis=irrelevants[column_name]
        recnik["broj_praznih_polja"]=broj_redova-opis["count"]
        jedinstvene=data[column_name].value_counts()

        if(len(jedinstvene)<=7):
            grafik=dict(jedinstvene.head(7))
        else:
            grafik=dict(jedinstvene.head(6))
            naziv="others("+str(opis["unique"]-len(grafik.keys()))+")"
            broj=broj_redova-sum(grafik.values())
            grafik[naziv]=broj
        #grafik=column_chart
        recnik["broj_jedinstvenih_polja"]=opis["unique"]
        recnik["najcesca_vrednost"]=opis["top"]
        recnik["najveci_broj_ponavljanja"]=opis["freq"]
        recnik["column_chart_data"]=grafik
        analiza["kategoricke_kolone"].append(recnik)

    for column_name in numericals.columns:
        recnik=dict()
        opis=numericals[column_name]
        recnik["ime_kolone"]=column_name
        recnik["broj_praznih_polja"]=broj_redova-opis["count"]
        
        #ubacivacemo u numerical columns
        s=data[column_name]
        s=pd.cut(s, 10,ordered=True)
        s=s.value_counts()
        novi_indexi=[]
        for i in range(len(s)):
            novi_indexi.append(round(s.index[i].mid,1))
        s.index=novi_indexi
        s.sort_index(inplace=True)
        #grafik=linijski
        recnik["prosek"]=round(opis["mean"],2)
        recnik["standardna_devijacija"]=round(opis["std"],2)
        recnik["minimum"]=opis["min"]
        recnik["prvi_kvartal"]=opis["25%"]
        recnik["drugi_kvartal"]=opis["50%"]
        recnik["treci_kvartal"]=opis["75%"]
        recnik["maximum"]=opis["max"]
        recnik["broj_autlajera"]=sum(np.abs(stats.zscore(data[column_name])) > 3)
        recnik["column_chart_data"]=s.to_dict()
        analiza["numericke_kolone"].append(recnik) 
    return json.dumps(analiza,cls=NpEncoder,indent=4)

def getCorrelationMatrix(data:pd.DataFrame):
    return data.corr().to_json()