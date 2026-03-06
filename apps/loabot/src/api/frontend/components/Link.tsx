import { FC } from 'hono/jsx'

const Link: FC<{
  className?: Promise<string>
  to: `/${string}`
  children?: unknown
}> = ({ className, to, children }) => {
  return (
    <a href={to} class={className}>
      {children}
    </a>
  )
}

export default Link