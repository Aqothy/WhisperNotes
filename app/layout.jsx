import "./globals.css";
import { Poppins } from "next/font/google";
import ReduxProvider from "@/redux/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersistLogin from "@/components/ux/PersistLogin";
import Redirect from "@/components/ux/Redirect";
import CheckLoading from "@/components/ux/CheckLoading";
import GetUser from "@/hooks/useGetUser";

export const metadata = {
  title: "Cipher notes",
  description: "A secure diary app that you take your secrets to the grave.",
  openGraph: {
    title: "Cipher notes",
    description: "A secure diary app that takes your secrets to the grave.",
    url: "cipher-notes.vercel.app",
    siteName: "Cipher notes",
    locale: "en-US",
    type: "website",
  },
};

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ToastContainer />
        <ReduxProvider>
          <PersistLogin>
            <GetUser>
              <CheckLoading>
                <Redirect>{children}</Redirect>
              </CheckLoading>
            </GetUser>
          </PersistLogin>
        </ReduxProvider>
      </body>
    </html>
  );
}
