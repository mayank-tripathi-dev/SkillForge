require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillforge';
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(connStr);

    console.log('Clearing existing database...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});

    console.log('Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const studentUser = await User.create({
      name: 'Alex Rivera',
      email: 'student@skillforge.com',
      password: hashedPassword,
      role: 'student',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const instructorUser = await User.create({
      name: 'Marcus Vance',
      email: 'instructor@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    const instructorUser2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    });

    const adminUser = await User.create({
      name: 'Admin Chief',
      email: 'admin@skillforge.com',
      password: hashedPassword,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    });

    console.log('Creating demo courses...');

    const sampleVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    const course1 = await Course.create({
      title: 'Advanced React & Next.js Architecture',
      description: 'Master enterprise-level Next.js 14 App Router, Server Components, Server Actions, state management with Zustand, and performant server rendering patterns.',
      price: 129,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser._id,
      category: 'Development',
      level: 'Advanced',
      badge: 'Bestseller',
      rating: 4.9,
      ratingCount: 1420,
      published: true,
      sections: [
        {
          sectionId: 'sec_1',
          title: 'Section 1: Next.js 14 Fundamentals & App Router',
          order: 1,
          lessons: [
            {
              lessonId: 'les_1',
              title: 'Lesson 1: React 18 Server Components Explained',
              videoUrl: sampleVideo,
              duration: '14:20',
              order: 1,
              freePreview: true,
            },
            {
              lessonId: 'les_2',
              title: 'Lesson 2: App Router Layouts, Pages, and Slots',
              videoUrl: sampleVideo,
              duration: '18:45',
              order: 2,
              freePreview: false,
            },
          ],
        },
        {
          sectionId: 'sec_2',
          title: 'Section 2: Server Actions & Mutating Data',
          order: 2,
          lessons: [
            {
              lessonId: 'les_3',
              title: 'Lesson 3: Building Type-Safe Server Actions',
              videoUrl: sampleVideo,
              duration: '22:10',
              order: 1,
              freePreview: false,
            },
            {
              lessonId: 'les_4',
              title: 'Lesson 4: Optimistic UI Updates & Error Boundaries',
              videoUrl: sampleVideo,
              duration: '16:30',
              order: 2,
              freePreview: false,
            },
          ],
        },
      ],
    });

    const course2 = await Course.create({
      title: 'Design Systems & Micro-Interactions',
      description: 'Architect scalable UI component libraries with Tailwind CSS, Radix Primitives, motion design, and accessible tokens.',
      price: 99,
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser2._id,
      category: 'Design',
      level: 'Intermediate',
      badge: 'Updated',
      rating: 4.95,
      ratingCount: 980,
      published: true,
      sections: [
        {
          sectionId: 'sec_21',
          title: 'Section 1: Foundations of Design Tokens',
          order: 1,
          lessons: [
            {
              lessonId: 'les_21',
              title: 'Lesson 1: Crafting Color & Typography Systems',
              videoUrl: sampleVideo,
              duration: '12:00',
              order: 1,
              freePreview: true,
            },
            {
              lessonId: 'les_22',
              title: 'Lesson 2: Accessible Focus States & Contrast',
              videoUrl: sampleVideo,
              duration: '15:40',
              order: 2,
              freePreview: false,
            },
          ],
        },
      ],
    });

    const course3 = await Course.create({
      title: 'AI & LLM Systems Engineering with Node.js',
      description: 'Build production RAG pipelines, custom AI agents, vector database search with Pinecone, and OpenAI API integrations.',
      price: 149,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser._id,
      category: 'Development',
      level: 'Advanced',
      badge: 'Hot',
      rating: 4.88,
      ratingCount: 750,
      published: true,
      sections: [
        {
          sectionId: 'sec_31',
          title: 'Section 1: Vector Embeddings & RAG Architectures',
          order: 1,
          lessons: [
            {
              lessonId: 'les_31',
              title: 'Lesson 1: Introduction to Vector Similarity Search',
              videoUrl: sampleVideo,
              duration: '20:15',
              order: 1,
              freePreview: true,
            },
          ],
        },
      ],
    });

    const course4 = await Course.create({
      title: 'Full-Stack Node.js Microservices Masterclass',
      description: 'Learn event-driven microservices using Docker, RabbitMQ, Redis, gRPC, and Express API Gateways.',
      price: 119,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser._id,
      category: 'IT & Software',
      level: 'Intermediate',
      badge: 'Featured',
      rating: 4.75,
      ratingCount: 640,
      published: true,
      sections: [
        {
          sectionId: 'sec_41',
          title: 'Section 1: Microservices vs Monoliths',
          order: 1,
          lessons: [
            {
              lessonId: 'les_41',
              title: 'Lesson 1: Decomposing a Monolith into Services',
              videoUrl: sampleVideo,
              duration: '19:00',
              order: 1,
              freePreview: true,
            },
          ],
        },
      ],
    });

    const course5 = await Course.create({
      title: 'Modern CSS, Glassmorphic UI & Animation',
      description: 'Master modern CSS features including subgrid, CSS container queries, view transitions, and custom canvas micro-interactions.',
      price: 0,
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser2._id,
      category: 'Design',
      level: 'Beginner',
      badge: 'New',
      rating: 4.92,
      ratingCount: 310,
      published: true,
      sections: [
        {
          sectionId: 'sec_51',
          title: 'Section 1: Modern CSS Layout Engines',
          order: 1,
          lessons: [
            {
              lessonId: 'les_51',
              title: 'Lesson 1: Container Queries & Flexbox Grid Secrets',
              videoUrl: sampleVideo,
              duration: '11:20',
              order: 1,
              freePreview: true,
            },
          ],
        },
      ],
    });

    console.log('Creating sample student enrollment & progress...');

    await Enrollment.create({
      student: studentUser._id,
      course: course1._id,
      amount: course1.price,
      paymentStatus: 'completed',
      paymentMethod: 'demo_card',
    });

    await Progress.create({
      student: studentUser._id,
      course: course1._id,
      completedLessons: ['les_1'],
      completionPercentage: 25,
      lastAccessedLesson: 'les_1',
    });

    console.log('Seed process finished successfully!');
    console.log('\n--- DEMO CREDENTIALS ---');
    console.log('Student:    student@skillforge.com   / password123');
    console.log('Instructor: instructor@skillforge.com / password123');
    console.log('Admin:      admin@skillforge.com      / password123');
    console.log('------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
