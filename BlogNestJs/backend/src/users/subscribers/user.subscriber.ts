import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../user.entity';
import { hashPassword } from '../../lib/utils/bcrypt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  /**
   * @param event - Insert event containing the user entity
   */
  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    if (event.entity.password) {
      // Only hash if password is not already hashed (bcrypt hashes start with $2b$)
      if (!event.entity.password.startsWith('$2b$')) {
        event.entity.password = await hashPassword(event.entity.password);
      }
    }
  }

  /**
   * @param event - Update event containing the user entity
   */
  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    if (event.entity && event.entity.password) {
      // Get the database entity to compare
      const databaseEntity = event.databaseEntity;

      // Only hash if password is new (not already hashed) and different from database
      if (
        !event.entity.password.startsWith('$2b$') &&
        (!databaseEntity || event.entity.password !== databaseEntity.password)
      ) {
        event.entity.password = await hashPassword(event.entity.password);
      }
    }
  }
}
