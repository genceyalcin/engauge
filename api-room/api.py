from flask import Flask, jsonify, redirect, url_for, request
import uuid
import os
import time
from werkzeug.utils import secure_filename

if os.environ.get('GOOGLE_APPLICATION_CREDENTIALS') is None:
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './secret/gcloud.json'

import firestore
import faces

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#get ip
@app.route('/get-ip', methods=['GET'])
def getMyIP():
    if 'X-Forwarded-For' in request.headers:
        host_ip = request.headers['X-Forwarded-For'].split(',')[0] # first addr in list is client IP
    else:
        host_ip = request.remote_addr
    return {"ip": host_ip}

#create a room
@app.route('/room', methods=['POST'])
def createRoom():
    if 'X-Forwarded-For' in request.headers:
        host_ip = request.headers['X-Forwarded-For'].split(',')[0] # first addr in list is client IP
    else:
        host_ip = request.remote_addr
    room_id = str(uuid.uuid4())
    room_name = request.args.get("room_name")
    host_username = request.args.get("host_username")
    firestore.add_room(room_id, host_ip, room_name, host_username)
    return room_id

#get a room
@app.route('/room', methods=['GET'])
def getRoom():
    room_id = request.args.get("room_id")
    #get host
    foundRoom = firestore.get_room_by_id(room_id)
    if foundRoom is not None:
        return foundRoom, 200, {'Content-Type': 'application/json'}
    else:
        return "No Room with specified ID", 404

#join a room
@app.route('/room', methods=['PUT'])
def joinRoom():
    room_id = request.args.get("room_id")
    #get host
    foundRoom = firestore.get_room_by_id(room_id)
    if foundRoom is not None:
        stu_name = request.args.get("stu_name")
        #add stu to room obj
        firestore.add_to_room(room_id, stu_name)
        return foundRoom, 200, {'Content-Type': 'application/json'}
    else:
        return "No room with specified ID", 404

@app.route('/gauge', methods=['POST'])
def gen_gauge():
    gauge_time = str(time.time())
    room_id = request.args.get("room_id")
    full_gauge_dir = os.path.join("/tmp", os.path.join(room_id, gauge_time))
    os.makedirs(full_gauge_dir)
    firestore.make_gauge_doc(room_id, gauge_time)
    return {"gauge_time": gauge_time}, 200, {'Content-Type': 'application/json'}

@app.route('/gauge', methods=['PUT'])
def collect_gauge():
    room_id = request.args.get("room_id")
    gauge_time = request.args.get("gauge_time")
    stu_name = request.args.get("stu_name")
    full_gauge_dir = os.path.join("/tmp", os.path.join(room_id, gauge_time))
    face = request.files['face']
    if face is not None:
        filename = secure_filename(stu_name)
        face.save(os.path.join(full_gauge_dir, filename))
        firestore.save_gauge(stu_name, faces.detect_faces(os.path.join(full_gauge_dir, filename)), room_id, gauge_time)
        return "Big Brother is Watching", 200
    return "No face picture sent."


if __name__ == "__main__":
    app.run(host="0.0.0.0")