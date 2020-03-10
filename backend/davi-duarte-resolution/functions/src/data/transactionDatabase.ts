import { TransactionDataSource } from '../business/gateways/transactions'
import { Transaction } from '../business/entities/transaction'
import { BaseDatabase } from './baseDatabase'


export class TransactionDatabase extends BaseDatabase implements TransactionDataSource {

  private async updateUserBalance(value: number, dataRef: any): Promise<void> {
    const treatedValue: number = parseFloat((Math.round(value * 100) / 100).toFixed(2)) 

    await dataRef.update({balance: treatedValue})
  }

  public async saveNewTransaction(input: Transaction): Promise<void> {
    try {
      const newTransaction = {
        id: input.getId(),
        uid: input.getUserId(),
        value: input.getValue(),
        type: input.getType()
      }

      const userDataReference = this.firestore.collection(
        BaseDatabase.USERS_COLLECTION
      ).doc(input.getUserId())

      const userData: any = (await userDataReference.get()).data()

      if (!(await userDataReference.get()).exists) {
        throw new Error("User not found. Please, try again.")
      }

      const newUserValue = newTransaction.value + userData.balance

      if(newUserValue < 0){
        throw new Error("Transaction denied. Not enough balance in the account")
      }

      await this.firestore.collection(
        BaseDatabase.TRANSACTIONS_COLLECTION
      ).doc(input.getId()).set(newTransaction)

      await this.updateUserBalance(newUserValue, userDataReference)
      
    } catch (e) {
      throw new Error(e)
    }
  }

  public async getTransactionById(id: string): Promise<Transaction> {
    try {
      const dataRef = this.firestore.collection(
        BaseDatabase.TRANSACTIONS_COLLECTION
      ).doc(id)
      const transactionData: any = (await dataRef.get()).data()
      
      const transaction = new Transaction(
        id,
        transactionData.uid,
        transactionData.type,
        transactionData.value
      )

      return transaction
    } catch (e) {
      throw new Error(e)
    }
  }

  public async getTransactionsByUserId(id: string): Promise<Transaction[]> {
    try {
      const dataRef = this.firestore.collection(
        BaseDatabase.TRANSACTIONS_COLLECTION
      )      

      const query = await dataRef.where(`uid`, `==`, `${id}`).get()

      if(query.empty){
        throw new Error("No transactions were recorded with this user.")
      }

      const transactions: any = []

      query.forEach(doc => {
        transactions.push(doc.data())
      })

      return transactions.map(this.dbModelToTransaction)

    } catch (e) {
      throw new Error(e)
    }
  }

  
}