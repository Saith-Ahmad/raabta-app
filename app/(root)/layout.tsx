import { Inter, Ubuntu } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

export const metadata = {
  title: "Raabta",
  description: "Your Moments, Your Story!",
};

const inter = Inter({ subsets: ["latin"] });
const ubuntu = Ubuntu({
  weight: ["400", "700"], // Optional: specify weights
  subsets: ["latin"], // Specify subsets
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${ubuntu.className} bg-dark-1`}> 
          <Topbar />
          <main className="flex flex-row ">
            <LeftSidebar />
            <section className="main-container">
             <div className="">
             </div>
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
