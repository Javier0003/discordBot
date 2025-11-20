import { Context, Hono, Next } from 'hono'

type Path = `/${string}`

type ConstructorObject = {
  path: Path
  method: keyof Hono
  devOnly?: boolean
}

export default abstract class RouteBuilder<O>{
  private _path: Path
  private _method: keyof Hono
  private _devOnly: boolean


  constructor(data: ConstructorObject) {
    this._path = data.path
    this._method = data.method
    this._devOnly = data.devOnly ?? false
  }

  public get path(): string {
    return this._path
  }

  public get method(): keyof Hono {
    return this._method
  }

  public get devOnly(): boolean {
    return this._devOnly
  }

  public abstract event(c: Context, next?: Next): O
}