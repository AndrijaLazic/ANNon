import numpy as np
import pandas as pd
import json
from scipy import stats


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
    kategorijske_kolone=data.select_dtypes(include=["object"]).columns.values

    for column_name in data.columns:
        recnik=dict()
        opis=data[column_name].describe()
        recnik["ime_kolone"]=column_name
        recnik["broj_praznih_polja"]=broj_redova-opis["count"]
        if(column_name in kategorijske_kolone):
            #ubacivacemo u categorical columns
            grafik=dict(data[column_name].value_counts().head(6))
            if(len(grafik.keys())>4):
                #dodaje se others kolona
                naziv="others("+str(opis["unique"]-len(grafik.keys()))+")"
                broj=broj_redova-sum(grafik.values())
                grafik[naziv]=broj
            #grafik=column_chart
            recnik["broj_jedinstvenih_polja"]=opis["unique"]
            recnik["najcesca_vrednost"]=opis["top"]
            recnik["najveci_broj_ponavljanja"]=opis["freq"]
            recnik["column_chart_data"]=grafik
            analiza["kategoricke_kolone"].append(recnik)
            
        else:
            #ubacivacemo u numerical columns
            s=data[column_name]
            s=pd.cut(s, 7,ordered=True).astype(str)
            #grafik=histogram
            recnik["prosek"]=opis["mean"]
            recnik["standardna_devijacija"]=opis["std"]
            recnik["minimum"]=opis["min"]
            recnik["prvi_kvartal"]=opis["25%"]
            recnik["drugi_kvartal"]=opis["50%"]
            recnik["treci_kvartal"]=opis["75%"]
            recnik["maximum"]=opis["max"]
            recnik["broj_autlajera"]=sum(np.abs(stats.zscore(data[column_name])) > 3)
            recnik["column_chart_data"]=dict(s.value_counts())
            analiza["numericke_kolone"].append(recnik) 

    return json.dumps(analiza,cls=NpEncoder,indent=4)

