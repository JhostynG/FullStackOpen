const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const user = request.user
  if (!user) return response.status(401).json({ error: 'token missing or invalid' })

  const blog = new Blog(body)
  if (!body.likes) blog.likes = 0
  blog.user = user._id

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(await savedBlog.populate('user', { username: 1, name: 1 }))
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) return response.status(401).json({ error: 'token missing or invalid' })

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized user' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  let blog = await Blog.findById(request.params.id)

  if (!blog) return response.status(404).end()

  blog.likes = request.body.likes

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(await updatedBlog.populate('user', { username: 1, name: 1 }))
})

module.exports = blogsRouter