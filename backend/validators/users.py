import re
from validators import validate
from typing import Any, Optional


def check_username(user_name: str) -> bool:
	regexp = re.compile(r'^[A-Z0-9\_\-]{6,16}$')

	return regexp.fullmatch(user_name)


def validate_schema(instance: Any) -> Optional[Exception]:
	schema = {
		'type': 'object',
		'required': [
			'user_name',
			'password',
		],
		'additionalProperties': False,
		'properties': {
			'user_name': {
				'type': 'string',
				'minLength': 6,
				'maxLength': 16,
				'pattern': r'^[A-Z0-9\_\-]+$',
			},
			'password': {
				'type': 'string',
				'minLength': 8,
			},
		},
	}

	return validate(schema, instance)