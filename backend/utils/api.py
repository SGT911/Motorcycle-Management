from __future__ import annotations
from models import DecodableModel
from typing import Any, Union, Optional
from flask import Blueprint, request
from json import loads as json_load
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
		super().__init__(
			name=name,
			description=description,
		)
	
	@staticmethod
	def parse_exception(error: Exception) -> APIError:
		description = None
		if isinstance(error.args, tuple) or isinstance(error.args, list):
			if len(error.args) > 0:
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

		if payload is None:
			data['payload'] = None
		elif isinstance(payload, dict):
			data['payload'] = payload
		elif isinstance(payload, DecodableModel):
			data['payload'] = payload.to_json()
		else:
			data['payload'] = payload.__dict__

		if error is not None:
			if isinstance(error, Exception):
				data['error'] = APIError.parse_exception(error)
			else:
				data['error'] = error

		super().__init__(**data)


def parse_request() -> Any:
	content_type = request.headers.get('Content-Type', '').split(';')[0].strip()
	
	if content_type == 'application/json':
		try:
			return json_load(request.data)
		except Exception as error:
			raise DecodingError(error.args[0])
	else:
		raise InternalError(f'The content-type "{content_type}" has not handler')