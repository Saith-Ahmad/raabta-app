import { Inter } from "next/font/google"
import '../globals.css'
import { ClerkProvider } from "@clerk/nextjs"

export const metadata = {
    title: "Linkify",
    description: "A digital chat application"
}

const inter = Inter({ subsets: ['latin'] })


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html>
                <body className={`${inter.className} bg-dark-1 `}>
                    <div className="w-full flex justify-center items-center min-h-screen my-10">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}