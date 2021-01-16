from controllers import get_db, CursorHandler
from models import Resource
from typing import List


def get_all() -> List[Resource]:
	with CursorHandler(get_db()) as cur:
		cur.execute("""
			SELECT
			id AS resource_id,
			resource_date,
			users,
			user_count
			FROM resources_details
		""")

		return [Resource.parse_from_db(*resource) for resource in cur.fetchall()]