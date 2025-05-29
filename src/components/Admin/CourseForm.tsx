
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CourseFormData {
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface CourseFormProps {
  onSubmit: (courseData: CourseFormData) => void;
  onCancel: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    instructor: '',
    price: 0,
    duration: '',
    level: 'beginner',
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.instructor) return;
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      instructor: '',
      price: 0,
      duration: '',
      level: 'beginner',
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Новый курс</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Название курса</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название курса"
            />
          </div>
          <div>
            <Label htmlFor="instructor">Преподаватель</Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="Имя преподавателя"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Описание</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Описание курса"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Цена (₽)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="duration">Длительность</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="8 недель"
            />
          </div>
          <div>
            <Label htmlFor="level">Уровень</Label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="beginner">Начальный</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSubmit}>Создать курс</Button>
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
