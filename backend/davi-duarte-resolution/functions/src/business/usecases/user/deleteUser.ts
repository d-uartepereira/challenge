import { AuthServiceGateway } from './../../gateways/services/authService'
import { UserDataSource } from '../../gateways/user'


export class DeleteUserUseCase {
  constructor(
    private userDataSource: UserDataSource,
    private authServiceGateway: AuthServiceGateway
  ){}

  async execute(token: string): Promise<any>{
    const userId = this.authServiceGateway.getUserIdFromToken(token)

    const doesUserExists: boolean = await this.userDataSource.verifyIfUserExists(userId)
    
    if (!doesUserExists) {
      throw new Error('User not found. Please, try again')
    }

    await this.userDataSource.deleteUser(userId)

    return {
      message: "User deleted successfuly."
    }
  }
}