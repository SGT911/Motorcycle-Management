---------------
-- Structure --
---------------

CREATE TABLE user (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_name VARCHAR(16) NOT NULL UNIQUE,
	password VARCHAR(32) NOT NULL,
	creation_date DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE resources (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	resource_date DATETIME NOT NULL
);

CREATE TABLE used_resources (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	resource INT NOT NULL,
	user INT NOT NULL,

	FOREIGN KEY (resource) REFERENCES resources(id),
	FOREIGN KEY (user) REFERENCES users(id)
);