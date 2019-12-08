const { GraphQLServer } = require('graphql-yoga')

// 2. The resolvers object is the actual implementation of the GraphQL schema. Notice how its structure is identical to the structure of the type definition inside typeDefs: Query.info.

// 2.2 The next step is to implement the resolver function for the feed query. In fact, one thing we haven’t mentioned yet is that not only root fields, but virtually all fields on the types in a GraphQL schema have resolver functions. So, you’ll add resolvers for the id, description and url fields of the Link type as well.

// The links variable is used to store the links at runtime. For now, everything is stored only in-memory rather than being persisted in a database.
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack turorial for GraphQL'
}]

// adding a new integer variable that simply serves as a way to generate unique IDs for newly created Link elements
let idCount = links.length

// adding a new resolver for the feed root field. Notice that a resolver always has to be named after the corresponding field from the schema definition.
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    // The implementation of the post resolver first creates a new link object, then adds it to the existing links list and finally returns the new link.
      post: (parent, args) => {
          const link = {
              id: `link-${idCount++}`,
              description: args.description,
              url: args.url,
          }
          links.push(link)
          return link
    }
  },
}

// 3. the schema and resolvers are bundled and passed to the GraphQLServer which is imported from graphql-yoga. This tells the server what API operations are accepted and how they should be resolved.
const server = new GraphQLServer({
  // migrated typeDefs schema to schema.graphql
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))