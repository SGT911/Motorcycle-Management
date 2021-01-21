from __future__ import annotations
from models import DecodableModel
from typing import Any, Union, Optional
from flask import Blueprint, request
from json import loads as json_load
from json.decoder import JSONDecodeError
from errors import InternalError, DecodingError

class ApiBlueprint(Blueprint):
	def route(self, rule, **options):
		def decorator(f: Callable):
			new_rule = rule.rstrip('/')
			new_rule_with_slash = '{}/'.format(new_rule)
			super(ApiBlueprint, self).route(new_rule, **options)(f)
			super(ApiBlueprint, self).route(new_rule_with_slash, **options)(f)
			return f
		return decorator

class APIError(dict):
	def __init__(self, name: str = 'Error', description: Any = None):
		super(APIError, self).__init__(
			name=name,
			description=description,
		)
	
	@staticmethod
	def parse_exception(error: Exception) -> APIError:
		description = None
		if isinstance(error.args, tuple) or isinstance(error.args, list):
			if len(error.args) == 1:
				description = error.args[0]
			elif len(error.args) > 1:
				description = ', '.join(error.args)
		else:
			description = error.args
		
		return APIError(
			name=error.__class__.__name__,
			description=description,
		)


class APIResponse(dict):
	def __init__(self, payload: Any = None, error: Optional[Union[Exception, APIError]] = None):
		data = dict()

		if isinstance(payload, DecodableModel):
			data['payload'] = payload.to_json()
		elif isinstance(payload, (list, tuple, set)) and len(payload) > 0 and isinstance(payload[0], DecodableModel):
			data['payload'] = [data.to_json() for data in payload]
		elif isinstance(payload, dict) and len(payload) > 0 and isinstance(list(payload.values())[0], DecodableModel):
			data['payload'] = {k: v.to_json() for k, v in payload.items()}
		else:
			data['payload'] = payload

		if error is not None:
			if isinstance(error, Exception):
				data['error'] = APIError.parse_exception(error)
			else:
				data['error'] = error

		super(APIResponse, self).__init__(**data)


def parse_request() -> Any:
	content_type = request.headers.get('Content-Type', '').split(';')[0].strip()
	
	if content_type == 'application/json':
		try:
			return json_load(request.data)
		except JSONDecodeError as error:
			raise DecodingError(error.args[0])
	else:
		raise InternalError(f'The content-type "{content_type}" has not handler')