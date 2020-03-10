import { HashServiceGateway } from './../../gateways/services/hashService'
import { AuthServiceGateway } from './../../gateways/services/authService'
import { IdServiceGateway } from './../../gateways/services/idService'
import { UserDataSource } from '../../gateways/user'
import { User } from '../../entities/user'


export class SignUpUseCase {

  static INITIAL_USER_BALANCE: number = 0

  constructor(
    private userDataSource: UserDataSource,
    private idServiceGateway: IdServiceGateway,
    private authServiceGateway: AuthServiceGateway,
    private hashServiceGateway: HashServiceGateway,
  ){}

  async execute(input: SignUpUseCaseInput ): Promise<Object> {
    
    this.validatePassword(input.password)

    this.validateEmail(input.email)

    this.validateCPF(input.cpf)

    const newUser = new User(
      this.idServiceGateway.generate(),
      input.name,
      input.cpf,
      SignUpUseCase.INITIAL_USER_BALANCE,
      input.email,
      await this.hashServiceGateway.generate(input.password)
    )

    await this.userDataSource.createNewUser(newUser)

    return {
      token: this.authServiceGateway.generate(newUser.getId())
    }
  }

  private validatePassword(password: string) {
    if (password.length <= 6) {
      throw new Error(`Your password should have at least 7 characters.`);
    }
  }

  private validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(email).toLowerCase())){
      throw new Error("The email provided is invalid. Please, try again.")
    }

    if (this.userDataSource.getUserByEmail(email)) {
      throw new Error("The email provided already has a created account. Please, signup with a different email.")
    }
  }

  private validateCPF(cpf: string) {
    var re = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
    if (!re.test(String(cpf).toLowerCase())){
      throw new Error("The CPF provided is invalid. Please, try again.")
    } 
  }

}

export interface SignUpUseCaseInput {
  name: string
  email: string
  password: string
  cpf: string
}

