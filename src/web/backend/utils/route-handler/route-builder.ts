import { Context, Hono, Next } from 'hono'

type Path = `/${string}`

export default abstract class RouteBuilder<O>{
  private _path: Path
  private _method: keyof Hono

  constructor(path: Path, method: keyof Hono) {
    this._path = path
    this._method = method
  }

  public get path(): string {
    return this._path
  }

  public get method(): keyof Hono {
    return this._method
  }
  
  public abstract event(c: Context, next?: Next): O 
}