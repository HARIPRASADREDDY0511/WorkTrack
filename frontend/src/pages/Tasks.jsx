
import { useEffect, useState } from 'react'
import api from '../api/axios'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [editingTaskId, setEditingTaskId] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Pending')
  const [projectId, setProjectId] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [taskResponse, projectResponse] = await Promise.all([
        api.get('/tasks/'),
        api.get('/projects/')
      ])

      setTasks(taskResponse.data)
      setProjects(projectResponse.data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Unable to load tasks or projects.')
    } finally {
      setLoading(false)
    }
  }
  const handleEditClick = (task) => {
  setEditingTaskId(task.id)
  setTitle(task.title)
  setDescription(task.description || '')
  setStatus(task.status)
  setProjectId(String(task.project_id))

  setError('')
  setSuccess('')
}

const handleUpdateTask = async (e) => {
  e.preventDefault()

  setError('')
  setSuccess('')

  try {
    const response = await api.patch(
      `/tasks/${editingTaskId}`,
      {
        title,
        description,
        status,
        project_id: Number(projectId)
      }
    )

    setTasks(prev =>
      prev.map(task =>
        task.id === editingTaskId ? response.data : task
      )
    )

    resetForm()

    setSuccess('Task updated successfully!')
  } catch (err) {
    console.error('Update task error:', err)
    setError(
      err.response?.data?.detail || 'Unable to update task.'
    )
  }
}
const resetForm = () => {
  setTitle('')
  setDescription('')
  setStatus('Pending')
  setProjectId('')
  setEditingTaskId(null)
}

  const handleCreateTask = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    try {
      const response = await api.post('/tasks/', {
        title,
        description,
        status,
        project_id: Number(projectId)
      })

      setTasks(prev => [...prev, response.data])

      setTitle('')
      setDescription('')
      setStatus('Pending')
      setProjectId('')

      setSuccess('Task created successfully!')
    } catch (err) {
      console.error('Create task error:', err)
      setError(
        err.response?.data?.detail || 'Unable to create task.'
      )
    }
  }

  if (loading) return <h2>Loading tasks...</h2>

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>
      <p>Create and manage your project tasks.</p>

      <h2>Create New Task</h2>

     <form
  onSubmit={editingTaskId ? handleUpdateTask : handleCreateTask}
  className="project-form"
>
        <div>
          <label>Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
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

        <div>
          <label>Select Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            <option value="">Choose a project</option>

            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={projects.length === 0}>
          Create Task
        </button>
        {editingTaskId && (
  <button type="button" onClick={resetForm}>
    Cancel
  </button>
)}
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <h2>All Tasks ({tasks.length})</h2>

      <div className="tasks-container">
        {tasks.map(task => (
          <div className="task-card" key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span>{task.status}</span>
            <p>Task ID: {task.id}</p>
            <p>Project ID: {task.project_id}</p>
            <button
  type="button"
  onClick={() => handleEditClick(task)}
>
  Edit Task
</button>
            <button
  type="button"
  onClick={() => handleEditClick(task)}
>
  Edit Task
</button>
          </div>
        ))}
      </div>

      {tasks.length === 0 && <p>No tasks found.</p>}
    </div>
  )
}

export default Tasks
