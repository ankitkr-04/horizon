import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link'
import { createLinkToken } from '@/lib/actions/user.actions';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            const data : LinkTokenProps = await createLinkToken(user);
            setToken(data?.linkToken);
        }
    
        getLinkToken();
    }, [user])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        // await exchangePublicToken({
        // publicToken : public_token,
        // user
        // });
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
                    <Button>
                        Connect Bank Account
                    </Button>
                ) : (
                    <Button>
                        Connect Bank Account
                    </Button>

                ))}
        </>
    )
}

export default PlaidLink