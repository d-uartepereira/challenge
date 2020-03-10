import { IdServiceGateway } from './../../gateways/services/idService'
import { TransactionType, Transaction } from './../../entities/transaction'
import { TransactionDataSource } from './../../gateways/transactions/index'
import { AuthServiceGateway } from './../../gateways/services/authService'

export class NewTransactionUseCase {
  constructor(
    private authServiceGateway: AuthServiceGateway,
    private transactionDataSource: TransactionDataSource,
    private idServiceGateway: IdServiceGateway
  ){}

  async execute(input: NewTransactionUseCaseInput){
    const userId = this.authServiceGateway.getUserIdFromToken(input.token)

    if (!userId) {
      throw new Error("User not found. Please, try again")
    }

    const newTransaction: Transaction = new Transaction(
      this.idServiceGateway.generate(), 
      userId, 
      input.transactionType, 
      input.value
    ) 

    await this.transactionDataSource.saveNewTransaction(newTransaction)

    return {
      message: "Transaction saved successfully."
    }

  }
}

export interface NewTransactionUseCaseInput {
  token: string
  transactionType: TransactionType
  value: number
}
