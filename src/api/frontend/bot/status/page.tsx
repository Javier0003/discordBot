import { FC, Fragment } from "hono/jsx";
import { Header } from "../../components/header";
import { container } from "../../constants/styles";
import Script from "../../components/Script";

const BotStatusPage: FC = async ({ context }) => {
    return (
        <Fragment>
            <Header context={context} />
            <div className={container}>
                Bot Status Page
            </div>
            
            <Script src="static/scripts/bot.js" />
        </Fragment>
    );
}

export default BotStatusPage;