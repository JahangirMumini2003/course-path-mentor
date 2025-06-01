
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { Course, Question } from '../../types';
import { useData } from '../../hooks/useData';

interface TestManagementProps {
  courses: Course[];
}

export const TestManagement: React.FC<TestManagementProps> = ({ courses }) => {
  const { tests, addTest } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    passingScore: 70,
    questions: [] as Question[],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });

  const handleAddQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt.trim())) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        question: currentQuestion.question,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
      };
      
      setFormData({
        ...formData,
        questions: [...formData.questions, newQuestion],
      });
      
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      });
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== questionId),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || formData.questions.length === 0) return;

    addTest({
      courseId: selectedCourse,
      title: formData.title,
      passingScore: formData.passingScore,
      questions: formData.questions,
    });

    setFormData({
      title: '',
      passingScore: 70,
      questions: [],
    });
    setShowAddForm(false);
  };

  const courseTests = selectedCourse 
    ? tests.filter(t => t.courseId === selectedCourse)
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Управление тестами</CardTitle>
              <CardDescription>Создавайте и редактируйте тесты для курсов</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              {showAddForm ? 'Отмена' : 'Добавить тест'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Курс</label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите курс" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Название теста</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Введите название теста"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Проходной балл (%)</label>
                    <Input
                      type="number"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 70 })}
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                </div>

                {/* Добавление вопросов */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Добавить вопрос</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Вопрос</label>
                      <Textarea
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                        placeholder="Введите текст вопроса"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium mb-1">
                            Вариант {index + 1}
                            {currentQuestion.correctAnswer === index && (
                              <span className="text-green-600 ml-1">(правильный)</span>
                            )}
                          </label>
                          <div className="flex space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, options: newOptions });
                              }}
                              placeholder={`Вариант ответа ${index + 1}`}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant={currentQuestion.correctAnswer === index ? "default" : "outline"}
                              onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                            >
                              ✓
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button type="button" onClick={handleAddQuestion} variant="outline" size="sm">
                      Добавить вопрос
                    </Button>
                  </div>
                </div>

                {/* Список добавленных вопросов */}
                {formData.questions.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Добавленные вопросы ({formData.questions.length})</h4>
                    <div className="space-y-2">
                      {formData.questions.map((question, index) => (
                        <div key={question.id} className="flex items-center justify-between p-3 bg-white border rounded">
                          <div>
                            <span className="font-medium">{index + 1}. {question.question}</span>
                            <div className="text-sm text-gray-600">
                              Правильный ответ: {question.options[question.correctAnswer]}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveQuestion(question.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button type="submit" disabled={!selectedCourse || formData.questions.length === 0}>
                    Создать тест
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="mb-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Выберите курс для просмотра тестов" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourse && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название теста</TableHead>
                  <TableHead>Количество вопросов</TableHead>
                  <TableHead>Проходной балл</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.title}</TableCell>
                    <TableCell>{test.questions.length}</TableCell>
                    <TableCell>{test.passingScore}%</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {courseTests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      Нет тестов для данного курса
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
