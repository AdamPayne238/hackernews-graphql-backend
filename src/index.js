
const { GraphQLServer } = require('graphql-yoga')

// yarn add prisma-client-lib
// This dependency is required to make the auto-generated Prisma client work.
// Now you can attach the generated prisma client instance to the context so that your resolvers get access to it.
const { prisma } = require('./generated/prisma-client')


// The context argument
// Previously, the feed resolver didn’t take any arguments - now it receives four. In fact, the first two and the fourth are not needed for this particular resolver. But the third one, called context, is.
// Remember how we said earlier that all GraphQL resolver functions always receive four arguments. Now you’re getting to know another one, so what is context used for?
// The context argument is a plain JavaScript object that every resolver in the resolver chain can read from and write to - it thus basically is a means for resolvers to communicate. As you’ll see in a bit, it’s also possible to already write to it at the moment when the GraphQL server itself is being initialized. So, it’s also a way for you to pass arbitrary data or functions to the resolvers. In this case, you’re going to attach this prisma client instance to the context - more about that soon.

// Understanding the feed resolver
//It accesses a prisma object on context. As you will see in a bit, this prisma object actually is a Prisma client instance that’s imported from the generated prisma-client library.
// This Prisma client instance effectively lets you access your database through the Prisma API. It exposes a number of methods that let you perform CRUD operations for your models.

// Understanding the post resolver
// Similar to the feed resolver, you’re simply invoking a function on the prisma client instance which is attached to the context.
// You’re sending the createLink method from the Prisma client API. As arguments, you’re passing the data that the resolvers receive via the args parameter.
// So, to summarize, Prisma client exposes a CRUD API for the models in your datamodel for you to read and write in your database. These methods are auto-generated based on your model definitions in datamodel.prisma.

const resolvers = {
    Query: {
        info: () => `All your database are belong to us..`,
        feed: (root, args, context, info) => {
            return context.prisma.links()
        },
    },
    Mutation: {
        post: (root, args, context) => {
            return context.prisma.createLink({
                url: args.url,
                description: args.description,
            })
        },
    },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma }, 
})

server.start(() => console.log(`Server is running on http://localhost:4000`))