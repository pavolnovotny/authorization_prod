const CustomError = require('../errors')

const checkPermissions = (requestUser, resourceUserId) => {
  console.log(requestUser, resourceUserId, typeof requestUser)

  if (requestUser.role === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return
  throw new CustomError.UnauthorizedError('Not authorized permission')
}

module.exports = checkPermissions
