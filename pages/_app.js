import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { MainLayout } from "../components/Layout/MainLayout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </UserProvider>
  );
}

export default MyApp;
