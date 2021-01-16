from controllers import get_db, CursorHandler
from utils import hash_password
from models import User
from typing import Optional


def login(user_name: str, password: str) -> Optional[User]:
	password, user_name = hash_password(password), user_name.upper()

	with CursorHandler(get_db()) as cur:
		cur.execute("""
			SELECT
				id AS user_id,
				user_name,
				password,
				creation_date
			FROM users
				WHERE user_name = %s AND password = %s
		""", (user_name, password))

		if cur.rowcount > 0:
			return User.parse_from_db(*cur.fetchone())
		
		return None


def get_one(user_name: str) -> Optional[User]:
	user_name = user_name.upper()

	with CursorHandler(get_db()) as cur:
		cur.execute("""
			SELECT
				id AS user_id,
				user_name,
				password,
				creation_date
			FROM users
				WHERE user_name = %s
		""", (user_name,))

		if cur.rowcount > 0:
			return User.parse_from_db(*cur.fetchone())
		
		return None


def exist(user_name: str) -> bool:
	return get_one(user_name) is not None


def create(user_name: str, password: str) -> User:
	password, user_name = hash_password(password), user_name.upper()

	if exist(user_name):
		raise ValueError(f'The user "{ user_name }" already exist')
	
	with CursorHandler(get_db()) as cur:
		try:
			cur.execute("""
				INSERT INTO users (user_name, password)
					VALUES (%s, %s)
			""", (user_name, password))
		except Exception as e:
			get_db().rollback()
			raise e
		else:
			get_db().commit()

			return get_one(user_name)
