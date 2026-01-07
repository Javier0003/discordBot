import { Context } from "hono";
import { Header } from "../../../components/header";
import { pageContainer } from "../../../constants/styles";
import { FC } from "hono/jsx";
import { css } from "hono/css";
import { ActivityType } from "discord.js";

const sectionStyles = css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 20px 0;
    padding: 10px;
    border-radius: 5px;

    h1 {
        color: #dadadaff;
        margin-bottom: 15px;
    }

    form {
    background-color: #ccccccff;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 5px;
        width: 300px;
        display: flex;
        flex-direction: column;

        label {

            margin-top: 10px;
            margin-bottom: 5px;
        }

        input, select {
            padding: 8px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        button {
            margin-top: 20px;
            padding: 10px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: #45a049;
            }
        }
    }
`;


const CreateBotStatusPage: FC<{ context: Context }> = ({ context }) => {
    return (
        <div className={pageContainer}>
            <Header context={context} />
            <div>
                <section className={sectionStyles}>
                    <h1>Create Bot Status</h1>
                    <form method="post" action="/api/bot/status">
                        <label htmlFor="statusMessage">Status Message:</label>
                        <input type="text" id="statusMessage" name="statusMessage" required />

                        <label htmlFor="type">Type:</label>
                        <select id="type" name="type" required>
                            {ActivityType.Playing === 0 && <option value="0">Playing</option>}
                            {ActivityType.Streaming === 1 && <option value="1">Streaming</option>}
                            {ActivityType.Listening === 2 && <option value="2">Listening</option>}
                            {ActivityType.Watching === 3 && <option value="3">Watching</option>}
                            {ActivityType.Custom === 4 && <option value="4">Custom</option>}
                            {ActivityType.Competing === 5 && <option value="5">Competing</option>}
                        </select>

                        <label htmlFor="url">URL (optional):</label>
                        <input type="text" id="url" name="url" />

                        <button type="submit">Create Status</button>
                    </form>
                </section>

            </div>
        </div>
    );
}

export default CreateBotStatusPage;