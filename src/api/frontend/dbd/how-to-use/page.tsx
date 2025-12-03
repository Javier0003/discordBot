import { css } from "hono/css";
import { FC } from "hono/jsx";
import { Header } from "../../components/header";
import Link from "../../components/Link";

const pageContainer = css`
  min-height: 100vh;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`
const titleStyles = css`
   font-size: 2rem;
    font-weight: bold;
    margin: 2rem auto;
    color: #e6e6e6ff;
`

const paragraphStyles = css`
    font-size: 1.2rem;
    color: #ccccccff;
    margin: 1rem auto;
    max-width: 800px;
    line-height: 1.6;
`

export const HowToPage: FC = async ({ context }) => {
    return (
        <div className={pageContainer}>
            <Header context={context} />
            <h1 className={titleStyles}>How to Use the Dead by Daylight Perk Randomizer</h1>

            <p className={paragraphStyles}>
                Primero ves a la pagina de <Link to="/dbd/configuration">configuracion</Link> y seleccionas los perks que quieres incluir en el randomizador. Puedes elegir perks tanto de sobrevivientes como de asesinos. 
                Luego vas a la <Link to="/dbd">pagina principal</Link> del randomizador y haces click en "Generar Perks". El sistema seleccionara aleatoriamente un conjunto de perks basado en tus preferencias.
                Puedes repetir este proceso tantas veces como quieras hasta encontrar un conjunto de perks que te guste.
            </p>
        </div>
    )
}


export default HowToPage;