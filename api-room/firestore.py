from google.cloud import firestore
import os
import time

db = firestore.Client()


def get_room_by_id(id):
    doc = db.collection(u'rooms').document(id).get()
    if doc.exists:
        return doc.to_dict()
    else:
        return None

def add_room(room_id, host_ip, lecture_name, host_username):
    data = {
        u'host_ip' : host_ip,
        u'room_name' : lecture_name,
        u'host_username' : host_username,
        u'created_at': time.time()
    }
    db.collection(u'rooms').document(room_id).set(data)

def add_to_room(room_id, stu_name):
    doc = db.collection(u'rooms').document(room_id).update({u'students': firestore.ArrayUnion([stu_name])})

def make_gauge_doc(room_id, gauge_time):
    db.collection(u'rooms').document(room_id).collection(u'gauges').document(gauge_time).set({u'students': []})

def save_gauge(stu_name, reactions, room_id, gauge_time):
    student = {"stu_name": stu_name,
        "reactions": reactions
    }
    doc = db.collection(u'rooms').document(room_id).collection(u'gauges').document(gauge_time).update({u'students': firestore.ArrayUnion([student])})

def get_gauge(room_id, gauge_time):
    students = db.collection(u'rooms').document(room_id).collection(u'gauges').document(gauge_time).get().to_dict()
    return students
