import React from 'react';
import { LucideIcon } from 'lucide-react';

type Topic = {
  title: string;
  description: string;
  icon?: LucideIcon;
  color?: string;
  normalColor?: string;
  onClick?: () => void;
};

type TopicGridProps = {
  topics: Topic[];
  variant?: 'kidFriendly' | 'normal';
};

export function TopicGrid({ topics, variant = 'normal' }: TopicGridProps) {
  if (variant === 'kidFriendly') {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {topics.map(({ title, color, icon: Icon, description }) => (
          <div
            key={title}
            className={`bg-gradient-to-br ${color} transform cursor-pointer rounded-2xl p-6 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105`}
          >
            <div className="flex flex-col items-center">
              {Icon && (
                <Icon className="mb-4 h-16 w-16 text-white drop-shadow-lg" />
              )}
              <h3 className="mb-2 text-center text-2xl font-bold text-white">
                {title}
              </h3>
              <p className="text-center text-sm text-white">{description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => {
        const Icon = topic.icon;
        return (
          <div
            key={topic.title}
            onClick={topic.onClick}
            className={`bg-${topic.normalColor}-50 dark:bg-${topic.normalColor}-900/20 rounded-lg border p-6 border-${topic.normalColor}-200 dark:border-${topic.normalColor}-800 ${
              topic.onClick
                ? 'cursor-pointer transition-shadow hover:shadow-md'
                : ''
            }`}
          >
            <div className="mb-2 flex items-center gap-3">
              {Icon && (
                <Icon
                  className={`h-6 w-6 text-${topic.normalColor}-600 dark:text-${topic.normalColor}-400`}
                />
              )}
              <h3
                className={`font-semibold text-${topic.normalColor}-900 dark:text-${topic.normalColor}-100`}
              >
                {topic.title}
              </h3>
            </div>
            <p
              className={`text-${topic.normalColor}-700 dark:text-${topic.normalColor}-300 text-sm`}
            >
              {topic.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
