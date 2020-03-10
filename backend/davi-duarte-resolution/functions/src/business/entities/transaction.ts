export enum TransactionType {
  Saque = "SAQUE",
  Depósito =  "DEPOSITO"
}

export class Transaction {
  constructor(
    private id: string,
    private userId: string,
    private type: TransactionType,
    private value: number
  ){
    const treatedNumber: number = parseFloat((Math.round(this.value * 100) / 100).toFixed(2))
    this.value = treatedNumber 
  }

  getId(){
    return this.id
  }

  getUserId(){
    return this.userId
  }

  getType(){
    return this.type
  }

  getValue(){
    return this.value
  }

}

