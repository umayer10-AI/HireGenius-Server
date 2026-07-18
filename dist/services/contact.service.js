"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = exports.ContactService = void 0;
const database_1 = require("../config/database");
const constants_1 = require("../constants");
const errors_1 = require("../utils/errors");
class ContactService {
    async submitContact(input) {
        const now = new Date();
        const collection = (0, database_1.getCollection)(constants_1.COLLECTIONS.CONTACT_MESSAGES);
        await collection.insertOne({
            ...input,
            createdAt: now,
            updatedAt: now,
        });
        return { received: true };
    }
    async subscribeNewsletter(email) {
        const collection = (0, database_1.getCollection)(constants_1.COLLECTIONS.NEWSLETTER);
        const existing = await collection.findOne({ email: email.toLowerCase() });
        if (existing)
            throw new errors_1.ConflictError("Email already subscribed");
        const now = new Date();
        await collection.insertOne({
            email: email.toLowerCase(),
            createdAt: now,
            updatedAt: now,
        });
        return { subscribed: true };
    }
}
exports.ContactService = ContactService;
exports.contactService = new ContactService();
//# sourceMappingURL=contact.service.js.map