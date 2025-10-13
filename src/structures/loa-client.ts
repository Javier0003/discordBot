import LoaBot from './loa-bot'

export default class LoaClient {
  loa: LoaBot;

  private static instance:  LoaBot

  constructor(clientStatic?: LoaBot) {
    if(clientStatic) LoaClient.instance = clientStatic
    this.loa = LoaClient.instance
  }

  static get LoA(){
    if(!LoaClient.instance) throw new Error('No instance of LoaBot')
      return LoaClient.instance
  }

  get db (){
    return LoaClient.LoA.db
  }
}