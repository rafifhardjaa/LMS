import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./storage-schema";

const client = postgres(process.env.STORAGE_DATABASE_URL!);

export const storageDb = drizzle(client, { schema });