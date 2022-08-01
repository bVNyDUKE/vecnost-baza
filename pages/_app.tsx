import { AppProps } from "next/app";
import { MainLayout } from "../components/Layout/MainLayout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  if (Component.displayName === "Home") {
    return <Component {...pageProps} />;
  }

  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
