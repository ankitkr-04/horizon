import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'

const Home = () => {
  const loggedIn = { firstName: 'Ankit', lastName: 'Kumar', email: 'ankit@lnct.ac.in' }

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
        RECENT TRANSACTIONS

      </div>
      <RightSidebar
        user={loggedIn}
        transaction={[]}
        banks={[{
          $id: '1',
          name: 'Bank of America',
          currentBalance: 800.68,
          mask: '1234',
        }, {
          $id: '2',
          name: 'Chase Bank',
          currentBalance: 968.68,
        }]}
      />
    </section>
  )
}

export default Home