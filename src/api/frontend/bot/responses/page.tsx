import { FC, Fragment } from "hono/jsx";
import { Header } from "../../components/header";
import { linkStyles, pageContainer } from "../../constants/styles";
import { Context } from "hono";
import Redirect from "../../components/redirect";
import Link from "../../components/Link";
import { css } from "hono/css";

const redirectWrapper = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
`;

const bodyStyles = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    justify-content: center;
    align-items: center;
`;


const BotPage: FC<{ context: Context }> = async ({ context }) => {
    const { serverUsersRepository, randomReplyRepository} = context.repositories;

    const dev = await serverUsersRepository.getById(context.userData?.id || "");

    if (!dev) {
        return <Redirect to="/" />;
    }

    const responses = await randomReplyRepository.getAll();

    return (
        <Fragment>
            <Header context={context} />
            <div className={pageContainer}>
                <div className={bodyStyles}>
                    <section className={redirectWrapper}>
                        <Link to="/bot/responses/create" className={linkStyles}>Create Response</Link>
                    </section>

                    <section>
                        {responses.length === 0 ? (
                            <p>No responses found.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Response</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responses.map((response) => (
                                        <tr key={response.idReply}>
                                            <td>{response.idReply}</td>
                                            <td>{response.reply}</td>
                                            <td>
                                                <Link to={`/bot/responses/edit/${response.idReply}`} className={linkStyles}>Edit</Link>
                                                <Link to={`/api/bot/responses/delete/${response.idReply}`} className={linkStyles}>Delete</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </div>
            </div>
        </Fragment>
    )
}

export default BotPage;