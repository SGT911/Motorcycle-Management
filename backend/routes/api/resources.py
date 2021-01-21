from flask import jsonify
from utils.api import ApiBlueprint, APIResponse
from utils.dates import parse_date, to_datetime, date, time, timedelta
from utils.config import DATA as ENV
from functools import reduce
from typing import Tuple, Dict

from errors import ValidationError
from controllers import resources as controller
from models import Resource
from validators import validate_date

router = ApiBlueprint('api.resources', __name__)


@router.route('/<string:search_date>', methods=['GET'])
def get_range_date_chrono(search_date: str) -> Tuple[str, int]:
	if not validate_date(search_date):
		return jsonify(APIResponse(
			error=ValidationError('The date is not valid'),
		)), 400
	
	try:
		search_date = parse_date(search_date)
	except ValueError:
		return jsonify(APIResponse(
			error=ValidationError('The date is not valid'),
		)), 400
	else:
		def reduce_hadler(acc: Dict[str, Resource], el: Resource) -> Dict[str, Resource]:
			key = el.resource_date.time().isoformat()[:5]
			return dict(**{
				key: el
			},
			**acc)

		by_time = reduce(reduce_hadler, controller.get_date_range(search_date), dict())

		idx_time, response = time(8, 0), list()
		while idx_time <= time(20, 0):
			time_key = idx_time.isoformat()[:5]
			if time_key in by_time:
				response.append(by_time[time_key])
			else:
				response.append(Resource(
					resource_id=None,
					resource_date=to_datetime(search_date, idx_time),
					users=[],
					user_count=0
				))
			
			idx_time = (to_datetime(date.today(), idx_time) + timedelta(minutes=ENV['config']['time_resolution'])).time()

		return jsonify(APIResponse(payload=response)), 200