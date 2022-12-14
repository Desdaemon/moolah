import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { supabase } from '../utils/client'
import { useRouter } from 'next/router'
import { useElementRef } from '../utils/hooks'
import { queryOr } from '../utils/common'

function bail(mes = ''): never {
  throw new Error(mes)
}

const Login: NextPage = () => {
  const formRef = useElementRef<'form'>();
  const [newUser, setNewUser] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()
  const redirect = queryOr(router.query.from) || '/'
  function getFormElements() {
    const form = formRef.current!
    if (form.reportValidity()) {
      return {
        email: form.email.value as string,
        password: form.password.value as string,
      }
    }
    bail('Invalid credentials')
  }
  
  async function login(event: any) {
    event.preventDefault()
    if (newUser !== false) {
      setNewUser(false)
      setError(undefined)
      return
    }

    const creds = getFormElements()
    const { error } = await supabase.auth.signInWithPassword(creds)
    if (error) return setError(error.message)
    router.push(redirect)
  }
  async function register(event: any) {
    event.preventDefault()
    if (newUser !== true) {
      setNewUser(true)
      setError(undefined)
      return
    }
    const creds = getFormElements()
    const { error } = await supabase.auth.signUp(creds)
    if (error) return setError(error.message)
    router.push(redirect)
  }
  return (
    <div className="container mx-auto">
      <Head>
        <title>Moolah • Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-xs mx-auto card">
        <h1 className="text-3xl font-bold mb-4">
          Login to <span className="rainbow">Moolah</span>
        </h1>
        <form ref={formRef} className='form'>
          <label htmlFor="email">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" />
          </label>
          {newUser !== undefined &&
            (
              <label htmlFor="password">
                <span>{newUser ? 'New password' : 'Password'}</span>
                <input name="password" type="password" autoComplete={newUser ? 'new-password' : 'current-password'} />
              </label>
            )
          }
          {error && <p className="text-red-400">{error}</p>}
          <button
            className="transition-colors border border-sky-700 bg-sky-400 hover:bg-sky-300 py-1 mt-2 rounded"
            onClick={login}>Login</button>
          <button
            className="transition border border-neutral-500 hover:border-neutral-300 py-1 mt-2 rounded"
            onClick={register}>Register</button>
        </form>
      </div>
    </div>
  )
}

export default Login
