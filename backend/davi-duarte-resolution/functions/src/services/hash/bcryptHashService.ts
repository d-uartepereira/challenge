import { HashServiceGateway } from './../../business/gateways/services/hashService';
import * as bcrypt from 'bcrypt'

export class BCryptHashService implements HashServiceGateway {
  async generate(password: string): Promise<string> {
    const genSalt = await bcrypt.genSalt(1);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    return hashedPassword;
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
