CREATE TABLE IF NOT EXISTS `schedules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`time` text NOT NULL,
	`state` text NOT NULL
);
