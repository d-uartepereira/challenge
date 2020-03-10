import { UserDataSource } from './../../gateways/user/index'
import { TransactionDataSource } from './../../gateways/transactions/index'
import { AuthServiceGateway } from "../../gateways/services/authService"



export class GetTransactionUseCase {
  constructor(
    private transactionDataSource: TransactionDataSource,
    private userDataSource: UserDataSource,
    private authServiceGateway: AuthServiceGateway
  ){}

  async execute(token: string, id: string){
    const userId = this.authServiceGateway.getUserIdFromToken(token)

    const doesUserExists: boolean = await this.userDataSource.verifyIfUserExists(userId)
    
    if (!doesUserExists) {
      throw new Error('User not found. Please, try again')
    }

    const transaction = await this.transactionDataSource.getTransactionById(id)

    return {
      id: transaction.getId(),
      uid: transaction.getUserId(),
      value: transaction.getValue(),
      type: transaction.getType()
    }
    
  }
}