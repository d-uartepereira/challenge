import { v4 } from 'uuid'
import { IdServiceGateway } from '../../business/gateways/services/idService';


export class V4IdService implements IdServiceGateway {
  generate(): string {
    return v4()
  }
}


