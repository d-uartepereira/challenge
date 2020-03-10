import { User } from './../business/entities/user'
import { BaseDatabase } from './baseDatabase'
import { UserDataSource } from '../business/gateways/user'


export class UserDatabase extends BaseDatabase implements UserDataSource {


  public async createNewUser(input: User): Promise<void> {
    try {
      await this.auth.createUser({
        uid: input.getId(),
        email: input.getEmail(),
        emailVerified: true,
        displayName: input.getName(),
        password: input.getPassword()
      })
      const user = {
        name: input.getName(),
        cpf: input.getCpf(),
        balance: input.getBalance(),
        email: input.getEmail(),
        password: input.getPassword()
      }

      await this.firestore.collection(BaseDatabase.USERS_COLLECTION).doc(input.getId()).set(user)

    } catch(e) {
      throw new Error(e)
    }
  }

  public async getUserByEmail(email: string): Promise<User> {
    try {
      const userAuth = await this.auth.getUserByEmail(email)

      const userDataRef = this.firestore.collection(BaseDatabase.USERS_COLLECTION).doc(userAuth.uid)
      const userData: any = (await userDataRef.get()).data()
      const userId = (await userDataRef.get()).id

      const newUser = new User(
        userId,
        userData.name,
        userData.cpf,
        userData.balance,
        userData.email,
        userData.password
      )

      return newUser

    } catch (e) {
      throw new Error(e)
    }
  }

  public async verifyIfUserExists(id: string): Promise<boolean> {
    try {
      const doesUserExistsInDB = await this.auth.getUser(id)
      
      return Boolean(doesUserExistsInDB)
    } catch (e) {
      throw new Error(e)
    }
  }

  public async getUserById(id: string): Promise<User> {
    try {
      const userDataRef = this.firestore.collection(BaseDatabase.USERS_COLLECTION).doc(id)
      const userData: any = (await userDataRef.get()).data()
      const user = new User(id, userData.name, userData.cpf, userData.balance, userData.email, userData.password)

      return user
    } catch (e) {
      throw new Error(e)
    }
  }

  public async deleteUser(userId: string): Promise<void>{
    try {
      await this.auth.deleteUser(userId)
      await this.firestore.collection(BaseDatabase.USERS_COLLECTION).doc(userId).delete()
    } catch (e) {
      throw new Error(e)
    }
  }
}



