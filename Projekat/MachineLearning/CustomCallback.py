import requests
import tensorflow as tf
from tensorflow.python.platform import tf_logging as logging
import numpy as np
import json


class CustomCallback(tf.keras.callbacks.RemoteMonitor):
    def __init__(self,root,path,send_as_json,to_send) -> None:
        super().__init__(root=root,path=path,send_as_json=send_as_json)
        self.to_send=to_send

    def on_epoch_end(self, epoch, logs=None):
        if requests is None:
            raise ImportError('RemoteMonitor requires the `requests` library.')
        logs = logs or {}
        send = {}
        send['epoch'] = epoch
        send["to_send"]=self.to_send
        for k, v in logs.items():
            # np.ndarray and np.generic are not scalar types
            # therefore we must unwrap their scalar values and
            # pass to the json-serializable dict 'send'
            if isinstance(v, (np.ndarray, np.generic)):
                send[k] = v.item()
            else:
                send[k] = v
        try:
            if self.send_as_json:
                r=requests.post(self.root + self.path, json=send, headers=self.headers)

            else:
                r=requests.post(
                    self.root + self.path, {self.field: json.dumps(send)},
                    headers=self.headers)
                print(r.status_code)
        except:
            print("doslo je do greske prilikom post metode")


