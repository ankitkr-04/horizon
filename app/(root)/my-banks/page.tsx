import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn!.$id })
  // console.log(accounts);
  
  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox title="My Banks Accounts" subtext='Effortlessly manage banking Activities' />

        <div className="space-y-4">
          <h2 className="header-2">Your Cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.map((account: any) => (
              <BankCard 
                key={account.id}
                account={account}
                showBalance={true}
                userName={`${loggedIn?.firstName} ${loggedIn?.lastName}` || 'Guest'}

              />

            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks