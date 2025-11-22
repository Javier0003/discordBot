import { FC, Fragment } from "hono/jsx";
import Script from "./Script";

const Redirect: FC<{ to: string }> = ({ to }) => {
  return (
    <Fragment>
        <div id="redirect" data-to={to}></div>
        <p>If you are not redirected, <a href={to}>click here</a>.</p>
        <Script src={"static/scripts/redirect.js"}/>
    </Fragment>
  );
};

export default Redirect;
