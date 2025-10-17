import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Опрос
export const quiz = sqliteTable("quiz", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    channelId: text("channelId").notNull(),
    question: text("question").notNull(),
    someAnswer: integer("someAnswer").default(0),
    remindAt: integer("remindAt").notNull(),
    done: integer("done").notNull().default(0)
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
    createdAt: integer("createdAt").notNull()
});
