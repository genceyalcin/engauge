from flask import Flask, jsonify, redirect, url_for, request
import uuid
import os

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './api-room/secret/gcloud.json'

import firestore
import faces

app = Flask(__name__)


#create a room
@app.route('/room', methods=['POST'])
def createRoom():
    if 'X-Forwarded-For' in request.headers:
        host_ip = request.headers['X-Forwarded-For'].split(',')[0] # first addr in list is client IP
    else:
        host_ip = request.remote_addr
    
    room_id = str(uuid.uuid4())
    room_name = request.args.get("room_name")
    host_name = request.args.get("host_name")
    firestore.add_room(room_id, host_ip, room_name, host_name)
    return room_id

#join a room
@app.route('/room', methods=['GET'])
def joinRoom():
    room_id = request.args.get("id")
    #get host and forward this request
    foundRoom = firestore.get_room_by_id(room_id)
    if foundRoom is not None:
        return foundRoom, 200, {'Content-Type': 'application/json'}
    else:
        return "No Room with specified ID", 404

if __name__ == "__main__":
    app.run(host="0.0.0.0")