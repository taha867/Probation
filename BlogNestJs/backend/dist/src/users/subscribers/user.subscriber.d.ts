import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { User } from '../user.entity';
export declare class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo(): typeof User;
    /**
     * Hash password before inserting a new user
     * @param event - Insert event containing the user entity
     */
    beforeInsert(event: InsertEvent<User>): Promise<void>;
    /**
     * Hash password before updating a user
     * Only hashes if password field was actually changed
     * @param event - Update event containing the user entity
     */
    beforeUpdate(event: UpdateEvent<User>): Promise<void>;
}
//# sourceMappingURL=user.subscriber.d.ts.map