-----------
-- Views --
-----------

CREATE VIEW resources_details
	AS SELECT
		res.id,
		res.resource_date,
		GROUP_CONCAT(',', usr.user_name) AS users,
		COUNT(used_res.id) AS user_count
	FROM resources AS res
		INNER JOIN used_resources AS used_res
			ON res.id = used_res.resource
		INNER JOIN users AS usr
			ON usr.id = used_res.user
	GROUP BY res.id, res.resource_date;