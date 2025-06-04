
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash } from 'lucide-react';
import { Lesson } from '../../types';

interface LessonTableProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
}

export const LessonTable: React.FC<LessonTableProps> = ({
  lessons,
  onEdit,
  onDelete,
}) => {
  return (
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
        {lessons.map((lesson) => (
          <TableRow key={lesson.id}>
            <TableCell className="font-medium">{lesson.order}</TableCell>
            <TableCell>{lesson.title}</TableCell>
            <TableCell className="max-w-xs truncate">{lesson.description}</TableCell>
            <TableCell>{lesson.duration}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(lesson)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onDelete(lesson.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {lessons.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-500 py-8">
              Нет уроков для данного курса
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
