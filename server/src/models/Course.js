const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessonId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: '10:00',
  },
  order: {
    type: Number,
    default: 1,
  },
  freePreview: {
    type: Boolean,
    default: false,
  }
});

const sectionSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 1,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: 0,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Development', 'Design', 'Business', 'Marketing', 'IT & Software', 'Data Science'],
      default: 'Development',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    published: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      enum: ['Bestseller', 'Updated', 'Hot', 'New', 'Featured', 'None'],
      default: 'None',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    ratingCount: {
      type: Number,
      default: 42,
    },
    sections: [sectionSchema],
  },
  {
    timestamps: true,
  }
);

// Virtual for total lesson count
courseSchema.virtual('lessonCount').get(function () {
  if (!this.sections) return 0;
  return this.sections.reduce((acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0), 0);
});

// Ensure virtuals are serialized
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
