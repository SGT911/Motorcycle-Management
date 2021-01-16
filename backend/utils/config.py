from os import getcwd
from os.path import join
import toml

APP_FOLDER = join(getcwd(), '..')

with open(join(APP_FOLDER, 'config', 'default.toml'), 'r') as file:
	DATA = toml.loads(file.read())
