import { Transaction } from './../../entities/transaction'


export interface TransactionDataSource {
  saveNewTransaction(input: Transaction): Promise<void>
  getTransactionById(id: string): Promise <Transaction>
  getTransactionsByUserId(id: string): Promise<Transaction[]>
}

