import jsonschema
import jsonschema.exceptions
import re
from errors import ValidationError
from typing import Any, Optional

def validate(instance: Any, schema: Any) -> Optional[Exception]:
	try:
		jsonschema.validate(instance, schema)
	except jsonschema.exceptions.ValidationError as error:
		# TODO: Complete error context
		return ValidationError(dict(
			message=error.message,
		))
	
	return None

def validate_date(str_date: str) -> bool:
	regexp = re.compile(r'\d{4}-\d{2}-\d{2}')

	return regexp.fullmatch(str_date)