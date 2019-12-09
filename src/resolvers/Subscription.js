// Rather than returning any data directly, they return an AsyncIterator which subsequently is used by the GraphQL server to push the event data to the client.
// Subscription resolvers are wrapped inside an object and need to be provided as the value for a subscribe field. You also need to provide another field called resolve that actually returns the data from the data emitted by the AsyncIterator.
// As mentioned, the prisma client instance on the context exposes a $subscribe property which proxies the subscriptions from the Prisma API. This function is used to resolve subscriptions and push the event data. Prisma is taking care of all the complexity of handling the realtime functionality under the hood.

function newLinkSubscribe(parent, args, context, info){
    return context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node()
}

const newLink = {
    subscribe: newLinkSubscribe,
    resolve: payload => {
        return payload
    },
}

function newVoteSubscribe(perent, args, context, info){
    return context.prisma.$subscribe.vote({ mutation_in: ['CREATED'] }).node()
}

const newVote = {
    subscribe: newVoteSubscribe,
    resolve: payload => {
        return payload
    },
}

module.exports = {
    newLink,
    newVote,
}