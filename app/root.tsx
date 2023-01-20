import type { LinksFunction, MetaFunction } from "@remix-run/node";
import React, { useState, useEffect } from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import {LoaderArgs} from '@remix-run/node'
import {json} from '@remix-run/node'

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Chat real time",
  viewport: "width=device-width,initial-scale=1",
});

import styles from './styles/global.css'
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { Database } from "./types/database";
import { createSupabaseServerClient } from "./utils/supabase.server";

export const links:LinksFunction = () => [
  {rel: 'stylesheet', href: styles}
]

export const loader = async ({request}: LoaderArgs) => {
  const env = { 
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPASBASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  }

  const response = new Response()
  const supabase = createSupabaseServerClient({request, response})

  const {data: {session}} = await supabase.auth.getSession()
  return  json({env, session}, {headers: response.headers})
}

export default function App() {
  const {env, session: serverSession} = useLoaderData<typeof loader>()
  const revalidator = useRevalidator()

  const [supabase] = useState(() => createBrowserClient<Database>(
    env.SUPABASE_URL,
    env.SUPASBASE_ANON_KEY
  ))

  useEffect(() => {
    const {data : {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
      if(session?.access_token !== serverSession?.access_token){
        revalidator.revalidate()
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body >
        <Outlet context={{supabase}} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
