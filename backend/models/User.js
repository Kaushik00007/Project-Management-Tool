import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [64, 'Password cannot exceed 64 characters'],
      select: false, 
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error('Error hashing password:', err);
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const user = await mongoose.model('User').findById(this._id).select('+password');
    if (!user) return false;
    return bcrypt.compare(candidatePassword, user.password);
  } catch (err) {
    console.error('Error comparing passwords:', err);
    return false;
  }
};

UserSchema.post('save', function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error('Email already exists. Please use a different email.'));
  } else {
    next(error);
  }
});

export default mongoose.model('User', UserSchema);
