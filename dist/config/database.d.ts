import { MongoClient, Db, Collection, Document } from "mongodb";
export declare function connectDatabase(): Promise<Db>;
export declare function getDb(): Db;
export declare function getClient(): MongoClient;
export declare function getCollection<T extends Document>(name: string): Collection<T>;
export declare function disconnectDatabase(): Promise<void>;
//# sourceMappingURL=database.d.ts.map