import { TimestampServiceGateway } from './../../business/gateways/services/timestampService';
import moment from 'moment'

export class MomentJSService implements TimestampServiceGateway {

  public getTreatedDateForSQL(date: string): string {
    const treatedDate = moment(date).format("YYYY-MM-DD")
    return treatedDate
  }

  public getUserAge(date: string): number {
    const treatedDate: string = this.getTreatedDateForSQL(date)

    const userAge: number = Number(moment(treatedDate).fromNow().split(' ')[0])

    if (!this.verifyUserMajority(userAge)) {
      throw new Error("Users aged below 18 years are not allowed.")
    }

    return userAge
  }

  public verifyUserMajority(age: number): boolean {

    const isUserAnAdult = age >= 18 ? true : false

    return isUserAnAdult
  }
}