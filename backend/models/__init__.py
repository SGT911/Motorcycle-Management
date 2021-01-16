from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from typing import List, Union


@dataclass
class User:
	user_id: int
	user_name: str
	password: str
	creation_date: datetime

	@staticmethod
	def parse_from_db(user_id, user_name, password, creation_date) -> User:
		return User(user_id, user_name, password, creation_date)


@dataclass
class Resource:
	resource_id: int
	resource_date: datetime
	users: List[Union[str, User]]
	user_count: int

	@staticmethod
	def parse_from_db(resource_id, resource_date, users, user_count) -> Resource:
		if users is None:
			users = list()
		else:
			users = users.split(',')

		return Resource(resource_id, resource_date, users, user_count)
