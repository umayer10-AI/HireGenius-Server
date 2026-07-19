import {
  ObjectId,
  type Document,
  type Filter,
  type FindOptions,
  type UpdateFilter,
  type WithId,
} from "mongodb";
import { getCollection } from "../config/database.js";
import { NotFoundError } from "../utils/errors.js";

export class BaseRepository<T extends Document> {
  constructor(protected readonly collectionName: string) {}

  protected get collection() {
    return getCollection<T>(this.collectionName);
  }

  async findById(id: string | ObjectId): Promise<T | null> {
    if (!ObjectId.isValid(id)) return null;
    const doc = await this.collection.findOne({ _id: new ObjectId(id) } as Filter<T>);
    return (doc as T | null) ?? null;
  }

  async findByIdOrThrow(id: string | ObjectId, message = "Resource not found"): Promise<T> {
    const doc = await this.findById(id);
    if (!doc) throw new NotFoundError(message);
    return doc;
  }

  async findOne(filter: Filter<T>): Promise<T | null> {
    const doc = await this.collection.findOne(filter);
    return (doc as T | null) ?? null;
  }

  async findMany(filter: Filter<T> = {}, options: FindOptions = {}): Promise<T[]> {
    const docs = await this.collection.find(filter, options).toArray();
    return docs as T[];
  }

  async count(filter: Filter<T> = {}): Promise<number> {
    return this.collection.countDocuments(filter);
  }

  async insertOne(doc: T): Promise<T> {
    const result = await this.collection.insertOne(doc as never);
    return { ...doc, _id: result.insertedId } as T;
  }

  async updateById(
    id: string | ObjectId,
    update: UpdateFilter<T>,
    message = "Resource not found"
  ): Promise<T> {
    if (!ObjectId.isValid(id)) throw new NotFoundError(message);
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as Filter<T>,
      update,
      { returnDocument: "after" }
    );
    if (!result) throw new NotFoundError(message);
    return result as WithId<T> as T;
  }

  async deleteById(id: string | ObjectId, message = "Resource not found"): Promise<boolean> {
    if (!ObjectId.isValid(id)) throw new NotFoundError(message);
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) } as Filter<T>);
    if (result.deletedCount === 0) throw new NotFoundError(message);
    return true;
  }

  async paginate(
    filter: Filter<T>,
    page: number,
    limit: number,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: T[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
      this.collection.countDocuments(filter),
    ]);
    return { data: data as T[], total };
  }
}

export function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new NotFoundError("Invalid ID");
  }
  return new ObjectId(id);
}
