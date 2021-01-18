from flask import jsonify
from utils.api import ApiBlueprint, APIResponse
from utils.dates import parse_date
from typing import Tuple

from errors import ValidationError
from controllers import resources as controller
from validators import validate_date

router = ApiBlueprint('api.resources', __name__)


@router.route('/', methods=['GET'])
def get_all() -> Tuple[str, int]:
	return jsonify(APIResponse(
		payload=controller.get_all(),
	)), 200


@router.route('/<string:search_date>', methods=['GET'])
def get_range_date(search_date: str) -> Tuple[str, int]:
	if not validate_date(search_date):
		return jsonify(APIResponse(
			error=ValidationError('The date is not valid.'),
		)), 400
	
	try:
		search_date = parse_date(search_date)
	except ValueError:
		return jsonify(APIResponse(
			error=ValidationError('The date is not valid.'),
		)), 400
	else:
		return jsonify(APIResponse(
			payload=controller.get_date_range(search_date),
		)), 200
