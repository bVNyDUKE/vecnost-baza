# Vecnost Baza

### Local development setup

Prerequisites:

- Docker
- Git

### WSL2 Guide

- Start docker
- Install Supabase CLI

  ```
  wget https://github.com/supabase/cli/releases/download/v1.8.7/supabase_1.8.7_linux_amd64.deb
  sudo apt install ./supabase_1.8.7_linux_amd64.deb
  ```

- Clone repository
- Cd into repository and start supabase

  ```
  cd vecnost-baza
  supabase start
  ```

- Obtain project ID and link the local instance to remote

  ```
  supabase link --project-ref $PROJECT_ID
  ```

- Obtain the local supabase keys

  ```
  supabase status
  ```

- Obtain the remote migrations

  ```
  supabase db remote commit
  ```

- Make .env.development, open it with your editor and add the keys above

  ```
  NEXT_PUBLIC_SUPABASE_URL=<Supabase API Url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase anon key>
  ```

## TODO

- Add general stats to its own modal
