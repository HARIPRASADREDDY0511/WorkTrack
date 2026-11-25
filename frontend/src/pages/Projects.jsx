
import { useEffect, useState } from 'react'
import api from '../api/axios'

function Projects() {
  const [projects, setProjects] = useState([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Pending')

  const [editingProjectId, setEditingProjectId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/')
      setProjects(response.data)
    } catch (err) {
      console.error('Projects API error:', err)
      setError('Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setStatus('Pending')
    setEditingProjectId(null)
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    try {
      const response = await api.post('/projects/', {
        name,
        description,
        status
      })

      setProjects(prev => [...prev, response.data])
      resetForm()

      setSuccess('Project created successfully!')
    } catch (err) {
      console.error('Create project error:', err)
      setError('Unable to create project.')
    }
  }
  const handleDeleteProject = async (projectId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this project?'
  )

  if (!confirmed) return

  setError('')
  setSuccess('')

  try {
    await api.delete(`/projects/${projectId}`)

    setProjects(prev =>
      prev.filter(project => project.id !== projectId)
    )

    if (editingProjectId === projectId) {
      resetForm()
    }

    setSuccess('Project deleted successfully!')
  } catch (err) {
    console.error('Delete project error:', err)
    setError(
      err.response?.data?.detail || 'Unable to delete project.'
    )
  }
}

  const handleEditClick = (project) => {
    setEditingProjectId(project.id)
    setName(project.name)
    setDescription(project.description || '')
    setStatus(project.status)

    setError('')
    setSuccess('')
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    try {
      const response = await api.patch(
        `/projects/${editingProjectId}`,
        {
          name,
          description,
          status
        }
      )

      setProjects(prev =>
        prev.map(project =>
          project.id === editingProjectId
            ? response.data
            : project
        )
      )

      resetForm()
      setSuccess('Project updated successfully!')
    } catch (err) {
      console.error('Update project error:', err)
      setError('Unable to update project.')
    }
  }

  if (loading) return <h2>Loading projects...</h2>

  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <p>Manage all your projects here.</p>

      <h2>
        {editingProjectId ? 'Edit Project' : 'Create New Project'}
      </h2>

      <form
        onSubmit={
          editingProjectId
            ? handleUpdateProject
            : handleCreateProject
        }
        className="project-form"
      >
        <div>
          <label>Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
          />
        </div>

        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit">
          {editingProjectId ? 'Update Project' : 'Create Project'}
        </button>

        {editingProjectId && (
          <button type="button" onClick={resetForm} className="cancel-button">
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <h2>All Projects ({projects.length})</h2>

      <div className="projects-container">
        {projects.map(project => (
          <div className="project-card" key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <span>{project.status}</span>
            <p>Project ID: {project.id}</p>

            <button
              type="button"
              className="edit-button"
              onClick={() => handleEditClick(project)}
            >
              Edit Project
            </button>
            <button
  type="button"
  className="delete-button"
  onClick={() => handleDeleteProject(project.id)}
>
  Delete Project
</button>
          </div>
        ))}
      </div>

      {projects.length === 0 && <p>No projects found.</p>}
    </div>
  )
}

export default Projects
