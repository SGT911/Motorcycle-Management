from utils.api import ApiBlueprint
from utils.ws import SocketResponse, socket_store, handle_actions
from json import dumps as json_dump

router = ApiBlueprint('ws.resources', __name__)

@router.route('/<string:resource_date>')
@socket_store('handle_resource_socket', filter_route=True)
def handle_resource_socket(socket, socket_store, resource_date: str):
	def on_echo(message):
		socket.send(json_dump(SocketResponse(
			action='echo',
			payload=message,
		)))

	while not socket.closed:
		handle_actions(
			socket,
			on_echo=on_echo,
		)