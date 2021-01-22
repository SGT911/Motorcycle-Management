#!/bin/sh
cd $(dirname $0)

source ./venv/bin/activate
gunicorn -k flask_sockets.worker -w 1 -b unix:/tmp/motorcycle_management.sock wsgi:app
deactivate