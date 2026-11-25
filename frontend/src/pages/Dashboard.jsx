
import { useEffect, useState } from 'react'
import api from '../api/axios'

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          api.get('/projects/'),
          api.get('/tasks/')
        ])

        setProjects(projectsResponse.data)
        setTasks(tasksResponse.data)
      } catch (err) {
        console.error('Dashboard API error:', err)
        setError('Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const completedTasks = tasks.filter(
    task => task.status === 'Completed'
  ).length

  const pendingTasks = tasks.filter(
    task => task.status === 'Pending'
  ).length

  const inProgressTasks = tasks.filter(
    task => task.status === 'In Progress'
  ).length

  if (loading) return <h2>Loading dashboard...</h2>

  if (error) return <h2>{error}</h2>

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p>Welcome to WorkTrack</p>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <h2>{projects.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <h2>{tasks.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <h2>{completedTasks}</h2>
        </div>

        <div className="stat-card">
          <h3>Pending Tasks</h3>
          <h2>{pendingTasks}</h2>
        </div>
      </div>

      <h2>Recent Projects</h2>

      <div className="projects-container">
        {projects.map(project => (
          <div className="project-card" key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <span>{project.status}</span>
          </div>
        ))}
      </div>

      <h2>Task Summary</h2>
      <p>In Progress: {inProgressTasks}</p>
    </div>
  )
}

export default Dashboard
