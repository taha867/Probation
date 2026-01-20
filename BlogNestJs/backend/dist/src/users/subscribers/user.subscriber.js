"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriber = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user.entity");
const bcrypt_1 = require("../../lib/utils/bcrypt");
let UserSubscriber = class UserSubscriber {
    listenTo() {
        return user_entity_1.User;
    }
    /**
     * Hash password before inserting a new user
     * @param event - Insert event containing the user entity
     */
    async beforeInsert(event) {
        if (event.entity.password) {
            // Only hash if password is not already hashed (bcrypt hashes start with $2b$)
            if (!event.entity.password.startsWith('$2b$')) {
                event.entity.password = await (0, bcrypt_1.hashPassword)(event.entity.password);
            }
        }
    }
    /**
     * Hash password before updating a user
     * Only hashes if password field was actually changed
     * @param event - Update event containing the user entity
     */
    async beforeUpdate(event) {
        if (event.entity && event.entity.password) {
            // Get the database entity to compare
            const databaseEntity = event.databaseEntity;
            // Only hash if password is new (not already hashed) and different from database
            if (!event.entity.password.startsWith('$2b$') &&
                (!databaseEntity || event.entity.password !== databaseEntity.password)) {
                event.entity.password = await (0, bcrypt_1.hashPassword)(event.entity.password);
            }
        }
    }
};
exports.UserSubscriber = UserSubscriber;
exports.UserSubscriber = UserSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], UserSubscriber);
//# sourceMappingURL=user.subscriber.js.map