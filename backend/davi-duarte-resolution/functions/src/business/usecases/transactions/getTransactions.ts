import { UserDataSource } from './../../gateways/user/index'
import { TransactionDataSource } from './../../gateways/transactions/index'
import { AuthServiceGateway } from "../../gateways/services/authService"



export class GetTransactionsUseCase {
  constructor(
    private transactionDataSource: TransactionDataSource,
    private userDataSource: UserDataSource,
    private authServiceGateway: AuthServiceGateway
  ){}

  async execute(token: string){
    const userId = this.authServiceGateway.getUserIdFromToken(token)

    const doesUserExists: boolean = await this.userDataSource.verifyIfUserExists(userId)
    
    if (!doesUserExists) {
      throw new Error('User not found. Please, try again')
    }

    const transactions = await this.transactionDataSource.getTransactionsByUserId(userId)

    return transactions.map(item => ({
      id: item.getId(),
      uid: item.getUserId(),
      type: item.getType(),
      value: item.getValue()
    }))
  }
}