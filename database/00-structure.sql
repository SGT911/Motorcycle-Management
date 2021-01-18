---------------
-- Structure --
---------------

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_name VARCHAR(16) NOT NULL UNIQUE,
	password VARCHAR(32) NOT NULL,
	creation_date DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE resources (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	resource_date DATETIME NOT NULL UNIQUE
);

CREATE TABLE used_resources (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	resource INT NOT NULL,
	user INT NOT NULL
);

ALTER TABLE used_resources ADD
	FOREIGN KEY (resource) REFERENCES resources(id);

ALTER TABLE used_resources ADD
	FOREIGN KEY (user) REFERENCES users(id);