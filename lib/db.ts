import path from "node:path";
import { DatabaseSync } from "node:sqlite";

let db: DatabaseSync | null = null;

export const database = () => {
  if (!db) {
    const dbPath = path.join(process.cwd(), "vecnost.db");
    db = new DatabaseSync(dbPath, { readOnly: true, open: true });
  }
  return db;
};
