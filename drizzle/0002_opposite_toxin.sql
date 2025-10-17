PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_registeredAnswers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quizId` integer NOT NULL,
	`answerId` integer NOT NULL,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_registeredAnswers`("id", "quizId", "answerId", "userId", "createdAt") SELECT "id", "quizId", "answerId", "userId", "createdAt" FROM `registeredAnswers`;--> statement-breakpoint
DROP TABLE `registeredAnswers`;--> statement-breakpoint
ALTER TABLE `__new_registeredAnswers` RENAME TO `registeredAnswers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;