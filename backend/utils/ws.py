from typing import Callable, Union, Any, Optional
from functools import wraps
from json import dumps as json_dump, loads as json_load
from json.decoder import JSONDecodeError
from utils.api import APIResponse, APIError
from errors import DecodingError, NotFound
from validators import validate_socket_message

SOCKET_STORE = dict()


class SocketResponse(APIResponse):
	def __init__(self, action: str, payload: Any = None, error: Optional[Union[Exception, APIError]] = None):
		super(SocketResponse, self).__init__(payload, error)
		if 'error' in self:
			self['payload'] = self['error']
			del self['error']

		self['action'] = action


class SocketStoreHandler(set):
	def send(self, message: Union[str, bytes, dict]):
		if isinstance(message, str):
			send_message = message
		elif isinstance(message, bytes):
			send_message = message.decode()
		else:
			send_message = json_dump(message)

		for socket in iter(self):
			socket.send(send_message)

	def __repr__(self):
		return 'SocketStoreHandler(%s)' % (super(SocketStoreHandler, self).__repr__(), )


def socket_store(store_name: str, filter_route: bool = False) -> Callable:
	def decorator_handler(func: Callable) -> Callable:
		@wraps(func)
		def wrapper(socket, **kwargs):
			if filter_route:
				store_key = '%s.%s' % (store_name, '.'.join(map(str, kwargs.values())))
			else:
				store_key = store_name

			if store_key not in SOCKET_STORE:
				SOCKET_STORE[store_key] = SocketStoreHandler()
			
			SOCKET_STORE[store_key].add(socket)
			data = func(socket, SOCKET_STORE[store_key], **kwargs)
			SOCKET_STORE[store_key].remove(socket)

			if len(SOCKET_STORE[store_key]) == 0:
				del SOCKET_STORE[store_key]
		
		return wrapper
	
	return decorator_handler

def handle_actions(socket, **actions):
	try:
		message = socket.receive()
		if message is None:
			return None

		message = json_load(message)
	except JSONDecodeError as error:
		return socket.send(json_dump(SocketResponse(
			action='error',
			error=DecodingError(error.args[0]),
		)))
	
	error = validate_socket_message(message)
	if error is not None:
		return socket.send(json_dump(SocketResponse(
			action='error',
			error=error,
		)))
	
	action, payload = message['action'], message['payload']
	
	if action in actions or f'on_{action}' in actions:
		action_handler = actions.get(action, None) or actions.get(f'on_{action}')

		return action_handler(payload)
	else:
		return socket.send(json_dump(SocketResponse(
			action='error',
			error=NotFound(f'The action "{action}" was not found'),
		)))
