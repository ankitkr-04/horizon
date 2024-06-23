import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="min-h-screen flex w-full justify-between font-inter">
            {children}
            <div className="auth-asset">
                <div>
                    <Image src="/icons/auth-image.svg" alt="Auth Image" width={500} height={500} priority={true} />
                </div>
            </div>
        </main>
    );
}
