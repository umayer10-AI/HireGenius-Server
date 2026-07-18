"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
exports.toObjectId = toObjectId;
const mongodb_1 = require("mongodb");
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
class BaseRepository {
    collectionName;
    constructor(collectionName) {
        this.collectionName = collectionName;
    }
    get collection() {
        return (0, database_1.getCollection)(this.collectionName);
    }
    async findById(id) {
        if (!mongodb_1.ObjectId.isValid(id))
            return null;
        const doc = await this.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        return doc ?? null;
    }
    async findByIdOrThrow(id, message = "Resource not found") {
        const doc = await this.findById(id);
        if (!doc)
            throw new errors_1.NotFoundError(message);
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
        if (!mongodb_1.ObjectId.isValid(id))
            throw new errors_1.NotFoundError(message);
        const result = await this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, update, { returnDocument: "after" });
        if (!result)
            throw new errors_1.NotFoundError(message);
        return result;
    }
    async deleteById(id, message = "Resource not found") {
        if (!mongodb_1.ObjectId.isValid(id))
            throw new errors_1.NotFoundError(message);
        const result = await this.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0)
            throw new errors_1.NotFoundError(message);
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
exports.BaseRepository = BaseRepository;
function toObjectId(id) {
    if (!mongodb_1.ObjectId.isValid(id)) {
        throw new errors_1.NotFoundError("Invalid ID");
    }
    return new mongodb_1.ObjectId(id);
}
//# sourceMappingURL=base.repository.js.map