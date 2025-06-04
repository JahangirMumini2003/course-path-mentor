
import { useState, useEffect } from 'react';
import { Course, Enrollment, Payment, Message, Certificate, Lesson, Test, TestResult } from '../types';

export const useData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

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

      // Добавим примеры уроков
      const sampleLessons: Lesson[] = [
        {
          id: '1',
          courseId: '1',
          title: 'Введение в React',
          description: 'Основные концепции React',
          videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
          duration: '15 мин',
          order: 1,
        },
        {
          id: '2',
          courseId: '1',
          title: 'Компоненты React',
          description: 'Создание и использование компонентов',
          videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
          duration: '20 мин',
          order: 2,
        },
        {
          id: '3',
          courseId: '1',
          title: 'Состояние и события',
          description: 'Работа с состоянием и обработка событий',
          videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0',
          duration: '25 мин',
          order: 3,
        },
      ];
      localStorage.setItem('lessons', JSON.stringify(sampleLessons));
      setLessons(sampleLessons);

      // Добавим пример теста
      const sampleTests: Test[] = [
        {
          id: '1',
          courseId: '1',
          title: 'Тест по основам React',
          passingScore: 70,
          questions: [
            {
              id: '1',
              question: 'Что такое React?',
              options: ['Библиотека для создания пользовательских интерфейсов', 'База данных', 'Язык программирования', 'Операционная система'],
              correctAnswer: 0,
            },
            {
              id: '2',
              question: 'Что такое JSX?',
              options: ['Язык программирования', 'Расширение синтаксиса JavaScript', 'База данных', 'Браузер'],
              correctAnswer: 1,
            },
            {
              id: '3',
              question: 'Как создать компонент в React?',
              options: ['function MyComponent() {}', 'class MyComponent {}', 'const MyComponent = () => {}', 'Все варианты верны'],
              correctAnswer: 3,
            },
          ],
        },
      ];
      localStorage.setItem('tests', JSON.stringify(sampleTests));
      setTests(sampleTests);
    } else {
      setCourses(JSON.parse(savedCourses));
    }

    // Load other data
    setEnrollments(JSON.parse(localStorage.getItem('enrollments') || '[]'));
    setPayments(JSON.parse(localStorage.getItem('payments') || '[]'));
    setMessages(JSON.parse(localStorage.getItem('messages') || '[]'));
    setCertificates(JSON.parse(localStorage.getItem('certificates') || '[]'));
    setLessons(JSON.parse(localStorage.getItem('lessons') || '[]'));
    setTests(JSON.parse(localStorage.getItem('tests') || '[]'));
    setTestResults(JSON.parse(localStorage.getItem('testResults') || '[]'));
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

  const addLesson = (lesson: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = {
      ...lesson,
      id: Date.now().toString(),
    };
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    updateLocalStorage('lessons', updatedLessons);
    return newLesson;
  };

  const updateLesson = (updatedLesson: Lesson) => {
    const updatedLessons = lessons.map(lesson => 
      lesson.id === updatedLesson.id ? updatedLesson : lesson
    );
    setLessons(updatedLessons);
    updateLocalStorage('lessons', updatedLessons);
  };

  const deleteLesson = (lessonId: string) => {
    const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
    setLessons(updatedLessons);
    updateLocalStorage('lessons', updatedLessons);
  };

  const addTest = (test: Omit<Test, 'id'>) => {
    const newTest: Test = {
      ...test,
      id: Date.now().toString(),
    };
    const updatedTests = [...tests, newTest];
    setTests(updatedTests);
    updateLocalStorage('tests', updatedTests);
    return newTest;
  };

  const submitTestResult = (testResult: Omit<TestResult, 'id' | 'answeredAt'>) => {
    const newTestResult: TestResult = {
      ...testResult,
      id: Date.now().toString(),
      answeredAt: new Date().toISOString(),
    };
    const updatedTestResults = [...testResults, newTestResult];
    setTestResults(updatedTestResults);
    updateLocalStorage('testResults', updatedTestResults);

    // Если тест пройден, выдаем сертификат
    if (newTestResult.passed) {
      const course = courses.find(c => c.id === newTestResult.courseId);
      if (course) {
        const certificate: Certificate = {
          id: Date.now().toString(),
          userId: newTestResult.userId,
          courseId: newTestResult.courseId,
          fileName: `certificate-${course.title.replace(/\s/g, '-')}.pdf`,
          downloadUrl: `#certificate-${newTestResult.courseId}`,
          issuedAt: new Date().toISOString(),
        };
        const updatedCertificates = [...certificates, certificate];
        setCertificates(updatedCertificates);
        updateLocalStorage('certificates', updatedCertificates);
      }
    }

    return newTestResult;
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
        paid: course.price,
        remaining: 0,
        status: 'completed',
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
    lessons,
    tests,
    testResults,
    addCourse,
    addLesson,
    updateLesson,
    deleteLesson,
    addTest,
    submitTestResult,
    enrollStudent,
    sendMessage,
    setCourses,
    setEnrollments,
    setPayments,
    setMessages,
    setCertificates,
    setLessons,
    setTests,
    setTestResults,
  };
};
