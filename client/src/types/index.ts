export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt?: string;
}

export interface Lesson {
  lessonId: string;
  title: string;
  videoUrl: string;
  duration: string;
  order: number;
  freePreview?: boolean;
}

export interface Section {
  sectionId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: {
    _id: string;
    name: string;
    profileImage?: string;
    email?: string;
    role?: string;
  };
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  badge?: 'Bestseller' | 'Updated' | 'Hot' | 'New' | 'Featured' | 'None';
  rating: number;
  ratingCount: number;
  published: boolean;
  sections: Section[];
  lessonCount?: number;
  enrolledStudentsCount?: number;
  createdAt: string;
}

export interface Progress {
  completedLessons: string[];
  completionPercentage: number;
  lastAccessedLesson?: string | null;
}

export interface Enrollment {
  _id: string;
  course: Course;
  enrolledAt: string;
  amount: number;
  progress: Progress;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalAdmins: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalPlatformRevenue: number;
}

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}
