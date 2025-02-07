export function getLayout(path: string, pages: string[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Layout = require(`${path}/${pages.filter((page) =>
      page.startsWith('Layout')
    )}`).default

    return Layout
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null
  }
}
