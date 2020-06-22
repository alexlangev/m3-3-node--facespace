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

// Handlers
const handleHomePage = (req, res) => {
  res.status(200).render('./pages/homepage', {
    users: users,
    currentUser:currentUser
  });
}

const handleProfilePage = (req, res) => {
  const _id = req.params._id;
  const user = findUser(_id);
  const friends = findFriends(user);
    res.status(200).render('./pages/profile', {
      user: user,
      friends: friends,
      currentUser:currentUser
    });
}

const handleSignIn = (req, res) => {
  res.status(200).render('./pages/signin', {
    currentUser: currentUser
  });
}

const handleName = (req, res) => {
  const firstName = req.query.firstName;
  currentUser = users.find((user) => Object.values(user).includes(firstName));
  if(currentUser === undefined) {
    res.status(404).redirect('/signin');
  } else {
    res.status(200).redirect(`users/${currentUser._id}`);
  }
  };

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
  .get('/signin', handleSignIn)
  .get('/getname', handleName)
  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
