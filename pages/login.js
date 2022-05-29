import Button from "../components/Button";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  async function signInWithGoogle() {
    const { user, session, error } = await supabase.auth.signIn({
      provider: "google",
    });
  }

  return (
    <div className="container mx-auto h-2/3 px-5">
      <div className="grid h-full place-items-center">
        <section className="text-white">
          <div className="bg-primary-dark py-5">
            <div className="text-center ">
              <h2 className="font-serif text-3xl font-[400] md:text-5xl">
                Login
              </h2>
            </div>
          </div>
          <div
            className={`flex min-h-[175px] flex-col items-center space-y-10 bg-secondary-dark p-5`}
          >
            <div className="w-1/2 max-w-md text-center text-lg md:text-2xl">
              Ulogujte se Gmail nalogom
            </div>
            <div className="flex w-1/2 max-w-md justify-center text-sm">
              <Button onClick={signInWithGoogle} label="login" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
