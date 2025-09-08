import React from 'react';
import { LucideIcon } from 'lucide-react';

type Topic = {
  title: string;
  description: string;
  icon?: React.ReactNode | LucideIcon;
  color?: string;
  normalColor?: string;
};

type TopicGridProps = {
  topics: Topic[];
  variant?: 'kidFriendly' | 'normal';
};

export function TopicGrid({ topics, variant = 'normal' }: TopicGridProps) {
  if (variant === 'kidFriendly') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic) => (
          <div
            key={topic.title}
            className={`bg-gradient-to-br ${topic.color} p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer`}
          >
            {topic.icon && <div className="flex justify-center mb-4">{topic.icon}</div>}
            <h3 className="text-2xl font-bold text-white text-center mb-2">{topic.title}</h3>
            <p className="text-white text-center text-sm">{topic.description}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <div
          key={topic.title}
          className={`bg-${topic.normalColor}-50 dark:bg-${topic.normalColor}-900/20 p-6 rounded-lg border border-${topic.normalColor}-200 dark:border-${topic.normalColor}-800`}
        >
          <h3 className={`font-semibold text-${topic.normalColor}-900 dark:text-${topic.normalColor}-100 mb-2`}>
            {topic.title}
          </h3>
          <p className={`text-${topic.normalColor}-700 dark:text-${topic.normalColor}-300 text-sm`}>
            {topic.description}
          </p>
        </div>
      ))}
    </div>
  );
}