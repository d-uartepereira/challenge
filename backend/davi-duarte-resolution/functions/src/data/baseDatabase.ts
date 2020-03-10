import * as firebase from 'firebase-admin'
import { Transaction } from '../business/entities/transaction'


export abstract class BaseDatabase {
  protected firestore = firebase.firestore()
  protected auth = firebase.auth()

  protected static TRANSACTIONS_COLLECTION = 'Transactions'
  protected static USERS_COLLECTION = 'Users'

  protected dbModelToTransaction(dbModel: any): Transaction {
    return new Transaction(
      dbModel.id,
      dbModel.uid,
      dbModel.type,
      dbModel.value
    )
  }
}

