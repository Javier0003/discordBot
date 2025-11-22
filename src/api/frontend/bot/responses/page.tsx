import { FC, Fragment } from "hono/jsx";
import { Header } from "../../components/header";
import { container } from "../../constants/styles";
const BotPage: FC = async ({ context }) => {
    return (
        <Fragment>
            <Header context={context} />
            <div className={container}>

                responses page
            </div>
        </Fragment>
    )
}

export default BotPage;