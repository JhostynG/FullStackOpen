const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'test user',
        username: 'test',
        password: 'sekret'
      }
    })

    await page.goto('/', {
      waitUntil: 'networkidle',
    });
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'sekret')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('test user logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, 'test', 'sekret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'testing a blog creation', 'playwright', 'some url to test')
      await expect(page.getByText('testing a blog creation playwright')).toBeVisible()
    })

    test('a blog can be edited', async ({ page }) => {
      await createBlog(page, 'testing a blog edition', 'playwright', 'some url to test')
      const blogDiv = await page.locator('.blog').filter({ hasText: 'testing a blog edition' })
      await page.getByRole('button', { name: 'view' }).click()
      const likeButton = await blogDiv.getByRole('button', { name: 'like' })
      await expect(likeButton).toBeVisible()
      await expect(blogDiv.getByText('0')).toBeVisible()
      await likeButton.click()
      await expect(blogDiv.getByText('1')).toBeVisible()
      await expect(blogDiv.getByText('0')).not.toBeVisible()
    })

    test('delete button can only be seen by the creator', async ({ page, request }) => {
      await createBlog(page, 'testing a blog deletion', 'playwright', 'some url to test')
      let blogDiv = await page.locator('.blog').filter({ hasText: 'testing a blog deletion' })
      await page.getByRole('button', { name: 'view' }).click()
      await expect(blogDiv.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('/api/users', {
        data: {
          name: 'test user2',
          username: 'test2',
          password: 'sekret2'
        }
      })

      await loginWith(page, 'test2', 'sekret2')

      blogDiv = await page.locator('.blog').filter({ hasText: 'testing a blog deletion' })
      await page.getByRole('button', { name: 'view' }).click()
      await expect(blogDiv.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are arranged in the order according to the likes', async ({ page, request }) => {
      await createBlog(page, 'blog 1', 'playwright', 'some url to test')
      await createBlog(page, 'blog 2', 'playwright', 'some url to test')
      await createBlog(page, 'blog 3', 'playwright', 'some url to test')

      const blog2Div = await page.locator('.blog').filter({ hasText: 'blog 2' })
      const blog3Div = await page.locator('.blog').filter({ hasText: 'blog 3' })

      let blogList = await page.locator('.blog').all()
      await expect(blogList[0].getByText('blog 1')).toBeVisible()
      await expect(blogList[1].getByText('blog 2')).toBeVisible()
      await expect(blogList[2].getByText('blog 3')).toBeVisible()

      await blog2Div.getByRole('button', { name: 'view' }).click()
      await blog2Div.getByRole('button', { name: 'like' }).click()
      await blog2Div.getByText('1like').waitFor()
      await blog2Div.getByRole('button', { name: 'like' }).click()
      await blog2Div.getByText('2like').waitFor()
      await blog2Div.getByRole('button', { name: 'like' }).click()
      await blog2Div.getByText('3like').waitFor()

      await blog3Div.getByRole('button', { name: 'view' }).click()
      await blog3Div.getByRole('button', { name: 'like' }).click()
      await blog3Div.getByText('1like').waitFor()

      blogList = await page.locator('.blog').all()
      await expect(blogList[0].getByText('blog 2')).toBeVisible()// 3 likes
      await expect(blogList[1].getByText('blog 3')).toBeVisible()// 1 like
      await expect(blogList[2].getByText('blog 1')).toBeVisible()// 0 likes
    })
  })

})

