import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'

const Home = () => {
  const loggedIn = { firstName: 'Ankit' }

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transacation efficiently."
          />
          <TotalBalanceBox 
          accounts={[]}
          totalBanks={0}
          totalCurrentBalance={800.68}
          />
        </header>

      </div>
    </section>
  )
}

export default Home