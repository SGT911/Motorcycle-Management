from flask import jsonify, make_response, redirect, url_for
from utils.api import ApiBlueprint, APIResponse, parse_request
from typing import Tuple

import requests

from errors import ValidationError, NotFound
from controllers import users as controller
from validators.users import check_username, validate_schema

AVATAR_LINK = 'https://ui-avatars.com/api/?background=random&color=random&size=256&format=svg&length=3&rounded=true&name=%s'

router = ApiBlueprint('api.users', __name__)


@router.route('/<string:user_name>', methods=['GET'])
def get_user(user_name: str) -> Tuple[str, int]:
	if not user_name.isupper():
		return redirect(url_for('api.users.get_user', user_name=user_name.upper()))

	if not check_username(user_name):
		return jsonify(APIResponse(
			error=ValidationError(f'The user name "{user_name}" is not valid'),
		)), 400
	
	user = controller.get_one(user_name)
	if user is None:
		return jsonify(APIResponse(
			error=NotFound(f'The user name "{user_name}" was not found'),
		)), 404

	return jsonify(APIResponse(
		payload=user,
	)), 200


@router.route('/<string:user_name>/avatar', methods=['GET'])
def get_avatar(user_name: str) -> Tuple[str, int]:
	if not user_name.isupper():
		return redirect(url_for('api.users.get_avatar', user_name=user_name.upper()))

	if not check_username(user_name):
		return jsonify(APIResponse(
			error=ValidationError(f'The user name "{user_name}" is not valid'),
		)), 400
	
	if not controller.exist(user_name):
		return jsonify(APIResponse(
			error=NotFound(f'The user name "{user_name}" was not found'),
		)), 404
	
	data = requests.get(AVATAR_LINK % (user_name,))

	response = make_response(data.text, 200)
	response.headers['Content-Type'] = 'image/svg+xml'

	return response


@router.route('/', methods=['POST'])
def create() -> Tuple[str, int]:
	data = None
	try:
		data = parse_request()
	except Exception as error:
		return jsonify(APIResponse(error=error)), 400
	else:
		error = validate_schema(data)
		if error is not None:
			return jsonify(APIResponse(error=error)), 400
	
	try:
		user = controller.create(**data)
	except ValueError as error:
		return jsonify(APIResponse(error=error)), 500
	else:
		return jsonify(APIResponse(payload=user)), 201


@router.route('/login', methods=['POST'])
def login() -> Tuple[str, int]:
	data = None
	try:
		data = parse_request()
	except Exception as error:
		return jsonify(APIResponse(error=error)), 400
	else:
		error = validate_schema(data)
		if error is not None:
			return jsonify(APIResponse(error=error)), 400
	
	user = controller.login(**data)
	if user is None:
		return jsonify(APIResponse(
			error=NotFound(f'The user "{data["user_name"]}" was not found or was sent incorrect credentials')),
		), 401
	
	return jsonify(APIResponse(payload=user)), 200
