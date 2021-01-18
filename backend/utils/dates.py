from datetime import date, time, datetime, timedelta

ONE_DAY = timedelta(days=1)


def to_datetime(source_date: date, source_time: time) -> datetime:
	if (source_time.minute % 30) != 0:
		raise ValueError('source_time.minute must be 30 or 00')

	return datetime(
		year=resource_date.year,
		month=resource_date.month,
		day=resource_date.day,
		hour=source_time.hour,
		minute=source_time.minute,
	)


def parse_date(sorce_date: str) -> date:
	year, month, day = tuple(map(int, sorce_date.split('-')))

	return date(year=year, month=month, day=day)
