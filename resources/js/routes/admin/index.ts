import branches from './branches'
import users from './users'

const admin = {
    branches: Object.assign(branches, branches),
    users: Object.assign(users, users),
}

export default admin