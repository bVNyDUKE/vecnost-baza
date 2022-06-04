import Button from "../components/Button";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useEffect, useState } from "react";

export default function Redirect() {
  const [session, setSession] = useState(null);

  const handleRedirect = () => window.push("/");

  useEffect(() => {
    setSession(supabaseClient.auth.session());
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
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
              <h2 className="font-serif text-3xl font-[400] md:text-5xl">
                Login
              </h2>
            </div>
          </div>
          <div className="flex h-72 flex-col items-center justify-center space-y-10 bg-secondary-dark p-5">
            <div className="w-1/2 max-w-md text-center text-lg md:text-2xl">
              Hvala na prijavi!
            </div>
            <div className="flex w-1/2 max-w-md justify-center text-sm">
              <Button onClick={handleRedirect} label="Idi na bazu" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
