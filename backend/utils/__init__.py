from hashlib import md5


def hash_password(password: str) -> str:
	return md5(password.encode()).hexdigest()