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
