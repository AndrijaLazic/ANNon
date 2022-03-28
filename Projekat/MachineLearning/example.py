import tensorflow as tf
from fastapi_websocket_rpc import WebSocketRpcClient,RpcMethodsBase,RpcUtilityMethods
import keras
from CustomCallback import CustomCallback

def fja(id):

    mnist = tf.keras.datasets.mnist

    (x_train, y_train), (x_test, y_test) = mnist.load_data()
    x_train, x_test = x_train / 255.0, x_test / 255.0

    model = tf.keras.models.Sequential([
      tf.keras.layers.Flatten(input_shape=(28, 28)),
      tf.keras.layers.Dense(128, activation='relu'),
      tf.keras.layers.Dropout(0.2),
      tf.keras.layers.Dense(10)
    ])

    predictions = model(x_train[:1]).numpy()
    tf.nn.softmax(predictions).numpy()
    loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
    loss_fn(y_train[:1], predictions).numpy()

    model.compile(optimizer='adam',
                  loss=loss_fn,
                  metrics=['accuracy'])
    model.fit(x_train,y_train,epochs=2,batch_size=300,callbacks=[CustomCallback(root="http://localhost:8000",path="/publish/epoch/end",send_as_json=True,to_send=id)])
    return 0
