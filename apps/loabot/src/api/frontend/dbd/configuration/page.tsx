import { FC, Fragment } from "hono/jsx";
import { Header } from "../../components/header";
import Script from "../../components/Script";
import { css } from "hono/css";
import Link from "../../components/Link";
import { linkStyles } from "../../constants/styles";

const pageContainer = css`
  min-height: 100vh;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: column;
`

const container = css`
  flex: 1;
  display: flex;
  margin-top: 8px;
  margin-left: 12px;
  margin-right: 12px;
  flex-wrap: wrap;
  gap: 20px;
  align-content: flex-start;
  box-sizing: border-box;
  position: relative;
`

const changePageContainer = css`
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: flex-end;

    section {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
`
const changePageButton = css`
    background-color: rgb(60, 60, 60);
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    
    &:hover {
        background-color: rgb(80, 80, 80);
    }
`

const selectModeModal = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(40, 40, 40);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
`

const searchContainerStyles = css`
    display: none;
    justify-content: center;
    margin-top: 20px;

    
    
    input {
        width: 300px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }
    `

const DbdConfigPage: FC = async ({ context }) => {
    return (
        <div className={pageContainer}>
            <Header context={context}>
                <h1 style="color: white; text-align: center;">Dead by Daylight Perk Configuration</h1>
            </Header>

            <div id="searchContainer" className={searchContainerStyles}>
                <input type="text" id="perkBrowser" list="perkOptions"/>
                <datalist id="perkOptions">
                </datalist>

                <button id="searchButton" className={changePageButton}>Search</button>
                <button id="clearSearchButton" className={changePageButton}>Clear</button>
            </div>


            <div className={container} style="position: relative;" id="renderPerks">


            </div>
            <div className={selectModeModal} id="selectModeModal">
                <button id="survivorButton" className={changePageButton}>Survivor</button>
                <button id="killerButton" className={changePageButton}>Killer</button>
            </div>

            <div className={changePageContainer}>
                <Link to="/dbd" className={linkStyles}>Volver</Link>

                <section>
                    <button className={changePageButton} id="prevButton">Back</button>
                    <button className={changePageButton} id="nextButton">Next</button>
                </section>

            </div>
            <Script src="static/scripts/dbd/configuration.js"></Script>
        </div>
    );
}


export default DbdConfigPage;