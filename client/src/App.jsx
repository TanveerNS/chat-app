import { useState } from 'react'
import './App.css'
import ChatApp from './components/ChatApp.jsx'
import Chat from './components/Chat.jsx'
import { Stack } from "@mui/material";


function App() {
  const [username, setUsername]= useState('testing')
  return (
    <>

<Stack direction='row' sx={{ width: '100%' }}>

    {
      username ? <ChatApp username={username} />: <Chat setUsername={setUsername} />
    }
    
    </Stack>
{/* 
    {
     username ? <ChatApp username={username} />: <Chat setUsername={setUsername} />
    } */}

    </>
  )
}

export default App
