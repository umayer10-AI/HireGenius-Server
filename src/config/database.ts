import { MongoClient, Db, Collection, Document } from "mongodb";
import { env } from "./env";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  client = new MongoClient(env.MONGODB_URI, {
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 10000,
  });

  await client.connect();
  db = client.db(env.MONGODB_DB_NAME);
  await ensureIndexes(db);
  console.log(`MongoDB connected: ${env.MONGODB_DB_NAME}`);
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not initialized. Call connectDatabase() first.");
  }
  return db;
}

export function getClient(): MongoClient {
  if (!client) {
    throw new Error("MongoDB client not initialized.");
  }
  return client;
}

export function getCollection<T extends Document>(name: string): Collection<T> {
  return getDb().collection<T>(name);
}

export async function disconnectDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

async function ensureIndexes(database: Db): Promise<void> {
  await Promise.all([
    database.collection("users").createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { role: 1 } },
      { key: { createdAt: -1 } },
    ]),
    database.collection("companies").createIndexes([
      { key: { companyName: 1 } },
      { key: { ownerId: 1 } },
      { key: { industry: 1 } },
      { key: { location: 1 } },
    ]),
    database.collection("jobs").createIndexes([
      { key: { title: "text", shortDescription: "text", skills: "text" } },
      { key: { companyId: 1 } },
      { key: { category: 1 } },
      { key: { salary: 1 } },
      { key: { location: 1 } },
      { key: { skills: 1 } },
      { key: { applicationDeadline: 1 } },
      { key: { status: 1 } },
      { key: { featured: 1 } },
      { key: { slug: 1 }, unique: true },
      { key: { createdAt: -1 } },
    ]),
    database.collection("applications").createIndexes([
      { key: { jobId: 1, candidateId: 1 }, unique: true },
      { key: { jobId: 1 } },
      { key: { candidateId: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } },
    ]),
    database.collection("savedJobs").createIndexes([
      { key: { userId: 1, jobId: 1 }, unique: true },
      { key: { userId: 1 } },
    ]),
    database.collection("reviews").createIndexes([
      { key: { companyId: 1 } },
      { key: { userId: 1, companyId: 1 }, unique: true },
    ]),
    database.collection("blogs").createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { tags: 1 } },
      { key: { published: 1 } },
      { key: { createdAt: -1 } },
    ]),
    database.collection("notifications").createIndexes([
      { key: { receiverId: 1, isRead: 1 } },
      { key: { createdAt: -1 } },
    ]),
    database.collection("aiChats").createIndexes([
      { key: { userId: 1 } },
      { key: { updatedAt: -1 } },
    ]),
    database.collection("resumeGenerations").createIndexes([
      { key: { userId: 1 } },
      { key: { createdAt: -1 } },
    ]),
  ]);
}
