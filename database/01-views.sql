-----------
-- Views --
-----------

CREATE VIEW resources_details
	AS SELECT
		res.id,
		res.resource_date,
		GROUP_CONCAT(usr.user_name SEPARATOR ',') AS users,
		COUNT(used_res.id) AS user_count
	FROM resources AS res
		LEFT JOIN used_resources AS used_res
			ON res.id = used_res.resource
		LEFT JOIN users AS usr
			ON used_res.user = usr.id
	GROUP BY res.id, res.resource_date;