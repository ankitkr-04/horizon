import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn!.$id })
  const currPage = Number(page as string) || 1;


  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;


  const account = await getAccount({ appwriteItemId });

  // console.log("user",loggedIn);
  // console.log("account", account);
  // console.log("accountsData",accountsData);



  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={`${loggedIn?.firstName} ${loggedIn?.lastName}` || 'Guest'}
            subtext="Access and manage your account and transacation efficiently."
          />
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks || 0}
            totalCurrentBalance={accounts?.totalCurrentBalance || 0}
          />
        </header>
        <RecentTransactions accounts={accountsData} transactions={account?.transactions} appwriteItemId={appwriteItemId} currentPage={currPage} />

      </div>
      <RightSidebar
        user={loggedIn}
        transaction={accounts?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  )
}

export default Home