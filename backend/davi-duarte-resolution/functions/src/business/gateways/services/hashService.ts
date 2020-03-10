
export interface HashServiceGateway {
  generate(password: string): Promise<string>
  compareHash(password: string, hash: string): Promise<boolean>
}
