"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.getDb = getDb;
exports.getClient = getClient;
exports.getCollection = getCollection;
exports.disconnectDatabase = disconnectDatabase;
const mongodb_1 = require("mongodb");
const env_1 = require("./env");
let client = null;
let db = null;
async function connectDatabase() {
    if (db) {
        return db;
    }
    client = new mongodb_1.MongoClient(env_1.env.MONGODB_URI, {
        maxPoolSize: 20,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 10000,
    });
    await client.connect();
    db = client.db(env_1.env.MONGODB_DB_NAME);
    await ensureIndexes(db);
    console.log(`MongoDB connected: ${env_1.env.MONGODB_DB_NAME}`);
    return db;
}
function getDb() {
    if (!db) {
        throw new Error("Database not initialized. Call connectDatabase() first.");
    }
    return db;
}
function getClient() {
    if (!client) {
        throw new Error("MongoDB client not initialized.");
    }
    return client;
}
function getCollection(name) {
    return getDb().collection(name);
}
async function disconnectDatabase() {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}
async function ensureIndexes(database) {
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
//# sourceMappingURL=database.js.map