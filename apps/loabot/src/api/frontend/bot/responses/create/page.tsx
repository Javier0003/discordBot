import { FC } from "hono/jsx";
import { pageContainer } from "../../../constants/styles";
import { Context } from "hono";
import { Header } from "../../../components/header";
import { css } from "hono/css";
import Script from "../../../components/Script";

const bodyStyles = css`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    justify-content: center;
    align-items: center;

    button {
        padding: 0.5rem 1rem;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }

    input[type="text"] {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 300px;
    }

    label {
    color: #ffffffff;
    font-weight: bold;
    margin-bottom: 0.5rem;
    }
`;

const CreateResponsePage: FC<{ context: Context }> = ({ context }) => {
    return (
        <div className={pageContainer}>
            <Header context={context} />
            <div className={bodyStyles}>
                <label htmlFor="response">Response:</label>
                <input type="text" id="response" name="response" />
                <button type="submit" id="btnSend">Create Response</button>
            </div>
            <Script src="static/scripts/responses/create-response.js"/>
        </div>
    );
}

export default CreateResponsePage;