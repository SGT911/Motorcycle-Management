import jsonschema
import jsonschema.exceptions
import re
from utils.dates import parse_date
from errors import ValidationError
from typing import Any, Optional

def validate(instance: Any, schema: Any) -> Optional[Exception]:
	try:
		jsonschema.validate(instance, schema)
	except jsonschema.exceptions.ValidationError as error:
		return ValidationError(dict(
			message=error.message,
			context=dict(
				path='.'.join(error.relative_schema_path),
				instance=error.instance,
				validation=error.validator_value,
			),
		))
	
	return None

def validate_socket_message(instance: Any) -> Optional[Exception]:
	schema = {
		'type': 'object',
		'required': [
			'action',
		],
		'additionalProperties': False,
		'properties': {
			'action': {
				'type': 'string',
			},
			'payload': {},
		}
	}

	return validate(instance, schema)

def validate_date(str_date: str) -> bool:
	regexp = re.compile(r'\d{4}-\d{2}-\d{2}')

	if regexp.fullmatch(str_date) is not None:
		try:
			parse_date(str_date)
		except ValueError:
			return False
		else:
			return True
	return False