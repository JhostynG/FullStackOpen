import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'testing a blog',
    author: 'react-testing-library',
    url: 'some url to test',
    likes: 1,
    user: {
      username: 'react-testing-library',
      name: 'Test User'
    }
  }

  const user = 'react-testing-library'
  const updateHandler = vi.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={user} updateBlog={updateHandler} />
    ).container
  })

  test('renders title and author', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('testing a blog')
    expect(div).toHaveTextContent('react-testing-library')
  })

  test('at start blog details are not displayed', () => {
    const div = container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, blog details are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking the like button twice calls the event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateHandler.mock.calls).toHaveLength(2)
  })
})