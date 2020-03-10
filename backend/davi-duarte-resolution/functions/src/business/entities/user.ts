export class User {
  constructor(
    private id: string,
    private name: string,
    private cpf: string,
    private balance: number,
    private email: string,
    private password: string,
  ) {}

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getCpf(): string {
    return this.cpf
  }

  public getBalance(): number {
    return this.balance
  }

  public getEmail(): string {
    return this.email
  }

  public getPassword(): string {
    return this.password
  }

}

