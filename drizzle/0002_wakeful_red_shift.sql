CREATE TABLE `blow` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`channelId` text NOT NULL,
	`remindAt` integer NOT NULL,
	`isEnd` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `blowDoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blowId` integer NOT NULL,
	`userId` text NOT NULL
);
