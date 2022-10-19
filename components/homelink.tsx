import Link from "next/link"

export type HomeLinkProps = Omit<Parameters<typeof Link>[0], 'href'>
export default function HomeLink(props: HomeLinkProps) {
  const className = 'block rainbow font-bold ' + (props.className || '')
  return <Link {...props} href="/" className={className}>Moolah</Link>
}