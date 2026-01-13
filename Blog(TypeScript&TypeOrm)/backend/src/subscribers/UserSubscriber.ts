import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
} from "typeorm";
import { User } from "../entities/User.js";
import { hashPassword } from "../utils/bcrypt.js";

/**
 * User Subscriber
 * Handles password hashing on update using proper change tracking
 * 
 * This subscriber listens to User entity update events and hashes passwords
 * only when the password field actually changes

 */
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Specifies which entity this subscriber listens to
   * @returns User entity class
   */
  listenTo() {
    return User;
  }

  /**
   * Called before a User entity is updated
   * Hashes password only if it actually changed
   * 
   * @param event - UpdateEvent containing entity and database entity
   */
  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    // Check if entity exists (it can be undefined in some update scenarios)
    if (!event.entity) {
      return; // No entity data, skip
    }

    // Check if password field exists in the update
    if (!event.entity.password) {
      return; // Password not being updated, skip
    }

    // Get the current password from database (before update)
    const currentPassword = event.databaseEntity?.password;

    // Get the new password value (what we're trying to set)
    const newPassword = event.entity.password;

    // Only hash if password actually changed
    // We always receive plain text passwords, so no need to check if already hashed
    if (currentPassword !== newPassword) {
      // Hash the new password before it's saved
      event.entity.password = await hashPassword(newPassword);
    }
  }
}

