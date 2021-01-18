from controllers import get_db, CursorHandler
from models import Resource, User
from typing import List, Optional, Union
from utils.dates import date, time, to_datetime, ONE_DAY


def get_all() -> List[Resource]:
	with CursorHandler(get_db()) as cur:
		cur.execute("""
			SELECT
				id AS resource_id,
				resource_date,
				users,
				user_count
			FROM resources_details
			ORDER BY resource_date DESC
		""")

		return [Resource.parse_from_db(*resource) for resource in cur.fetchall()]
	

def get_date_range(start_date: date) -> List[Resource]:
	finsh_date = start_date + ONE_DAY

	with CursorHandler(get_db()) as cur:
		cur.execute("""
			SELECT
				id AS resource_id,
				resource_date,
				users,
				user_count
			FROM resources_details
				WHERE resource_date >= %s AND resource_date < %s
			ORDER BY resource_date DESC
		""", (start_date, finsh_date))

		return [Resource.parse_from_db(*resource) for resource in cur.fetchall()]


def get_by_date(resource_date: date, resource_time: time) -> Optional[Resource]:
	search_date = to_datetime(resource_date, resource_time)

	with CursorHandler(get_db()) as cur:
		cur.execute("""
			SELECT
				id AS resource_id,
				resource_date,
				users,
				user_count
			FROM resources_details
				WHERE resource_date = %s
				LIMIT 1
		""", (search_date, ))

		if cur.rowcount > 0:
			return Resource.parse_from_db(*cur.fetchone())
		
		return None


def get_by_id(resource_id: int) -> Optional[Resource]:
	with CursorHandler(get_db()) as cur:
		cur.execute("""
			SELECT
				id AS resource_id,
				resource_date,
				users,
				user_count
			FROM resources
				WHERE id = %s
				LIMIT 1
		""", (resource_id, ))

		if cur.rowcount > 0:
			return Resource.parse_from_db(*cur.fetchone())
		
		return None


def exist(resource_id: int) -> bool:
	with CursorHandler(get_db()) as cur:
		cur.execute("""
			SELECT
				COUNT(id) as count
			FROM resources
				WHERE id = %s
		""", (resource_id, ))

		return cur.fetchone()[0] > 0


def create(resource_date: date, resource_time: time) -> int:
	resource = get_by_date(resource_date, resource_time)
	if resource is not None:
		return resource.resource_id

	resource_datetime = to_datetime(resource_date, resource_time)
	
	with CursorHandler(get_db()) as cur:
		try:
			cur.execute("""
				INSERT INTO resources (resource_date)
					VALUES (%s)
			""", (resource_datetime, ))
		except Exception as e:
			get_db().rollback()
			raise e
		else:
			get_db().commit()

			return get_by_date(resource_date, resource_time).resource_id


def attach_user(resource: int, user: Union[User, int]) -> Resource:
	if not exist(resource):
		raise ValueError(f'The resource {resource} does not exist')

	if isinstance(user, User):
		user_id = user.user_id
	else:
		user_id = user

	with CursorHandler(get_db()) as cur:
		try:
			cur.execute("""
				INSERT INTO used_resources (resource, user)
					VALUES (%s, %s)
			""", (resource, user))
		except Exception as e:
			get_db().rollback()
			raise e
		else:
			get_db().commit()

			return get_by_id(resource)
