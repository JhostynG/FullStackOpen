import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showRemoveButton = { display: blog.user.username === user ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = async (event) => {
    event.preventDefault()
    updateBlog({ ...blog, user: blog.user.id, likes: blog.likes + 1 })
  }

  const handleDeleteClick = async (event) => {
    event.preventDefault()
    if (window.confirm(`remove ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={hideWhenVisible}>view</button>
        <button onClick={toggleVisibility} style={showWhenVisible}>hide</button>
      </div>
      <div style={showWhenVisible} className='blogDetails'>
        <div>
          {blog.url}
        </div>
        <div>
          {blog.likes}
          <button onClick={addLike}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <button onClick={handleDeleteClick} style={showRemoveButton}>remove</button>
      </div>
    </div>
  )
}

export default Blog