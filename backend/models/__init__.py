from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from typing import List, Union

class DecodableModel:
	def to_json(self) -> dict:
		return self.__dict__

@dataclass
class User(DecodableModel):
	user_id: int
	user_name: str
	password: str
	creation_date: datetime

	def to_json(self) -> dict:
		return dict(
			user_id=self.user_id,
			user_name=self.user_name,
			creation_date=self.creation_date.isoformat(),
		)

	@staticmethod
	def parse_from_db(user_id, user_name, password, creation_date) -> User:
		return User(user_id, user_name, password, creation_date)


@dataclass
class Resource(DecodableModel):
	resource_id: int
	resource_date: datetime
	users: List[Union[str, User]]
	user_count: int

	def to_json(self) -> dict:
		return dict(
			resource_id=self.resource_id,
			resource_date=self.resource_date.isoformat()[:16],
			users=self.users,
		)

	@staticmethod
	def parse_from_db(resource_id, resource_date, users, user_count) -> Resource:
		if users is None:
			users = list()
		else:
			users = users.split(',')

		return Resource(resource_id, resource_date, users, user_count)
