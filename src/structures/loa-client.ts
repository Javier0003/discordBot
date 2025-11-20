import LoaBot from './loa-bot'

export default class LoaSingleton {
  loa: LoaBot;

  private static instance:  LoaBot

  constructor(clientStatic?: LoaBot) {
    if(clientStatic) LoaSingleton.instance = clientStatic
    this.loa = LoaSingleton.instance
  }

  static get LoA(){
    if(!LoaSingleton.instance) throw new Error('No instance of LoaBot')
      return LoaSingleton.instance
  }

  get db (){
    return LoaSingleton.LoA.db
  }
}