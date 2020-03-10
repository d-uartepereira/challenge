import { SignUpUseCaseInput, SignUpUseCase } from './business/usecases/user/signup'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import cors from 'cors'
import express, {Response, Request} from 'express'
import {UserDatabase} from './data/userDatabase'
import { V4IdService } from './services/id/v4idService'
import { JWTauthService } from './services/auth/jwtAuthService'
import { BCryptHashService } from './services/hash/bcryptHashService'
import { SignInUseCase } from './business/usecases/user/signin'
import { DeleteUserUseCase } from './business/usecases/user/deleteUser'
import { NewTransactionUseCase, NewTransactionUseCaseInput } from './business/usecases/transactions/newTransaction'
import { TransactionDatabase } from './data/transactionDatabase'
import { GetTransactionUseCase } from './business/usecases/transactions/getTransaction'
import { GetTransactionsUseCase } from './business/usecases/transactions/getTransactions'
import { GetUserUseCase } from './business/usecases/user/getUser'

const getTokenFromHeaders = (headers: any): string => {
  return (headers["auth"] as string) || ""
}

const app = express()
app.use(cors())

app.post('/signup', async (req: Request , res: Response ) => {
  try {
    const newUser: SignUpUseCaseInput = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cpf: req.body.cpf
    }

    const useCase = new SignUpUseCase(
      new UserDatabase(), 
      new V4IdService(), 
      new JWTauthService(), 
      new BCryptHashService()
    )

    const result = await useCase.execute(newUser)

    res.status(200).send(result)

  } catch (err) {
    res.status(400).send({
      ...err,
      errorMessage: err.message
    })
  }
})

app.post('/login', async (req: Request , res: Response ) => {
  try {
    const useCase = new SignInUseCase(
      new UserDatabase(), 
      new JWTauthService(), 
      new BCryptHashService()
    )

    const result = await useCase.execute(req.body.email, req.body.password)

    res.status(200).send(result)

  } catch (err) {
    res.status(400).send({
      ...err,
      errorMessage: err.message
    })
  }
})

app.get('/user', async (req: Request , res: Response ) => {
  try {
    const token = getTokenFromHeaders(req.headers)

    const useCase = new GetUserUseCase(
      new UserDatabase(),
      new JWTauthService()
    )

    const result = await useCase.execute(token) 

    res.status(200).send(result)

  } catch (err) {
    res.status(400).send({
      ...err,
      errorMessage: err.message
    })
  }
})

app.delete('/delete/user', async (req: Request , res: Response ) => {
  try {
    const token = getTokenFromHeaders(req.headers)

    const useCase = new DeleteUserUseCase(
      new UserDatabase(),
      new JWTauthService(),
    )

    const result = await useCase.execute(token)

    res.status(200).send(result)

  } catch (err) {
    res.status(400).send({
      ...err,
      errorMessage: err.message
    })
  }
})

app.post('/new-transaction', async (req: Request , res: Response ) => {
  try {
    const token = getTokenFromHeaders(req.headers)

    const useCase = new NewTransactionUseCase(
      new JWTauthService(),
      new TransactionDatabase(),
      new V4IdService()
    )

    const data: NewTransactionUseCaseInput = {
      token,
      transactionType: req.body.type,
      value: req.body.value
    }

    const result = await useCase.execute(data)

    res.status(200).send(result)

  } catch (err) {
    res.status(400).send({
      ...err,
      errorMessage: err.message
    })
  }
})

app.get('/transaction/:id', async (req: Request , res: Response ) => {
  try {
    const token = getTokenFromHeaders(req.headers)

    const useCase = new GetTransactionUseCase(
      new TransactionDatabase(),
      new UserDatabase(),
      new JWTauthService()
    )

    const result = await useCase.execute(token, req.params.id) 

    res.status(200).send(result)

  } catch (err) {
    res.status(400).send({
      ...err,
      errorMessage: err.message
    })
  }
})

app.get('/transactions', async (req: Request , res: Response ) => {
  try {
    const token = getTokenFromHeaders(req.headers)

    const useCase = new GetTransactionsUseCase(
      new TransactionDatabase(),
      new UserDatabase(),
      new JWTauthService()
    )

    const result = await useCase.execute(token) 

    res.status(200).send(result)

  } catch (err) {
    res.status(400).send({
      ...err,
      errorMessage: err.message
    })
  }
})

admin.initializeApp()

export const ioouApi = functions.https.onRequest(app)