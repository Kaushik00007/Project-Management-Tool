import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Task title is required"], 
      minlength: [3, "Title must be at least 3 characters"], 
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: { 
      type: String, 
      required: [true, "Description is required"], 
      minlength: [5, "Description must be at least 5 characters"], 
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    dueDate: { 
      type: Date, 
      required: [true, "Due date is required"], 
      validate: {
        validator: function (value) {
          return value >= new Date(new Date().setHours(0, 0, 0, 0)); 
        },
        message: "Due date must be today or in the future"
      }
    },
    status: { 
      type: String, 
      enum: ['To Do', 'In Progress', 'Done'], 
      default: 'To Do',
      index: true  
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, "User ID is required"], 
      index: true 
    }
  },
  { timestamps: true }
);

TaskSchema.pre('save', function (next) {
  console.log(`Saving task: ${this.title} for user: ${this.userId}`);
  next();
});

export default mongoose.model('Task', TaskSchema);
