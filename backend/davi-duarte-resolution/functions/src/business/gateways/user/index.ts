import { User } from '../../entities/user'


export interface UserDataSource {
  createNewUser(input: User): Promise<void>
  getUserByEmail(email: string): Promise<User>
  getUserById(id: string): Promise<User>
  verifyIfUserExists(id: string): Promise<boolean>
  deleteUser(userId: string): Promise<void>
}
