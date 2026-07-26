import React from 'react'
import Home from './Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Front from './Front'
const App = () => {
  return (
    <div>
      <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Front />}></Route>
                    <Route
                        path="/home"
                        element={<Home />}
                    ></Route>
                </Routes>
            </BrowserRouter>
    </div>
  )
}

export default App