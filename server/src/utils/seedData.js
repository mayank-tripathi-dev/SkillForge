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

    const instructorUser1 = await User.create({
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

    const instructorUser3 = await User.create({
      name: 'Dr. Aris Thorne',
      email: 'aris@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    });

    const adminUser = await User.create({
      name: 'Admin Chief',
      email: 'admin@skillforge.com',
      password: hashedPassword,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    });

    console.log('Creating 10 high-quality dummy technical courses...');

    const sampleVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    const course1 = await Course.create({
      title: 'Advanced React & Next.js Architecture',
      description: 'Master enterprise Next.js 14 App Router, Server Components, Server Actions, Zustand state management, and edge rendering patterns.',
      price: 129,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser1._id,
      category: 'Development',
      level: 'Advanced',
      badge: 'Bestseller',
      rating: 4.9,
      ratingCount: 1420,
      published: true,
      sections: [
        {
          sectionId: 'sec_1_1',
          title: 'Section 1: Next.js 14 Fundamentals & App Router',
          order: 1,
          lessons: [
            {
              lessonId: 'les_1_1',
              title: 'Lesson 1: React 18 Server Components Deep Dive',
              videoUrl: sampleVideo,
              duration: '14:20',
              order: 1,
              freePreview: true,
            },
            {
              lessonId: 'les_1_2',
              title: 'Lesson 2: Nested Layouts, Templates, & Parallel Routes',
              videoUrl: sampleVideo,
              duration: '18:45',
              order: 2,
              freePreview: false,
            },
          ],
        },
        {
          sectionId: 'sec_1_2',
          title: 'Section 2: Server Actions & Mutating Data',
          order: 2,
          lessons: [
            {
              lessonId: 'les_1_3',
              title: 'Lesson 3: Building Type-Safe Server Actions with Zod',
              videoUrl: sampleVideo,
              duration: '22:10',
              order: 1,
              freePreview: false,
            },
            {
              lessonId: 'les_1_4',
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
      description: 'Architect scalable UI component libraries with Tailwind CSS, Radix Primitives, motion design, glassmorphism, and accessible tokens.',
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
          sectionId: 'sec_2_1',
          title: 'Section 1: Foundations of Design Tokens',
          order: 1,
          lessons: [
            {
              lessonId: 'les_2_1',
              title: 'Lesson 1: Crafting Color & Typography Token Systems',
              videoUrl: sampleVideo,
              duration: '12:00',
              order: 1,
              freePreview: true,
            },
            {
              lessonId: 'les_2_2',
              title: 'Lesson 2: Accessible Focus Rings & Dynamic Contrast',
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
      description: 'Build production RAG pipelines, custom AI agents, vector database search with Pinecone, and LangChain Node integrations.',
      price: 149,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser3._id,
      category: 'Development',
      level: 'Advanced',
      badge: 'Hot',
      rating: 4.88,
      ratingCount: 750,
      published: true,
      sections: [
        {
          sectionId: 'sec_3_1',
          title: 'Section 1: Vector Embeddings & RAG Architectures',
          order: 1,
          lessons: [
            {
              lessonId: 'les_3_1',
              title: 'Lesson 1: Introduction to Vector Similarity Search',
              videoUrl: sampleVideo,
              duration: '20:15',
              order: 1,
              freePreview: true,
            },
            {
              lessonId: 'les_3_2',
              title: 'Lesson 2: Building Autonomous Multi-Step Tool Agents',
              videoUrl: sampleVideo,
              duration: '25:30',
              order: 2,
              freePreview: false,
            },
          ],
        },
      ],
    });

    const course4 = await Course.create({
      title: 'Full-Stack Node.js Microservices Masterclass',
      description: 'Learn event-driven microservices using Docker, RabbitMQ, Redis caching, gRPC, and Express API Gateways.',
      price: 119,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser1._id,
      category: 'IT & Software',
      level: 'Intermediate',
      badge: 'Featured',
      rating: 4.75,
      ratingCount: 640,
      published: true,
      sections: [
        {
          sectionId: 'sec_4_1',
          title: 'Section 1: Microservices Architecture Patterns',
          order: 1,
          lessons: [
            {
              lessonId: 'les_4_1',
              title: 'Lesson 1: Decomposing Monoliths into Decoupled Services',
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
      description: 'Master modern CSS layout features including container queries, subgrid, view transitions, and custom canvas micro-pixel effects.',
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
          sectionId: 'sec_5_1',
          title: 'Section 1: Modern CSS Layout Engines',
          order: 1,
          lessons: [
            {
              lessonId: 'les_5_1',
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

    const course6 = await Course.create({
      title: 'Cloud Native Kubernetes & DevOps Pipeline',
      description: 'Deploy production Kubernetes clusters, GitOps pipelines with ArgoCD, Terraform infrastructure as code, and Prometheus monitoring.',
      price: 139,
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser3._id,
      category: 'IT & Software',
      level: 'Advanced',
      badge: 'Bestseller',
      rating: 4.96,
      ratingCount: 1120,
      published: true,
      sections: [
        {
          sectionId: 'sec_6_1',
          title: 'Section 1: Production Kubernetes & Helm Charts',
          order: 1,
          lessons: [
            {
              lessonId: 'les_6_1',
              title: 'Lesson 1: Deploying StatefulSets & Ingress Controllers',
              videoUrl: sampleVideo,
              duration: '21:40',
              order: 1,
              freePreview: true,
            },
          ],
        },
      ],
    });

    const course7 = await Course.create({
      title: 'Python Data Structures & Algorithmic Problem Solving',
      description: 'Ace technical coding interviews with deep dives into Trees, Graphs, Dynamic Programming, Heap/Priority Queues, and System Design.',
      price: 49,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser1._id,
      category: 'Development',
      level: 'Beginner',
      badge: 'Hot',
      rating: 4.89,
      ratingCount: 2150,
      published: true,
      sections: [
        {
          sectionId: 'sec_7_1',
          title: 'Section 1: Graph Algorithms & BFS/DFS Patterns',
          order: 1,
          lessons: [
            {
              lessonId: 'les_7_1',
              title: 'Lesson 1: Topological Sort & Cycle Detection',
              videoUrl: sampleVideo,
              duration: '16:45',
              order: 1,
              freePreview: true,
            },
          ],
        },
      ],
    });

    const course8 = await Course.create({
      title: 'High-Performance Machine Learning Pipelines',
      description: 'Build enterprise PyTorch models, MLops feature stores with Feast, distributed training with Ray, and Model Monitoring.',
      price: 159,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser3._id,
      category: 'Data Science',
      level: 'Advanced',
      badge: 'Bestseller',
      rating: 4.94,
      ratingCount: 890,
      published: true,
      sections: [
        {
          sectionId: 'sec_8_1',
          title: 'Section 1: Distributed Model Training',
          order: 1,
          lessons: [
            {
              lessonId: 'les_8_1',
              title: 'Lesson 1: Data Parallelism with PyTorch DDP',
              videoUrl: sampleVideo,
              duration: '24:10',
              order: 1,
              freePreview: true,
            },
          ],
        },
      ],
    });

    const course9 = await Course.create({
      title: 'Modern Product Management for Tech Leads',
      description: 'Bridge engineering and product design. Master user story mapping, product analytics, roadmap prioritization, and A/B testing.',
      price: 89,
      thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser2._id,
      category: 'Business',
      level: 'Intermediate',
      badge: 'Featured',
      rating: 4.82,
      ratingCount: 430,
      published: true,
      sections: [
        {
          sectionId: 'sec_9_1',
          title: 'Section 1: Product Strategy & Roadmapping',
          order: 1,
          lessons: [
            {
              lessonId: 'les_9_1',
              title: 'Lesson 1: Defining Core Product Metrics & OKRs',
              videoUrl: sampleVideo,
              duration: '15:20',
              order: 1,
              freePreview: true,
            },
          ],
        },
      ],
    });

    const course10 = await Course.create({
      title: 'Growth Marketing & Technical SEO for Startups',
      description: 'Drive organic growth with technical SEO audits, schema markup, programatic content generation, and high-converting landing pages.',
      price: 69,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      instructor: instructorUser2._id,
      category: 'Marketing',
      level: 'Beginner',
      badge: 'Updated',
      rating: 4.79,
      ratingCount: 320,
      published: true,
      sections: [
        {
          sectionId: 'sec_10_1',
          title: 'Section 1: Technical SEO Architecture',
          order: 1,
          lessons: [
            {
              lessonId: 'les_10_1',
              title: 'Lesson 1: Optimizing Core Web Vitals & Server Performance',
              videoUrl: sampleVideo,
              duration: '13:50',
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
      paymentMethod: 'demo_checkout',
    });

    await Progress.create({
      student: studentUser._id,
      course: course1._id,
      completedLessons: ['les_1_1'],
      completionPercentage: 25,
      lastAccessedLesson: 'les_1_1',
    });

    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
