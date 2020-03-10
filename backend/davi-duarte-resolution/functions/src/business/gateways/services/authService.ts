export interface AuthServiceGateway {
  generate(userId: string): string
  getUserIdFromToken(token: string): string
}