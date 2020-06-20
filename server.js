'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};

//Little function to find the user based on the user id
function findUser(id){
  return users.find(user => id === user._id);
}

function findFriends(user){
  return user.friends.map( friendId => findUser(friendId));
  }

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

// Homepage handler
const handleHomePage = (req, res) => {
  res.status(200).render('./pages/homepage', {users: users});
}

//User profilepage handler
const handleProfilePage = (req, res) => {
  const _id = req.params._id;
  const user = findUser(_id);
  const friends = findFriends(user);
  res.render('./pages/profile', {
    user: user,
    friends: friends
  });
}

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .get('/', handleHomePage)

  .get('/users/:_id', handleProfilePage)

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
