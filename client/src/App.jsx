import { useState } from 'react'
import './App.css'
import ChatApp from './components/ChatApp.jsx'
import Chat from './components/Chat.jsx'

function App() {
  const [username, setUsername]= useState()
  return (
    <>
    {
     username ? <ChatApp username={username} />: <Chat setUsername={setUsername} />
    }
    </>
  )
}

export default App
