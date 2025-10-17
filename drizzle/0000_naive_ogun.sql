CREATE TABLE `answerOption` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quizId` integer NOT NULL,
	`answer` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quiz` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`channelId` text NOT NULL,
	`question` text NOT NULL,
	`someAnswer` integer DEFAULT 0,
	`remindAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `registeredAnswers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quizId` integer NOT NULL,
	`answerId` integer NOT NULL,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL
);
