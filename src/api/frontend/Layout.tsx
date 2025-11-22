import { css, Style } from 'hono/css'
import { FC } from 'hono/jsx'

const styles = css`
  margin: 0;
  padding: 0;
  font-family: "Comic Neue", serif;
`

const Layout: FC = ({ children }) => {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <link rel="icon" href="/static/logo.ico" type="image/x-icon" />
        <title>Loa Page</title>
        <Style />
      </head>
      <body class={styles}>
        {children}
      </body>
    </html>
  )
}

export default Layout