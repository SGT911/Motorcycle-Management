from utils.api import ApiBlueprint

router = ApiBlueprint('ws.resources', __name__)

@router.route('/echo')
def test(socket):
	while not socket.closed:
		message = socket.receive()
		socket.send(message)