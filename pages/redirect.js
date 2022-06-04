import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useEffect, useState } from "react";

let timeout;
export default function Redirect() {
  const [session, setSession] = useState(null);

  const handleRedirect = () => window.location.replace("/");

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setSession(session), 2000);
    });
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (session) {
    handleRedirect();
  }

  return (
    <div className="container mx-auto h-2/3 px-5">
      <div className="grid h-full place-items-center">
        <section className="w-64 text-white">
          <div className="bg-primary-dark py-5">
            <div className="text-center ">
              <h2 className="font-serif text-lg font-[400] md:text-2xl">
                Preusmeravanje
              </h2>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-10 bg-secondary-dark p-5">
            <Spinner />
            <div className="flex w-1/2 max-w-md justify-center text-sm">
              <Button onClick={handleRedirect} label="Idi na bazu" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
