import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "dist/drizzle",
    schema: "dist/db/schema.js",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.DB_FILE_NAME!
    }
});
