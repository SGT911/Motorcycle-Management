import jsonschema
import jsonschema.exceptions
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