import { css } from "hono/css"

export const container = css`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: rgb(25, 25, 25);
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`;

export const linkStyles = css`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid white;
  border-radius: 0.5rem;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 3rem;
    height: 3rem;
  }

  &:hover {
    background-color: white;
    color: black;
  }
`



export const pageContainer = css`
  min-height: 100vh;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`

export const bottomRightAbsoluteContainer = css`
    position: absolute;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 8px;
    background-color: rgb(35, 35, 35);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    bottom: 16px;
    right: 16px;

    button {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #666;
        background-color: #222;
        color: #ccc;
        width: 200px;
        box-sizing: border-box;
    }

    button:hover {
        background-color: #333;
    }
`