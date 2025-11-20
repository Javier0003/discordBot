import { FC, Fragment } from "hono/jsx";
import { Header } from "../components/header";
import { container, linkStyles } from "../constants/styles";
import Link from "../components/Link";
const BotPage: FC = async ({ context }) => {
    return (
        <Fragment>
            <Header context={context} />
            <div className={container}>
                <Link to="/bot/status" className={linkStyles}>
                    Bot Status
                </Link>
            </div>
        </Fragment>
    )
}

export default BotPage;