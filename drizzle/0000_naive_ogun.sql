CREATE TABLE IF NOT EXISTS `answerOption` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quizId` integer NOT NULL,
	`answer` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `quiz` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`channelId` text NOT NULL,
	`question` text NOT NULL,
	`someAnswer` integer DEFAULT 0,
	`remindAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `registeredAnswers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quizId` integer NOT NULL,
	`answerId` integer NOT NULL,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL
);
