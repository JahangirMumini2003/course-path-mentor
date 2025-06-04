export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
  avatar?: string;
  createdAt: string;
  isApproved?: boolean; // Для подтверждения админов
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  image?: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  completed?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Test {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
  passingScore: number;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  courseId: string;
  score: number;
  passed: boolean;
  answeredAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  paid: number;
  remaining: number;
  status: 'pending' | 'partial' | 'completed';
  createdAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  fileName: string;
  downloadUrl: string;
  issuedAt: string;
}
