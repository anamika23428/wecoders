const users = [];

// Join user to chat
function userJoin(id, username, room) {
  // Check if user already exists in the room
  const existingUser = users.find(user => user.username === username && user.room === room);
  
  if (existingUser) {
    console.log(`User ${username} already exists in room ${room}`);
    console.log("Current users in room:", getRoomUsers(room));
    return existingUser; // Return existing user instead of adding a duplicate
  }

  // If the user doesn't exist, add them
  const user = { id, username, room };
  users.push(user);
  
  console.log("Updated users list:", users); // 🔍 Log all users to debug
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