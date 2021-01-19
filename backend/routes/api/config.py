from flask import jsonify
from utils.api import ApiBlueprint, APIResponse
from typing import Tuple
from utils.config import DATA as ENV

router = ApiBlueprint('api.config', __name__)

@router.route('/', methods=['GET'])
def get_all() -> Tuple[str, int]:
	return jsonify(APIResponse(payload=ENV['config'])), 200