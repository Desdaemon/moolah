import type { NextPage } from 'next'
import Head from 'next/head'
import { useRef } from 'react';
import { supabase } from '../utils/supabase';

const useElementRef = <K extends keyof HTMLElementTagNameMap>() => useRef<HTMLElementTagNameMap[K]>(null);

const Login: NextPage = () => {
  const formRef = useElementRef<'form'>();
  const getFormElements = () => ({
    identity: formRef.current?.identity.value,
    password: formRef.current?.password.value,
  })
  const login = async (event: any) => {
    event.preventDefault()
    const { identity } = getFormElements();
    const {error} = await supabase.auth.signInWithOtp({
      email: identity,
    })
    if (error) throw error;
  }
  const register = async (event: any) =>{
    event.preventDefault()
    console.log('register', getFormElements())
  }
  return (
    <div className='container mx-auto'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='max-w-xs mx-auto rounded border border-neutral-700 mt-20 p-2'>
        <h1 className="text-2xl font-bold mb-4">Login to <span className="rainbow">Moolah</span></h1>
        <form ref={formRef} className='form'>
          <label htmlFor="identity">
            <span>Username or email</span>
            <input name="identity" type="text" />
          </label>
          <label htmlFor="password">
            <span>Password</span>
            <input name="password" type="password" />
          </label>
          <button className="transition-colors border border-sky-700 bg-sky-400 hover:bg-sky-300 py-1 mt-2 rounded"
                  onClick={login}>Login</button>
          <button className="transition border border-neutral-500 hover:border-neutral-300 py-1 mt-2 rounded"
                  onClick={register}>Register</button>
        </form>
      </div>
    </div>
  )
}

export default Login
