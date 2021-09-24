import connectDB from './config/db.js';
import dotenv from 'dotenv';

import User from './models/userModel.js';
import List from './models/listModel.js';

import users from './data/users.js';
import lists from './data/lists.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await List.deleteMany();

    const createdUsers = await User.insertMany(users);

    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];

      for (let j = 0; j < lists.length; j++) {
        const list = lists[j];

        const createdList = await List.create({ ...list, user_id: user._id });

        user.lists.push(createdList._id);
        await user.save();
      }
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await List.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
