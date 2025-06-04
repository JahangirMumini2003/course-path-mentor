import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import { Course, Lesson } from '../../types';
import { useData } from '../../hooks/useData';
import { toast } from '@/components/ui/use-toast';

interface LessonManagementProps {
  courses: Course[];
}

export const LessonManagement: React.FC<LessonManagementProps> = ({ courses }) => {
  const { lessons, addLesson, updateLesson, deleteLesson } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (editingLesson) {
      updateLesson({
        ...editingLesson,
        ...formData,
      });
      toast({
        title: "Урок обновлен",
        description: "Изменения успешно сохранены",
      });
      setEditingLesson(null);
    } else {
      addLesson({
        courseId: selectedCourse,
        ...formData,
      });
      toast({
        title: "Урок добавлен",
        description: "Новый урок успешно создан",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      order: 1,
    });
    setShowAddForm(false);
    setEditingLesson(null);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setSelectedCourse(lesson.courseId);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      order: lesson.order,
    });
    setShowAddForm(true);
  };

  const handleDelete = (lessonId: string) => {
    deleteLesson(lessonId);
    setShowDeleteDialog(null);
    toast({
      title: "Урок удален",
      description: "Урок успешно удален из курса",
    });
  };

  const courseLessons = selectedCourse 
    ? lessons.filter(l => l.courseId === selectedCourse).sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Управление уроками</CardTitle>
              <CardDescription>Создавайте и редактируйте уроки для курсов</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              {showAddForm ? 'Отмена' : 'Добавить урок'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-orange-50">
              <h3 className="text-lg font-medium mb-4">
                {editingLesson ? 'Редактировать урок' : 'Добавить новый урок'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium mb-2">Порядок</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Название урока</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Введите название урока"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Введите описание урока"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">URL видео (YouTube embed)</label>
                    <Input
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Длительность</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="например: 15 мин"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={!selectedCourse}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingLesson ? 'Сохранить изменения' : 'Добавить урок'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" />
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="mb-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Выберите курс для просмотра уроков" />
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
                  <TableHead>Порядок</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Длительность</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.order}</TableCell>
                    <TableCell>{lesson.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{lesson.description}</TableCell>
                    <TableCell>{lesson.duration}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(lesson)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setShowDeleteDialog(lesson.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {courseLessons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Нет уроков для данного курса
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот урок? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => showDeleteDialog && handleDelete(showDeleteDialog)}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
