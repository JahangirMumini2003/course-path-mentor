
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play } from 'lucide-react';
import { Lesson } from '../../types';

interface VideoPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
  isCompleted: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson, onComplete, isCompleted }) => {
  const [videoWatched, setVideoWatched] = useState(false);

  const handleVideoEnd = () => {
    setVideoWatched(true);
  };

  const handleCompleteLesson = () => {
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {lesson.title}
          {isCompleted && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
        </CardTitle>
        <CardDescription>{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-black rounded-lg mb-4 relative">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            className="w-full h-full rounded-lg"
            allowFullScreen
            onLoad={() => setVideoWatched(true)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Длительность: {lesson.duration}
          </div>
          
          {!isCompleted && (
            <Button 
              onClick={handleCompleteLesson}
              disabled={!videoWatched}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Урок пройден</span>
            </Button>
          )}
          
          {isCompleted && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Урок завершен</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
