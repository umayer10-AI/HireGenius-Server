import { getCollection } from "../config/database.js";
import { COLLECTIONS } from "../constants/index.js";
import type {
  ContactMessageDocument,
  NewsletterSubscriberDocument,
} from "../interfaces/models.js";
import { ConflictError } from "../utils/errors.js";

export class ContactService {
  async submitContact(input: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const now = new Date();
    const collection = getCollection<ContactMessageDocument>(COLLECTIONS.CONTACT_MESSAGES);
    await collection.insertOne({
      ...input,
      createdAt: now,
      updatedAt: now,
    });
    return { received: true };
  }

  async subscribeNewsletter(email: string) {
    const collection = getCollection<NewsletterSubscriberDocument>(COLLECTIONS.NEWSLETTER);
    const existing = await collection.findOne({ email: email.toLowerCase() });
    if (existing) throw new ConflictError("Email already subscribed");
    const now = new Date();
    await collection.insertOne({
      email: email.toLowerCase(),
      createdAt: now,
      updatedAt: now,
    });
    return { subscribed: true };
  }
}

export const contactService = new ContactService();
