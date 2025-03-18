const users = [];

// Join user to chat
function userJoin(id, username, room) {
  // Validate username
  // if (!username || username.trim() === '') {
  //   console.error('Username is required');
  //   return null;
  // }

  // // Check if user already exists
  // const existingUser = users.find(user => user.id === id );
  // if (existingUser) {
  //   console.error('User already exists:', existingUser);
  //   return null;
  // }

  // Add new user
  const user = { id, username, room };
  
  users.push(user);
  console.log(users);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};