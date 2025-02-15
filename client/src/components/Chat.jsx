import React, { useState } from 'react'

const Chat = ({setUsername}) => {
    const [user, setUser] = useState()
  return (
    <div>
        <input type="text" onChange={(e)=>setUser(e.target.value)}/>
        <button onClick={setUsername(user)}>Start</button>
    </div>
  )
}

export default Chat