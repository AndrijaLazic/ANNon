import tensorflow as tf
import uuid
import io,os


def save_model(model):
    filename = os.path.join("modeli",str(uuid.uuid4()))
    os.makedirs(filename)
    model.save(filename)
    return filename

