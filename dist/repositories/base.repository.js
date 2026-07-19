import { ObjectId, } from "mongodb";
import { getCollection } from "../config/database.js";
import { NotFoundError } from "../utils/errors.js";
export class BaseRepository {
    collectionName;
    constructor(collectionName) {
        this.collectionName = collectionName;
    }
    get collection() {
        return getCollection(this.collectionName);
    }
    async findById(id) {
        if (!ObjectId.isValid(id))
            return null;
        const doc = await this.collection.findOne({ _id: new ObjectId(id) });
        return doc ?? null;
    }
    async findByIdOrThrow(id, message = "Resource not found") {
        const doc = await this.findById(id);
        if (!doc)
            throw new NotFoundError(message);
        return doc;
    }
    async findOne(filter) {
        const doc = await this.collection.findOne(filter);
        return doc ?? null;
    }
    async findMany(filter = {}, options = {}) {
        const docs = await this.collection.find(filter, options).toArray();
        return docs;
    }
    async count(filter = {}) {
        return this.collection.countDocuments(filter);
    }
    async insertOne(doc) {
        const result = await this.collection.insertOne(doc);
        return { ...doc, _id: result.insertedId };
    }
    async updateById(id, update, message = "Resource not found") {
        if (!ObjectId.isValid(id))
            throw new NotFoundError(message);
        const result = await this.collection.findOneAndUpdate({ _id: new ObjectId(id) }, update, { returnDocument: "after" });
        if (!result)
            throw new NotFoundError(message);
        return result;
    }
    async deleteById(id, message = "Resource not found") {
        if (!ObjectId.isValid(id))
            throw new NotFoundError(message);
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0)
            throw new NotFoundError(message);
        return true;
    }
    async paginate(filter, page, limit, sort = { createdAt: -1 }) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
            this.collection.countDocuments(filter),
        ]);
        return { data: data, total };
    }
}
export function toObjectId(id) {
    if (!ObjectId.isValid(id)) {
        throw new NotFoundError("Invalid ID");
    }
    return new ObjectId(id);
}
//# sourceMappingURL=base.repository.js.map