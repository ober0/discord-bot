import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const quiz = sqliteTable("quiz", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    channelId: text("channelId").notNull(),
    question: text("question").notNull(),
    isPublic: integer("isPublic").notNull().default(0),
    someAnswer: integer("someAnswer").default(0),
    remindAt: integer("remindAt").notNull(),
    isEnd: integer("isEnd").notNull().default(0)
});

export const answerOption = sqliteTable("answerOption", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    quizId: integer("quizId").notNull(),
    answer: text("answer").notNull()
});

export const registeredAnswers = sqliteTable("registeredAnswers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    quizId: integer("quizId").notNull(),
    answerId: integer("answerId").notNull(),
    userId: text("userId").notNull(),
    createdAt: integer("createdAt").notNull()
});
