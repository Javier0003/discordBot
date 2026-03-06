import { FC, Fragment } from "hono/jsx";
import { Header } from "../components/header";
import Script from "../components/Script";
import { css } from "hono/css";
import Link from "../components/Link";
import { linkStyles } from "../constants/styles";

const titleStyles = css`
    font-size: 2rem;
    font-weight: bold;
    margin-top: 1rem;
    color: #e6e6e6ff;
`;

const buttonStyles = css`
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
`;

const toggleContainerStyles = css`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
`

const perkContainerStyles = css`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
    justify-content: center;
    flex-direction: row;
    `

const roleTitleStyles = css`
    margin-top: 1rem;
    color: #e6e6e6ff;
`;

const pageContainer = css`
  min-height: 100vh;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`

const configurationModal = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
 `

const randomizeButtonStyles = css`
    margin-top: 2rem;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
    `



const DbdPage: FC = async ({ context }) => {

    return (
        <div className={pageContainer}>
            <Header context={context} />


            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                <h1 className={titleStyles}>Dead by Daylight randomizer</h1>
                <h3 id="radomizerRole" className={roleTitleStyles}> Select role:</h3>
                <div className={toggleContainerStyles}>
                    <button className={buttonStyles} id="survivorButton">Survivor</button>
                    <button className={buttonStyles} id="killerButton">Killer</button>
                </div>

                <button id="randomize" className={randomizeButtonStyles}>Randomize</button>

                <div id="perkContainer" className={perkContainerStyles}>

                </div>
            </div>

            <div className={configurationModal}>
                <Link to="/dbd/how-to-use" className={linkStyles}>How to use</Link>
                <Link to="/dbd/configuration" className={linkStyles}>Configure perks</Link>
            </div>

            <Script src="static/scripts/dbd/randomizer.js"></Script>
        </div>
    )
}

export default DbdPage;