---------------
-- Structure --
---------------

CREATE TABLE user (
	id INT NOT NULL PRIMARY KEY,
	user_name VARCHAR(16) NOT NULL,
	creation_date DATETIME NOT NULL DEFAULT NOW()
);