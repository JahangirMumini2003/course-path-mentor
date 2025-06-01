
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, X } from 'lucide-react';
import { Test } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';

interface TestModalProps {
  test: Test;
  onClose: () => void;
  onComplete: () => void;
}

export const TestModal: React.FC<TestModalProps> = ({ test, onClose, onComplete }) => {
  const { user } = useAuth();
  const { submitTestResult } = useData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Завершить тест
      finishTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishTest = () => {
    let correctAnswers = 0;
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / test.questions.length) * 100);
    const testPassed = finalScore >= test.passingScore;

    setScore(finalScore);
    setPassed(testPassed);
    setShowResults(true);

    // Сохранить результат
    if (user) {
      submitTestResult({
        userId: user.id,
        testId: test.id,
        courseId: test.courseId,
        score: finalScore,
        passed: testPassed,
      });
    }
  };

  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const currentQ = test.questions[currentQuestion];

  if (showResults) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {passed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <X className="w-6 h-6 text-red-500" />
              )}
              <span>Результаты теста</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{score}%</div>
              <div className={`text-lg ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {passed ? 'Тест пройден!' : 'Тест не пройден'}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Проходной балл: {test.passingScore}%
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600 mb-2">
                Правильных ответов: {Math.round((score / 100) * test.questions.length)} из {test.questions.length}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Закрыть
              </Button>
              <Button onClick={onComplete} className="flex-1">
                {passed ? 'Получить сертификат' : 'Продолжить'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{test.title}</DialogTitle>
          <DialogDescription>
            Вопрос {currentQuestion + 1} из {test.questions.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Progress value={progress} className="w-full" />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion] === index
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion] === index
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`} />
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Назад
            </Button>

            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
            >
              {currentQuestion === test.questions.length - 1 ? 'Завершить тест' : 'Далее'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
