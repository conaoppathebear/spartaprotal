import { users, type User } from "@shared/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: any): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.replitId, id));
    return user;
  }

  async upsertUser(userData: any): Promise<User> {
    const replitId = userData.id;
    const [existing] = await db.select().from(users).where(eq(users.replitId, replitId));
    
    const mappedUser = {
        replitId: replitId,
        username: userData.username || userData.email?.split('@')[0] || `user_${replitId.substring(0,8)}`,
        email: userData.email,
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'User',
        profileImageUrl: userData.profileImageUrl,
    };

    if (existing) {
         const [updated] = await db.update(users).set({
             name: mappedUser.name,
             email: mappedUser.email,
             profileImageUrl: mappedUser.profileImageUrl,
         }).where(eq(users.replitId, replitId)).returning();
         return updated;
    } else {
        const [newUser] = await db.insert(users).values(mappedUser).returning();
        return newUser;
    }
  }
}

export const authStorage = new AuthStorage();
