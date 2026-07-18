import { ObjectId, type Document, type Filter, type FindOptions, type UpdateFilter } from "mongodb";
export declare class BaseRepository<T extends Document> {
    protected readonly collectionName: string;
    constructor(collectionName: string);
    protected get collection(): import("mongodb").Collection<T>;
    findById(id: string | ObjectId): Promise<T | null>;
    findByIdOrThrow(id: string | ObjectId, message?: string): Promise<T>;
    findOne(filter: Filter<T>): Promise<T | null>;
    findMany(filter?: Filter<T>, options?: FindOptions): Promise<T[]>;
    count(filter?: Filter<T>): Promise<number>;
    insertOne(doc: T): Promise<T>;
    updateById(id: string | ObjectId, update: UpdateFilter<T>, message?: string): Promise<T>;
    deleteById(id: string | ObjectId, message?: string): Promise<boolean>;
    paginate(filter: Filter<T>, page: number, limit: number, sort?: Record<string, 1 | -1>): Promise<{
        data: T[];
        total: number;
    }>;
}
export declare function toObjectId(id: string): ObjectId;
//# sourceMappingURL=base.repository.d.ts.map