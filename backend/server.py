# -*- coding: utf-8 -*-
# -*- author: sgt911 -*-

from flask import Flask
from flask_cors import CORS
from flask_sockets import Sockets

from routes.api.users import router as user_router
from routes.api.resources import router as resource_router
from routes.ws.resources import router as resource_ws_router

app = Flask(__name__)
socket = Sockets(app)
cors = CORS(app, resources={ r'/*': { 'origin': r'*' } })

# Routing
app.register_blueprint(user_router, url_prefix='/api/users')
app.register_blueprint(resource_router, url_prefix='/api/resources')
socket.register_blueprint(resource_ws_router, url_prefix='/ws/resources')

if __name__ == '__main__':
	from gevent import pywsgi
	from geventwebsocket.handler import WebSocketHandler

	server = pywsgi.WSGIServer(('127.0.0.1', 5000), app, handler_class=WebSocketHandler)
	server.serve_forever()
