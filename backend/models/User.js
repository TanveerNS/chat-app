const { getDb } = require('../config/db');

// Function to register a new user
const registerUser = async (username) => {
  try {
    const db = getDb();
    const usersCollection = db.collection('users');
    
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return { message: 'User already exists' };
    }
    
    await usersCollection.insertOne({ username });
    console.log(`User ${username} registered`);
  } catch (err) {
    console.error('Error registering user:', err);
  }
};

// Function to get a user's friend list
const getFriendList = async (username) => {
  try {
    const db = getDb();
    const friendsCollection = db.collection('friends');
    
    const user = await friendsCollection.findOne({ username });
    if (!user) {
      // If the user doesn't exist, insert a new entry
      await friendsCollection.insertOne({ username, friends: [] });
      return [];
    }

    return user.friends || [];
  } catch (err) {
    console.error('Error retrieving friend list:', err);
    return [];
  }
};

// Function to add a friend to the user's friend list
const addFriend = async (username, friend) => {
  try {
    const db = getDb();
    const friendsCollection = db.collection('friends');
    
    // Add friend to the user's friend list
    let user = await friendsCollection.findOne({ username });
    if (!user) {
      // If the user doesn't exist, create a new entry
      await friendsCollection.insertOne({ username, friends: [friend] });
    } else {
      // If the user exists, check if the friend is already in the list
      if (!user.friends.includes(friend)) {
        user.friends.push(friend);
        await friendsCollection.updateOne({ username }, { $set: { friends: user.friends } });
      }
    }

    // Add username to the friend's friend list (making it bi-directional)
    let friendUser = await friendsCollection.findOne({ username: friend });
    if (!friendUser) {
      // If the friend doesn't exist, create a new entry
      await friendsCollection.insertOne({ username: friend, friends: [username] });
    } else {
      // If the friend exists, check if the user is already in the list
      if (!friendUser.friends.includes(username)) {
        friendUser.friends.push(username);
        await friendsCollection.updateOne({ username: friend }, { $set: { friends: friendUser.friends } });
      }
    }

    console.log(`Friendship established between ${username} and ${friend}`);
  } catch (err) {
    console.error('Error adding friend:', err);
  }
};

module.exports = { registerUser, getFriendList, addFriend };
