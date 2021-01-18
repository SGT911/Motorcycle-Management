# -*- coding: utf-8 -*-
# -*- author: sgt911 -*-

from flask import Flask
from flask_cors import CORS
from flask_sockets import Sockets

from routes.api.users import router as user_router
from routes.api.resources import router as resource_router

app = Flask(__name__)
socket = Sockets(app)
cors = CORS(app, resources={ r'/*': { 'origin': r'*' } })

# Routing
app.register_blueprint(user_router, url_prefix='/api/users')
app.register_blueprint(resource_router, url_prefix='/api/resources')

if __name__ == '__main__':
	app.debug = True
	app.run()
