from validators import validate
from typing import Any, Optional


def validate_schema(instance: Any) -> Optional[Exception]:
	schema = {
		'type': 'object',
		'required': [
			'time',
			'user_name',
		],
		'additionalProperties': False,
		'properties': {
			'time': {
				'type': 'string',
				'pattern': r'^\d{2}:\d{2}$',
			},
			'user_name': {
				'type': 'string',
				'minLength': 6,
				'maxLength': 16,
				'pattern': r'^[A-Z0-9\_\-]+$',
			},
		},
	}

	return validate(schema, instance)