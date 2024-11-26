import { Ubuntu } from "next/font/google"
import '../globals.css'
import { ClerkProvider } from "@clerk/nextjs"
import DotPattern from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"


export const metadata = { 
    title: "Raabta",
    description: "Your Moments, Your Story!"
}

const ubuntu = Ubuntu({
    weight: ["400", "700"], // Optional: specify weights
    subsets: ["latin"], // Specify subsets
  });


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
        >
            <html>
                <body className={`${ubuntu.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen my-10">
                        <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={1}
                    className={cn(
                      "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
                    )}
                    />
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}