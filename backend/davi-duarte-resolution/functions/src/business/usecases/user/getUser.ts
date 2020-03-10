import { AuthServiceGateway } from './../../gateways/services/authService'
import { UserDataSource } from './../../gateways/user/index'

export class GetUserUseCase {
  constructor(
    private userDataSource: UserDataSource,
    private authServiceGateway: AuthServiceGateway
  ){}

  async execute(token: string){
    const userId = this.authServiceGateway.getUserIdFromToken(token)

    const doesUserExists: boolean = await this.userDataSource.verifyIfUserExists(userId)
    
    if (!doesUserExists) {
      throw new Error('User not found. Please, try again')
    }

    const user = await this.userDataSource.getUserById(userId)

    return {
      id: user.getId(),
      name: user.getName(),
      cpf: user.getCpf(),
      balance: user.getBalance(),
      email: user.getEmail()
    }
  }
} 


