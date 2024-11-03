import './index.css';
import React, { useState } from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Main from './Components/Main/Main'

const App = () => {

  const [component, setcomponent] = useState("text")

  return (

    <div className="flex h-screen">
      <Sidebar setcomponent={setcomponent} />
      <Main component={component} />
    </div>

  )
}

export default App