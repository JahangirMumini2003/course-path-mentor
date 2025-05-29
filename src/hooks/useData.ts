
import { useState, useEffect } from 'react';
import { Course, Enrollment, Payment, Message, Certificate } from '../types';

export const useData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    // Initialize with sample data if empty
    const savedCourses = localStorage.getItem('courses');
    if (!savedCourses) {
      const sampleCourses: Course[] = [
        {
          id: '1',
          title: 'Основы React',
          description: 'Изучите основы библиотеки React для создания современных веб-приложений',
          instructor: 'Анна Петрова',
          price: 25000,
          duration: '8 недель',
          level: 'beginner',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'JavaScript продвинутый',
          description: 'Глубокое изучение JavaScript: асинхронность, паттерны, оптимизация',
          instructor: 'Михаил Сидоров',
          price: 35000,
          duration: '12 недель',
          level: 'advanced',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('courses', JSON.stringify(sampleCourses));
      setCourses(sampleCourses);
    } else {
      setCourses(JSON.parse(savedCourses));
    }

    // Load other data
    setEnrollments(JSON.parse(localStorage.getItem('enrollments') || '[]'));
    setPayments(JSON.parse(localStorage.getItem('payments') || '[]'));
    setMessages(JSON.parse(localStorage.getItem('messages') || '[]'));
    setCertificates(JSON.parse(localStorage.getItem('certificates') || '[]'));
  }, []);

  const updateLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addCourse = (course: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    updateLocalStorage('courses', updatedCourses);
    return newCourse;
  };

  const enrollStudent = (userId: string, courseId: string) => {
    const enrollment: Enrollment = {
      id: Date.now().toString(),
      userId,
      courseId,
      status: 'active',
      progress: 0,
      enrolledAt: new Date().toISOString(),
    };
    const updatedEnrollments = [...enrollments, enrollment];
    setEnrollments(updatedEnrollments);
    updateLocalStorage('enrollments', updatedEnrollments);

    // Create payment record
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const payment: Payment = {
        id: Date.now().toString(),
        userId,
        courseId,
        amount: course.price,
        paid: 0,
        remaining: course.price,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      const updatedPayments = [...payments, payment];
      setPayments(updatedPayments);
      updateLocalStorage('payments', updatedPayments);
    }
  };

  const sendMessage = (fromUserId: string, toUserId: string, content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    updateLocalStorage('messages', updatedMessages);
  };

  return {
    courses,
    enrollments,
    payments,
    messages,
    certificates,
    addCourse,
    enrollStudent,
    sendMessage,
    setCourses,
    setEnrollments,
    setPayments,
    setMessages,
    setCertificates,
  };
};
