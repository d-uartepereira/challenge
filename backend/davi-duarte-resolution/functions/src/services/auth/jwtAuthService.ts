import { AuthServiceGateway } from './../../business/gateways/services/authService';
import * as jwt from 'jsonwebtoken';
import * as functions from 'firebase-functions'


export class JWTauthService implements AuthServiceGateway {

  private static SECRET_KEY = functions.config().jwt.key

  public generate(userId: string): string {
    const token = jwt.sign({ userId }, this.getJwtSecretKey(), {
      expiresIn: '1h'
    });

    return token;
  }

  public getUserIdFromToken(token: string): string {
    const verifiedResult = jwt.verify(token, this.getJwtSecretKey()) as {
      userId: string
    }
    return verifiedResult.userId;
  }

  private getJwtSecretKey(): string {
    return JWTauthService.SECRET_KEY
  }
}

