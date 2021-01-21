from datetime import date, time, datetime, timedelta

ONE_DAY = timedelta(days=1)


def to_datetime(source_date: date, source_time: time) -> datetime:
	return datetime.combine(source_date, source_time)


def parse_date(source_date: str) -> date:
	year, month, day = tuple(map(int, source_date.split('-')))

	return date(year=year, month=month, day=day)


def parse_time(source_time: str) -> time:
	hour, minute = tuple(map(int, source_time.split(':')))

	return time(hour=hour, minute=minute, second=0)
