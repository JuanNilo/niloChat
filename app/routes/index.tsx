import { useLoaderData } from '@remix-run/react'
import {ActionArgs, LoaderArgs} from '@remix-run/node'
import {createSupabaseServerClient} from '~/utils/supabase.server'
import { Login } from '~/components/Login'
import {json} from '@remix-run/node'
import { Form } from '@remix-run/react'
import { RealTimeMessages } from '~/components/RealTimeMessages'
import styles from '../styles/menu.module.css'


export const loader = async ({request}: LoaderArgs) => {
  const response = new Response()
  const supabase = createSupabaseServerClient({request, response})
  const {data} = await supabase.from("messages").select()

  return json({messages: data ?? []}, {headers: response.headers})
}

export const action = async ({request}: ActionArgs) => {
  const response = new Response()
  const supabase = createSupabaseServerClient({request, response})

  // formData de la request....
  const formData = await request.formData()
  const {message} = Object.fromEntries(formData)
  
  await supabase.from('messages').insert({content:String(message)})

  return json({message: 'ok'},{headers: response.headers})
}

export default function Index() {
  const {messages} = useLoaderData<typeof loader>()

  return (
    <main >
      <h1 style={{textAlign:'center'}}>Chat 🦆🦆🦆</h1>
      <Login />
      <div style={{width:'500px', maxHeight:"600px", overflow:'auto', background:"#333", borderRadius:'15px', padding:'10px', display:'grid',margin:'0 auto', marginTop:'30px'}}>
        <p>Mensajes:</p>
        <RealTimeMessages serverMessages={messages}/>
      </div>
      <div style={{marginTop:"20px",display:'flex', justifyContent:'center'}}>
        <Form method="post" 
          style={{display:'grid', gap:"10px"}}>
          <input type="text" autoComplete='off' placeholder='Escriba aca su mensaje...' name='message' 
            style={{ padding:'10px',height:'50px',width:'300px', border:'none', borderRadius:"5px"}} />
          <button className='btn' type='submit'>Enviar Mensaje</button>
        </Form>
      </div>
    </main>
    )
}
 