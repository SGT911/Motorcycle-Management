from utils.api import ApiBlueprint
from utils.ws import SocketResponse, socket_store, handle_actions
from utils.config import DATA as ENV
from utils.dates import parse_date, parse_time
from validators.resources import validate_schema
from validators import validate_date
from json import dumps as json_dump
from errors import ValidationError, NotFound, InternalError
import controllers.resources
import controllers.users

router = ApiBlueprint('ws.resources', __name__)


@router.route('/<string:resource_date>')
@socket_store('handle_resource_socket', filter_route=True)
def handle_resource_socket(socket, socket_store, resource_date: str):
	def attach_resource(payload):
		error = validate_schema(payload)
		if error is not None:
			return socket.send(json_dump(SocketResponse(
				action='error',
				error=error,
			)))

		user = controllers.users.get_one(payload['user_name'])
		if user is None:
			return socket.send(json_dump(SocketResponse(
				action='error',
				error=NotFound(f'The user name "{payload["user_name"]}" was not found'),
			)))
		
		resource_id = controllers.resources.create(
			resource_date=parse_date(resource_date),
			resource_time=parse_time(payload['time']),
		)

		resource_time = parse_time(payload['time'])
		if (resource_time.minute % ENV['config']['time_resolution']) != 0:
			raise ValueError('source_time.minute must be divisible by 30')

		signed_up_users = controllers.resources.get_by_date(
			resource_date=parse_date(resource_date),
			resource_time=resource_time,
		).users

		if len(signed_up_users) >= ENV['config']['available_resources']:
			return socket.send(json_dump(SocketResponse(
				action='error',
				error=InternalError(f'The resource is already full'),
			)))
		elif payload['user_name'] in signed_up_users:
			return socket.send(json_dump(SocketResponse(
				action='error',
				error=InternalError(f'The user "{payload["user_name"]}" already use this resource'),
			)))

		resource = controllers.resources.attach_user(
			resource=resource_id,
			user=user,
		)

		return socket_store.send(json_dump(SocketResponse(
			action='add_user',
			payload=dict(**payload)
		)))
	
	def detach_resource(payload):
		error = validate_schema(payload)
		if error is not None:
			return socket.send(json_dump(SocketResponse(
				action='error',
				error=error,
			)))

		user = controllers.users.get_one(payload['user_name'])
		if user is None:
			return socket.send(json_dump(SocketResponse(
				action='error',
				error=NotFound(f'The user name "{payload["user_name"]}" was not found'),
			)))

		resource = controllers.resources.get_by_date(
			resource_date=parse_date(resource_date),
			resource_time=parse_time(payload['time']),
		)

		if resource is None:
			return socket.send(json_dump(SocketResponse(
				action='error',
				error=NotFound(f'The resource was not found'),
			)))
		
		if payload['user_name'] not in resource.users:
			return socket.send(json_dump(SocketResponse(
				action='error',
				error=InternalError(f'The user "{payload["user_name"]}" is not using this resource'),
			)))

		resource = controllers.resources.detach_user(
			resource=resource.resource_id,
			user=user,
		)

		if resource.user_count == 0:
			controllers.resources.delete(resource.resource_id)

		return socket_store.send(json_dump(SocketResponse(
			action='remove_user',
			payload=dict(**payload)
		)))
	
	if not validate_date(resource_date):
		socket.send(json_dump(SocketResponse(
			action='error',
			error=ValidationError('The date is not valid.'),
		)))

		return socket.close()

	while not socket.closed:
		handle_actions(
			socket,
			on_attach_resource=attach_resource,
			on_detach_resource=detach_resource,
		)
