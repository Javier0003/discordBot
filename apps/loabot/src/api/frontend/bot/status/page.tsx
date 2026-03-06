import { FC, Fragment } from "hono/jsx";
import { Header } from "../../components/header";
import { bottomRightAbsoluteContainer, container, linkStyles } from "../../constants/styles";
import Script from "../../components/Script";
import { Context } from "hono";
import Link from "../../components/Link";

const BotStatusPage: FC<{ context: Context }> = async ({ context }) => {
    const { botStatusRepository } = context.repositories;

    const status = await botStatusRepository.getPaged(1, 10);



    return (
        <Fragment>
            <Header context={context} />
            <div className={container}>
                <div>
                    Bot Status Page
                    <table>
                        <thead>
                            <tr>
                                <th>Status Message</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {status.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.statusMessage}</td>
                                    <td>{s.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={bottomRightAbsoluteContainer}>
                    <Link to="/bot/status/create" className={linkStyles}>create Bot Status</Link>
                </div>
            </div>

            <Script src="static/scripts/bot.js" />
        </Fragment>
    );
}

export default BotStatusPage;