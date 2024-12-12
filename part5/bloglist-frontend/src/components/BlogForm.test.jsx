import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with the right details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing a form...')
  await user.type(authorInput, 'react-testing-library')
  await user.type(urlInput, 'url...')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('react-testing-library')
  expect(createBlog.mock.calls[0][0].url).toBe('url...')
})
