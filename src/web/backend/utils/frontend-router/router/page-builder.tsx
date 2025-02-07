import { FC } from 'hono/jsx'
import RouteBuilder from '../../route-handler/route-builder'
import { Context } from 'hono'

export default class Page extends RouteBuilder<Promise<Response> | Response> {
  static LayoutDefault: FC
  HomePage: FC
  Layout: FC

  constructor(
    HomePage: FC,
    path: string,
    LayoutCustom: FC = Page.LayoutDefault
  ) {
    super(`/${path}`, 'get')
    this.Layout = LayoutCustom
    this.HomePage = HomePage
  }

  public event(c: Context): Promise<Response> | Response {
    return c.html(
      <this.Layout>
        <this.HomePage context={c}/>
      </this.Layout>
    )
  }
}