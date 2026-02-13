CREATE TABLE IF NOT EXISTS `config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `logs` (
	`timestamp` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`message` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `records` (
	`timestamp` integer PRIMARY KEY NOT NULL,
	`temperature` real,
	`humidity` real,
	`light` integer NOT NULL,
	`fan` integer NOT NULL,
	`humidifier` integer NOT NULL,
	`ventilator` integer NOT NULL
);
