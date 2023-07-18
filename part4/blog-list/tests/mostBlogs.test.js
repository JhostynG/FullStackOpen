const listHelper = require('../utils/list_helper')

test('returns the author who has the largest amount of blogs', () => {
  const result = listHelper.mostBlogs(listHelper.blogs)

  expect(result).toStrictEqual({
    author: 'Robert C. Martin',
    blogs: 3
  })
})