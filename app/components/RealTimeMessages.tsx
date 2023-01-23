import { useSupabase } from "~/hook/useSupabase"
import { useEffect, useState } from "react"
import type { Database } from "~/types/database"
import { json } from "react-router"
type Message = Database['public']['Tables']['messages']['Row']

export function RealTimeMessages({
    serverMessages
}:{
    serverMessages: Message[]
}) {
    const [messages, setMessages] = useState<Message[]>(serverMessages)
    const supabase = useSupabase()

    
    useEffect(() => {
        const channel = supabase
        .channel('*')
        .on(
            'postgres_changes', // Broadcast 
        {
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages'
        }, // filter
        (payload) => { //callback
            const newMessage = payload.new as Message
            setMessages((messages) => [...messages, newMessage ])

            // if(!messages.some(message => message.id === newMessage.id)){
            //     setMessages((messages) => [...messages, newMessage ])
            // } 
        })
        .subscribe()

        return () => {supabase.removeChannel(channel)}
    },[supabase])

    return(
        <ul style={{listStyle:'none',margin:'0',paddingLeft:'10px'}}>
        {Object.values(messages).map(mensaje =>(
            <li key={mensaje.id}>
                <div style={{display:'flex',gap:'20px'}}>
                    <img
                    src={`https://api.dicebear.com/5.x/adventurer/svg?seed=${mensaje.user_id}`}
                    alt="avatar" 
                    height={60}
                    />
                    <small><p>{mensaje.created_at.slice(11,16)}</p></small>
                    <p className="mensajes">{mensaje.content}</p>
                </div>
            </li>
            
        ))}
        </ul>
    )
}