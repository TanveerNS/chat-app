const { getDb } = require('../config/db');

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

const getFriendList = async (username) => {
  try {
    const db = getDb();
    const friendsCollection = db.collection('friends');
    
    const user = await friendsCollection.findOne({ username });
    if (!user) {
      await friendsCollection.insertOne({ username, friends: [] });
      return [];
    }

    return user.friends || [];
  } catch (err) {
    console.error('Error retrieving friend list:', err);
    return [];
  }
};

const addFriend = async (username, friend) => {
  try {
    const db = getDb();
    const friendsCollection = db.collection('friends');
    
    let user = await friendsCollection.findOne({ username });
    if (!user) {
      await friendsCollection.insertOne({ username, friends: [friend] });
    } else {
      if (!user.friends.includes(friend)) {
        user.friends.push(friend);
        await friendsCollection.updateOne({ username }, { $set: { friends: user.friends } });
      }
    }

    let friendUser = await friendsCollection.findOne({ username: friend });
    if (!friendUser) {
      await friendsCollection.insertOne({ username: friend, friends: [username] });
    } else {
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
