import { Context } from "hono";
import RouteBuilder from "../../builders/route-builder";

export default class test extends RouteBuilder<Promise<Response>> {
    constructor() {
        super({
            path: '/test',
            method: 'get',
            devOnly: true
        })
    }

    public async event(c: Context): Promise<Response> {
        return c.text('Hello World from test route!')
    }
}