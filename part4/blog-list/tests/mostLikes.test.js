const listHelper = require('../utils/list_helper')

test('returns the author who has the largest amount of likes', () => {
  const result = listHelper.mostLikes(listHelper.blogs)

  expect(result).toStrictEqual({
    author: 'Edsger W. Dijkstra',
    likes: 17
  })
})