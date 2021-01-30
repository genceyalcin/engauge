from google.cloud import firestore
import os

db = firestore.Client()

def get_room_by_id(id):
    doc = db.collection(u'rooms').document(id).get()
    if doc.exists:
        return doc.to_dict()
    else:
        return None

def add_room(room_id, host_ip, lecture_name, host_name):
    data = {
        u'host_ip' : host_ip,
        u'room_name' : lecture_name,
        u'host_name' : host_name
    }
    db.collection(u'rooms').document(room_id).set(data)