const { AuthenticationError } = require('apollo-server-express'); // https://www.apollographql.com/docs/apollo-server/data/errors
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// resolvers is an object that contains all of out methods that are going to resolve to some result
// querys will be the equivalent to a GET request
// mutations are going to be anything that mutates an internal/external datasource as your database or any internal state
// equivalent for any DELETE,POST,PUT
// they have to match the names in you typeDefs and the return type
module.exports = {
    Query:{
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
      
              return userData;
            }
            // for the list of errors and custom errors here  https://www.apollographql.com/docs/apollo-server/data/errors
            throw new AuthenticationError('Not logged in');
          },
    },
    Mutation:{
        // resolver are just methods 
        // they can have any of the syntax arrow or not arrow functions
            async addUser(parent, args){
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
            return { token, user };
          },
          saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: bookData } },
                { new: true }
              );
      
              return updatedUser;
            }
      
            throw new AuthenticationError('You need to be logged in!');
          },
          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
      
              return updatedUser;
            }
      
            throw new AuthenticationError('You need to be logged in!');
          }
        },
    }
