
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Course, Lesson } from '../../types';
import { useData } from '../../hooks/useData';
import { toast } from '@/components/ui/use-toast';
import { LessonForm } from './LessonForm';
import { LessonTable } from './LessonTable';
import { DeleteLessonDialog } from './DeleteLessonDialog';

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
            <LessonForm
              courses={courses}
              editingLesson={editingLesson}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
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
            <LessonTable
              lessons={courseLessons}
              onEdit={handleEdit}
              onDelete={(lessonId) => setShowDeleteDialog(lessonId)}
            />
          )}
        </CardContent>
      </Card>

      <DeleteLessonDialog
        isOpen={!!showDeleteDialog}
        onClose={() => setShowDeleteDialog(null)}
        onConfirm={() => showDeleteDialog && handleDelete(showDeleteDialog)}
      />
    </div>
  );
};
