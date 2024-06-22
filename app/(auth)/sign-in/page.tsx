import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignInPage = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
     <AuthForm type="sign-in" />
    </section>
  )
}

export default SignInPage