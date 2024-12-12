import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>craete new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            data-testid='title'
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            id='title-input'
          />
        </div>
        <div>
          author
          <input
            data-testid='author'
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            id='author-input'
          />
        </div>
        <div>
          url
          <input
            data-testid='url'
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            id='url-input'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm