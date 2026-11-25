
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        <aside className="sidebar">
          <h2>WorkTrack</h2>

          <nav>
            <NavLink to="/" end>
              Dashboard
            </NavLink>

            <NavLink to="/projects">
              Projects
            </NavLink>

            <NavLink to="/tasks">
              Tasks
            </NavLink>
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  )
}

export default App
