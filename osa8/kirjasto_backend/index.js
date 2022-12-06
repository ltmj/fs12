const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const MONGODB_URI = 'mongodb+srv://<mongoCluster>:<password>@cluster0.xd5fs.mongodb.net/part8?retryWrites=true&w=majority'

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })



const typeDefs = gql`

  type Book {
      title: String!
      published: Int!
      author: Author!
      genres: [String!]!
      id: ID!
  }

  type Author {
      name: String!
      born: Int
      bookCount: Int!
  }

  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(genre: String, author: String): [Book!]!
      allAuthors: [Author!]!
      me: User
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ) : Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
    Query: {
        authorCount: () => Author.collection.countDocuments(),
        bookCount: () => Book.collection.countDocuments(),
        
        allBooks: async (root, args) => {
          if(args.genre && args.author){
            const a = await Author.find({name:args.author})
            const books = await Book.find({author:a, genres:args.genre})
            console.log(books)
            return books
          }
          else if(args.genre){
            const books = await Book.find({genres:args.genre})
            return books
          }
          else if(args.author){
            const a = await Author.find({name: args.author})
            const books = await Book.find({author:a})
            return books
          }
          else return await Book.find({})
        },

        allAuthors: async () => { return await Author.find({}) },
        me: (root, args, context) => {
          return context.currentUser
        }
    },

    Author: {
        bookCount: async (root) => {
            /*
            return books.filter(
                b => b.author === root.name
            ).length
            */
            const author = await Author.find({name:root.name})
            const allBooks = await Book.find({author:author}) 
            return allBooks.length
        }
    },

    Book: {
      author: async (root) => {
        return  await Author.findById(root.author)
      }
    },

    Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        if(!currentUser) {
          throw new AuthenticationError('not authenticated')
        }
        
        const a = await Author.find({name:args.author})
        console.log(a)
        try{
          if(a.length === 0){
            let newAuthor = new Author({name:args.author})
            console.log('111111111')
            let newBook = new Book({genres: args.genres, author:newAuthor, 
              published: args.published, title: args.title,
            })
            await newAuthor.save()
            await newBook.save()
            pubsub.publish('BOOK_ADDED', {bookAdded: newBook})
            return newBook
          }
          else{
            console.log('22222222222')
            let newBook = new Book({genres: args.genres, author:a[0], 
              published: args.published, title: args.title,
            })
            console.log(newBook)
            await newBook.save()
            return newBook
          }
        }
        catch(error){
          
          throw new UserInputError(error.message, {
            invalidArgs:args,
          })
        }

        
        
     },
     editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      try{
        const author = await Author.findOne({name:args.name}) 
        if(!author){
          return null
        }
        author.born = args.setBornTo
        return await author.save()
      }
      catch(error){
        throw new UserInputError(error.message, {invalidArgs:args})
      }
      
     },

     createUser: async (root, args) => {
       const user = new User({username: args.username, favoriteGenre: args.favoriteGenre})
       return await user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
     },

     login: async (root, args) => {
       const user = await User.findOne({username:args.username})
       if( !user || args.password !== 'salis') {
         throw new UserInputError('wrong credentials')
       }

       const userForToken = {
         username: user.username,
         id: user._id,
       }

       return {value: jwt.sign(userForToken, JWT_SECRET)}
     },
   },
   Subscription: {
     bookAdded: {
       subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
     }
   }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith("bearer ")){
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      
      const currentUser = await User.findById(decodedToken.id)
      return {currentUser}
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
