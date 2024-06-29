import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import Image from 'next/image';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            const data: LinkTokenProps = await createLinkToken(user);
            setToken(data?.linkToken);
        }

        getLinkToken();
    }, [user])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        await exchangePublicToken({
            publicToken: public_token,
            user
        });
        router.push('/');

    }, [user])


    const config = {
        token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config);

    return (

        <>
            {variant === 'primary' ? (
                <Button
                    onClick={() => open()}
                    disabled={!ready}
                    className='plaidlink-primary'
                >
                    Connect Bank Account
                </Button>
            ) : (
                variant === 'ghost' ? (
                    <Button className='plaidlink-ghost' onClick={() => open()}>
                       <Image src="/icons/connect-bank.svg" width={24} height={24} alt="Connect Bank" />
                       <p className='hidden xl:block text-[16px] font-semibold text-black-2'>Connect Bank Account</p>
                    </Button>
                ) : (
                    <Button className='plaidlink-default' onClick={() => open()}>
                        <Image src="/icons/connect-bank.svg" width={24} height={24} alt="Connect Bank" />
                        <p className='text-[16px] font-semibold text-black-2'>Connect Bank Account</p>
                    </Button>

                ))}
        </>
    )
}

export default PlaidLink
