import { useSupabase } from "~/hook/useSupabase"

export function Login(){
    const supabase = useSupabase()

    const handleLogout = async () => {
        const {error} = await supabase.auth.signOut()
        if(error) console.log('Error al cerrar sesion 🤕', error)
    }
    const handleLogin = async () => {
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'github'
        })
        if(error) console.log('Error al cerrar sesion 🤕', error)
    }
    return(
    <div className="containerLogin">
        <div>
            <button className="btn login" onClick={handleLogin}>Iniciar sesion</button>
            <button className="btn login" style={{background:'red'}} onClick={handleLogout}>Cerrar sesion</button>
        </div>
    </div>
    )
}