
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { Course, Lesson } from '../../types';

interface LessonFormProps {
  courses: Course[];
  editingLesson: Lesson | null;
  selectedCourse: string;
  setSelectedCourse: (courseId: string) => void;
  formData: {
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    order: number;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({
  courses,
  editingLesson,
  selectedCourse,
  setSelectedCourse,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-orange-50">
      <h3 className="text-lg font-medium mb-4">
        {editingLesson ? 'Редактировать урок' : 'Добавить новый урок'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
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
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};
