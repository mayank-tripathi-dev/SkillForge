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
    console.log('Connecting to MongoDB for seeding extensive dataset...');
    await mongoose.connect(connStr);

    console.log('Clearing existing database...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});

    console.log('Creating demo users and instructors...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Students
    const studentUser1 = await User.create({
      name: 'Alex Rivera',
      email: 'student@skillforge.com',
      password: hashedPassword,
      role: 'student',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const studentUser2 = await User.create({
      name: 'Jessica Chen',
      email: 'jessica@skillforge.com',
      password: hashedPassword,
      role: 'student',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    });

    const studentUser3 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@skillforge.com',
      password: hashedPassword,
      role: 'student',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    });

    // Instructors
    const instructor1 = await User.create({
      name: 'Marcus Vance',
      email: 'instructor@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    const instructor2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    });

    const instructor3 = await User.create({
      name: 'Dr. Aris Thorne',
      email: 'aris@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    });

    const instructor4 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.j@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    });

    const instructor5 = await User.create({
      name: 'David Kim',
      email: 'david.k@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    });

    const instructor6 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.s@skillforge.com',
      password: hashedPassword,
      role: 'instructor',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    });

    // Admin
    const adminUser = await User.create({
      name: 'Admin Chief',
      email: 'admin@skillforge.com',
      password: hashedPassword,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    });

    console.log('Creating 20 comprehensive technical courses...');

    const sampleVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    const coursesData = [
      {
        title: 'Advanced React & Next.js Architecture',
        description: 'Master enterprise Next.js 14 App Router, Server Components, Server Actions, Zustand state management, and edge rendering patterns.',
        price: 129,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: 'Development',
        level: 'Advanced',
        badge: 'Bestseller',
        rating: 4.9,
        ratingCount: 1420,
        published: true,
      },
      {
        title: 'Design Systems & Micro-Interactions',
        description: 'Architect scalable UI component libraries with Tailwind CSS, Radix Primitives, motion design, glassmorphism, and accessible tokens.',
        price: 99,
        thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: 'Design',
        level: 'Intermediate',
        badge: 'Updated',
        rating: 4.95,
        ratingCount: 980,
        published: true,
      },
      {
        title: 'AI & LLM Systems Engineering with Node.js',
        description: 'Build production RAG pipelines, custom AI agents, vector database search with Pinecone, and LangChain Node integrations.',
        price: 149,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
        instructor: instructor3._id,
        category: 'Development',
        level: 'Advanced',
        badge: 'Hot',
        rating: 4.88,
        ratingCount: 750,
        published: true,
      },
      {
        title: 'Full-Stack Node.js Microservices Masterclass',
        description: 'Learn event-driven microservices using Docker, RabbitMQ, Redis caching, gRPC, and Express API Gateways.',
        price: 119,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        instructor: instructor5._id,
        category: 'IT & Software',
        level: 'Intermediate',
        badge: 'Featured',
        rating: 4.75,
        ratingCount: 640,
        published: true,
      },
      {
        title: 'Modern CSS, Glassmorphic UI & Animation',
        description: 'Master modern CSS layout features including container queries, subgrid, view transitions, and custom canvas micro-pixel effects.',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: 'Design',
        level: 'Beginner',
        badge: 'New',
        rating: 4.92,
        ratingCount: 310,
        published: true,
      },
      {
        title: 'Cloud Native Kubernetes & DevOps Pipeline',
        description: 'Deploy production Kubernetes clusters, GitOps pipelines with ArgoCD, Terraform infrastructure as code, and Prometheus monitoring.',
        price: 139,
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
        instructor: instructor4._id,
        category: 'IT & Software',
        level: 'Advanced',
        badge: 'Bestseller',
        rating: 4.96,
        ratingCount: 1120,
        published: true,
      },
      {
        title: 'Python Data Structures & Algorithmic Problem Solving',
        description: 'Ace technical coding interviews with deep dives into Trees, Graphs, Dynamic Programming, Heap/Priority Queues, and System Design.',
        price: 49,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        instructor: instructor5._id,
        category: 'Development',
        level: 'Beginner',
        badge: 'Hot',
        rating: 4.89,
        ratingCount: 2150,
        published: true,
      },
      {
        title: 'High-Performance Machine Learning Pipelines',
        description: 'Build enterprise PyTorch models, MLops feature stores with Feast, distributed training with Ray, and Model Monitoring.',
        price: 159,
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
        instructor: instructor6._id,
        category: 'Data Science',
        level: 'Advanced',
        badge: 'Bestseller',
        rating: 4.94,
        ratingCount: 890,
        published: true,
      },
      {
        title: 'Modern Product Management for Tech Leads',
        description: 'Bridge engineering and product design. Master user story mapping, product analytics, roadmap prioritization, and A/B testing.',
        price: 89,
        thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: 'Business',
        level: 'Intermediate',
        badge: 'Featured',
        rating: 4.82,
        ratingCount: 430,
        published: true,
      },
      {
        title: 'Growth Marketing & Technical SEO for Startups',
        description: 'Drive organic growth with technical SEO audits, schema markup, programatic content generation, and high-converting landing pages.',
        price: 69,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: 'Marketing',
        level: 'Beginner',
        badge: 'Updated',
        rating: 4.79,
        ratingCount: 320,
        published: true,
      },
      {
        title: 'Rust Systems Programming & WebAssembly',
        description: 'Build ultra-fast memory-safe CLI engines, concurrency models with async Tokio, and high-performance WebAssembly browser modules.',
        price: 119,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        instructor: instructor5._id,
        category: 'Development',
        level: 'Advanced',
        badge: 'Hot',
        rating: 4.97,
        ratingCount: 610,
        published: true,
      },
      {
        title: 'Data Engineering with Apache Spark & Kafka',
        description: 'Stream real-time big data pipelines using Kafka topics, Spark Streaming, Parquet storage engines, and AWS Redshift data warehouses.',
        price: 139,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        instructor: instructor6._id,
        category: 'Data Science',
        level: 'Intermediate',
        badge: 'Bestseller',
        rating: 4.86,
        ratingCount: 780,
        published: true,
      },
      {
        title: 'Figma UI/UX Design System Masterclass',
        description: 'Design responsive auto-layout components, interactive prototypes, design system documentation, and developer handoff specs.',
        price: 79,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: 'Design',
        level: 'Beginner',
        badge: 'Featured',
        rating: 4.91,
        ratingCount: 1540,
        published: true,
      },
      {
        title: 'AWS Certified Solutions Architect Bootcamp',
        description: 'Master VPC peering, IAM security policies, EC2 auto-scaling, Serverless Lambda, DynamoDB, and CloudFront CDN distribution.',
        price: 129,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        instructor: instructor4._id,
        category: 'IT & Software',
        level: 'Intermediate',
        badge: 'Bestseller',
        rating: 4.93,
        ratingCount: 2890,
        published: true,
      },
      {
        title: 'Go (Golang) Microservices & Concurrent Systems',
        description: 'Build production REST APIs, gRPC services, goroutine worker pools, channels concurrency, and Dockerized microservice deployments.',
        price: 109,
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: 'Development',
        level: 'Intermediate',
        badge: 'Updated',
        rating: 4.88,
        ratingCount: 920,
        published: true,
      },
      {
        title: 'SaaS Startup Business & Financial Modeling',
        description: 'Build SaaS financial models, calculating LTV/CAC, subscription metrics, unit economics, fundraising decks, and pricing strategies.',
        price: 99,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: 'Business',
        level: 'Beginner',
        badge: 'New',
        rating: 4.84,
        ratingCount: 390,
        published: true,
      },
      {
        title: 'Modern TypeScript & Generics Masterclass',
        description: 'Deep dive into advanced mapped types, conditional types, template literal types, AST transformers, and type-safe SDK creation.',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1516116211223-4c7141467477?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: 'Development',
        level: 'Advanced',
        badge: 'Hot',
        rating: 4.98,
        ratingCount: 1840,
        published: true,
      },
      {
        title: 'Applied Deep Learning with PyTorch & Vision',
        description: 'Implement Convolutional Networks, ResNet architectures, Vision Transformers (ViT), object detection with YOLO, and GAN models.',
        price: 149,
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
        instructor: instructor3._id,
        category: 'Data Science',
        level: 'Advanced',
        badge: 'Bestseller',
        rating: 4.95,
        ratingCount: 670,
        published: true,
      },
      {
        title: 'Cybersecurity & Ethical Hacking Essentials',
        description: 'Learn web application pentesting, OWASP Top 10 vulnerabilities, Metasploit, Wireshark packet analysis, and network defense.',
        price: 119,
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        instructor: instructor4._id,
        category: 'IT & Software',
        level: 'Beginner',
        badge: 'Updated',
        rating: 4.87,
        ratingCount: 1430,
        published: true,
      },
      {
        title: 'Performance Optimization for Web Applications',
        description: 'Master Core Web Vitals (LCP, INP, CLS), memory leak debugging, Chrome DevTools profiling, code splitting, and web workers.',
        price: 89,
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: 'Development',
        level: 'Intermediate',
        badge: 'Featured',
        rating: 4.91,
        ratingCount: 520,
        published: true,
      },
    ];

    const createdCourses = [];

    for (const data of coursesData) {
      const c = await Course.create({
        ...data,
        sections: [
          {
            sectionId: `sec_${Date.now()}_1`,
            title: 'Section 1: Architecture & Core Foundations',
            order: 1,
            lessons: [
              {
                lessonId: `les_${Date.now()}_1`,
                title: `Lesson 1: Introduction & Module Setup for ${data.title}`,
                videoUrl: sampleVideo,
                duration: '14:20',
                order: 1,
                freePreview: true,
              },
              {
                lessonId: `les_${Date.now()}_2`,
                title: 'Lesson 2: Core Concepts & Implementation Strategies',
                videoUrl: sampleVideo,
                duration: '18:45',
                order: 2,
                freePreview: false,
              },
            ],
          },
          {
            sectionId: `sec_${Date.now()}_2`,
            title: 'Section 2: Production Deployment & Practice Project',
            order: 2,
            lessons: [
              {
                lessonId: `les_${Date.now()}_3`,
                title: 'Lesson 3: Advanced Optimization & Hands-on Coding',
                videoUrl: sampleVideo,
                duration: '22:10',
                order: 1,
                freePreview: false,
              },
              {
                lessonId: `les_${Date.now()}_4`,
                title: 'Lesson 4: Summary, Best Practices & Production Checklist',
                videoUrl: sampleVideo,
                duration: '16:30',
                order: 2,
                freePreview: false,
              },
            ],
          },
        ],
      });
      createdCourses.push(c);
    }

    console.log('Creating diverse student enrollments and progress records...');

    // Enroll Alex Rivera in 4 courses with distinct completion percentages
    const alexCourses = [createdCourses[0], createdCourses[1], createdCourses[4], createdCourses[6]];

    for (let i = 0; i < alexCourses.length; i++) {
      const course = alexCourses[i];
      await Enrollment.create({
        student: studentUser1._id,
        course: course._id,
        amount: course.price,
        paymentStatus: 'completed',
        paymentMethod: 'demo_checkout',
      });

      const pcts = [100, 50, 75, 0];
      const completedIds = i === 0 ? ['les_1_1', 'les_1_2', 'les_1_3', 'les_1_4'] : i === 1 ? ['les_2_1'] : i === 2 ? ['les_5_1'] : [];

      await Progress.create({
        student: studentUser1._id,
        course: course._id,
        completedLessons: completedIds,
        completionPercentage: pcts[i],
        lastAccessedLesson: completedIds[0] || null,
      });
    }

    // Enroll Jessica Chen
    await Enrollment.create({
      student: studentUser2._id,
      course: createdCourses[2]._id,
      amount: createdCourses[2].price,
      paymentStatus: 'completed',
      paymentMethod: 'demo_checkout',
    });

    // Enroll Rahul Verma
    await Enrollment.create({
      student: studentUser3._id,
      course: createdCourses[5]._id,
      amount: createdCourses[5].price,
      paymentStatus: 'completed',
      paymentMethod: 'demo_checkout',
    });

    console.log('Extensive dataset seeded successfully (20 courses, 6 instructors, 3 students, 1 admin, 6 enrollments)!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
