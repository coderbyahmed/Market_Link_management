import mongoose from 'mongoose';
import User from './models/User.model.js';

await mongoose.connect('mongodb+srv://codebyahmed:uzair78497732@projects.bzjnu7d.mongodb.net/MarketLinkManagement?appName=projects');

const user = await User.findOne({ email: 'farmer@demo.com' });
if (user) {
  user.isApproved = true;
  await user.save();
  console.log('Farmer approved!');
} else {
  console.log('Farmer not found');
}

await mongoose.disconnect();