import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('message')

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('Wrong username or password', 'error')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBloglistAppUser')
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${blogObject.title} by ${blogObject.author}`, 'message')
    } catch (exception) {
      if (exception.response.status === 401) {
        setUser(null)
        blogService.setToken(null)
        window.localStorage.removeItem('loggedBloglistAppUser')
      }
      notify(exception.response.data.error, 'error')
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.update(blogObject.id, blogObject)
      const b = blogs.map(blog => blog.id !== blogObject.id ? blog : returnedBlog)
      sortBlogs(b)
    } catch (exception) {
      notify(exception.response.data.error, 'error')
    }
  }

  const deleteBlog = async (id) => {
    const blogsCopy = [...blogs]
    setBlogs(blogs.filter(blog => blog.id !== id))
    try {
      await blogService.deleteBlog(id)
    } catch (exception) {
      setBlogs(blogsCopy)
      if (exception.response.status === 401) {
        setUser(null)
        blogService.setToken(null)
        window.localStorage.removeItem('loggedBloglistAppUser')
      }
      notify(exception.response.data.error, 'error')
    }
  }

  const notify = (newMessage, type) => {
    setMessage(newMessage)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const sortBlogs = (blogsToSort) => {
    const sortedBlogs = blogsToSort.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      sortBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} type={messageType} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type={messageType} />
      <p>{user.name} logged-in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} deleteBlog={deleteBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user.username} />
      )}
    </div>
  )
}

export default App