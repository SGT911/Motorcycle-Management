from mysql.connector import connect
from utils.config import DATA as ENV

DB = None


def get_db():
	global DB

	if DB is None:
		DB = connect(**ENV['database'])

	return DB


class CursorHandler:
	def __init__(self, connection):
		self.create_cursor = connection.cursor
		self.cursor = None
	
	def __enter__(self):
		self.cursor = self.create_cursor(buffered=True)

		return self.cursor
	
	def __exit__(self, *args):
		self.cursor.close()
