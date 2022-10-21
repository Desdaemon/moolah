import Link from "next/link"
import styles from './homelink.module.css'

export type HomeLinkProps = Omit<Parameters<typeof Link>[0], 'href'>
export default function HomeLink(props: HomeLinkProps) {
  const className = [
    styles['moolah-title'],
    'transition duration-200 block text-white hover:text-primary font-bold',
    styles['neon'],
    props.className || ''
  ].join(" ")
  return <Link {...props} href="/" className={className}>Moolah</Link>
}