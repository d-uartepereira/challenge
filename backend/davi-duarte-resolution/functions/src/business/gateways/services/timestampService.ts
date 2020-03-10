
export interface TimestampServiceGateway {
  getUserAge(date: string): number
  verifyUserMajority(age: number): boolean
  getTreatedDateForSQL(date: string): string
}