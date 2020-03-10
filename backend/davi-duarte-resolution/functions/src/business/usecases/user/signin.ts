import { HashServiceGateway } from './../../gateways/services/hashService'
import { AuthServiceGateway } from './../../gateways/services/authService'
import { UserDataSource } from '../../gateways/user'

export class SignInUseCase {
  constructor(
    private userDataSource: UserDataSource,
    private authServiceGateway: AuthServiceGateway,
    private hashServiceGateway: HashServiceGateway
  ){}

  async execute (
    email: string,
    password: string
  ): Promise <any> {
    const user = await this.userDataSource.getUserByEmail(email)
    const comparedPassword = await this.hashServiceGateway.compareHash(
      password,
      user.getPassword()
    )

    if (!comparedPassword) {
      throw new Error("Incorrect password. Try again.")
    }

    return {
      token: this.authServiceGateway.generate(user.getId())
    }
  }
}


