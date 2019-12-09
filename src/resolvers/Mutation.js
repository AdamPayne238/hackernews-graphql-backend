
async function signup(parent, args, context, info){
    // 1. In the signup mutation, the first thing to do is encrypting the User’s password using the bcryptjs library which you’ll install soon.
    const password = await bcrypt.hash(args.password, 12)
    // 2. The next step is to use the prisma client instance to store the new User in the database.
    const user = await context.prisma.createUser({ ...args, password })

    // 3. You’re then generating a JWT which is signed with an APP_SECRET. You still need to create this APP_SECRET and also install the jwt library that’s used here.
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // 4. Finally, you return the token and the user in an object that adheres to the shape of an AuthPayload object from your GraphQL schema.
    return {
        token,
        user,
    }
}

async function login(parent, args, context, info){
    // 1. Instead of creating a new User object, you’re now using the prisma client instance to retrieve the existing User record by the email address that was sent along as an argument in the login mutation. If no User with that email address was found, you’re returning a corresponding error.
    const user = await context.prisma.user({ email: args.email })
    if(!user){
        throw new Error('No such user found')
    }

    // 2. The next step is to compare the provided password with the one that is stored in the database. If the two don’t match, you’re returning an error as well.
    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid){
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // 3. In the end, you’re returning token and user again.
    return {
        token,
        user,
    }
}

module.exports = {
    signup,
    login,
    post,
}