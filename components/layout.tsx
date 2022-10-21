import { FaGithub } from 'react-icons/fa'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <div className="h-24 w-full mt-12 surface grid place-items-center">
        <a className="inline-flex" href="https://github.com/Desdaemon/moolah" target="_blank" rel="noreferrer">
          <FaGithub className="self-center mx-1" />
          GitHub • 2022
        </a>
      </div>
    </>
  )
}