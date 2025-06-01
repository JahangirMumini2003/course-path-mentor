
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, PlayCircle, CheckCircle, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { VideoPlayer } from './VideoPlayer';
import { TestModal } from './TestModal';
import { CertificateModal } from './CertificateModal';

export const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, lessons, tests, enrollments, testResults } = useData();
  
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showTest, setShowTest] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const course = courses.find(c => c.id === courseId);
  const courseLessons = lessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
  const courseTest = tests.find(t => t.courseId === courseId);
  const enrollment = enrollments.find(e => e.courseId === courseId && e.userId === user?.id);
  const userTestResult = testResults.find(r => r.courseId === courseId && r.userId === user?.id);

  useEffect(() => {
    if (courseLessons.length > 0 && !selectedLesson) {
      setSelectedLesson(courseLessons[0].id);
    }
  }, [courseLessons, selectedLesson]);

  useEffect(() => {
    const saved = localStorage.getItem(`completedLessons-${courseId}-${user?.id}`);
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, [courseId, user?.id]);

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      localStorage.setItem(`completedLessons-${courseId}-${user?.id}`, JSON.stringify(updated));
    }
  };

  const handleTakeTest = () => {
    setShowTest(true);
  };

  const handleTestComplete = () => {
    setShowTest(false);
    if (userTestResult?.passed) {
      setShowCertificate(true);
    }
  };

  const allLessonsCompleted = courseLessons.every(lesson => completedLessons.includes(lesson.id));
  const canTakeTest = allLessonsCompleted && courseTest && !userTestResult;
  const canViewCertificate = userTestResult?.passed;

  const selectedLessonData = courseLessons.find(l => l.id === selectedLesson);
  const progress = courseLessons.length > 0 ? (completedLessons.length / courseLessons.length) * 100 : 0;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Курс не найден</h1>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600">{course.instructor}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Прогресс курса</div>
              <div className="flex items-center space-x-2">
                <Progress value={progress} className="w-32" />
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список уроков */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Уроки курса</CardTitle>
                <CardDescription>{courseLessons.length} уроков</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {courseLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedLesson === lesson.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedLesson(lesson.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {completedLessons.includes(lesson.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{lesson.title}</div>
                          <div className="text-xs text-gray-500">{lesson.duration}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {allLessonsCompleted && (
                  <div className="pt-4 border-t">
                    {canTakeTest && (
                      <Button onClick={handleTakeTest} className="w-full mb-2">
                        <Trophy className="w-4 h-4 mr-2" />
                        Пройти тест
                      </Button>
                    )}
                    {canViewCertificate && (
                      <Button 
                        onClick={() => setShowCertificate(true)} 
                        variant="outline" 
                        className="w-full"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Получить сертификат
                      </Button>
                    )}
                    {userTestResult && !userTestResult.passed && (
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">
                          Тест не пройден. Результат: {userTestResult.score}%
                        </p>
                        <Button onClick={handleTakeTest} size="sm" className="mt-2">
                          Пересдать тест
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Видео плеер */}
          <div className="lg:col-span-2">
            {selectedLessonData && (
              <VideoPlayer 
                lesson={selectedLessonData}
                onComplete={() => handleLessonComplete(selectedLessonData.id)}
                isCompleted={completedLessons.includes(selectedLessonData.id)}
              />
            )}
          </div>
        </div>
      </div>

      {showTest && courseTest && (
        <TestModal
          test={courseTest}
          onClose={() => setShowTest(false)}
          onComplete={handleTestComplete}
        />
      )}

      {showCertificate && (
        <CertificateModal
          course={course}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
