import connectDB from './config/db.js';
import dotenv from 'dotenv';

import User from './models/userModel.js';
import List from './models/listModel.js';
import RefreshToken from './models/refreshTokenModel.js';

import users from './data/users.js';
import lists from './data/lists.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await List.deleteMany();
    await RefreshToken.deleteMany();

    for (let i = 0; i < users.length; i++) {
      const createdUser = await User.create(users[i]);

      for (let j = 0; j < lists.length; j++) {
        const createdList = await List.create({
          ...lists[j],
          user_id: createdUser._id,
        });

        createdUser.lists.push(createdList._id);
        await createdUser.save();
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
    await RefreshToken.deleteMany();

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
