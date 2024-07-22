import { PrismaClient } from '@prisma/client'

export default class DbConnection{
  public static db: PrismaClient

  constructor(){
    DbConnection.db = new PrismaClient()
  }
}