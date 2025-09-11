// Lines 1-10 (existing imports)
import React from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import type { TopicResponse } from '@chengkoon/mathpet-api-types';

// NEW: Union type to support both old and new formats
type LegacyTopic = {
  id?: number | string;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconImage?: string;
  color?: string;
  normalColor?: string;
  onClick?: () => void;
};

type ApiTopic = TopicResponse & {
  icon?: LucideIcon;
  iconImage?: string;
  color?: string;
  normalColor?: string;
  onClick?: (topic: TopicResponse) => void;
};

type Topic = LegacyTopic | ApiTopic;

// Helper function to determine if it's an API topic
const isApiTopic = (topic: Topic): topic is ApiTopic => {
  return 'id' in topic && typeof topic.id === 'number' && 'path' in topic;
};

// NEW: Default styling helper
const getDefaultStyling = (index: number) => {
  const colors = ['blue', 'green', 'purple', 'red', 'yellow', 'indigo'];
  const gradients = [
    'from-blue-400 to-indigo-500',
    'from-green-400 to-blue-500',
    'from-purple-400 to-indigo-500',
    'from-red-400 to-pink-500',
    'from-yellow-400 to-orange-500',
    'from-indigo-400 to-purple-500',
  ];

  return {
    normalColor: colors[index % colors.length],
    color: gradients[index % gradients.length],
  };
};

type TopicGridProps = {
  topics: Topic[];
  variant?: 'kidFriendly' | 'normal';
};

export function TopicGrid({ topics, variant = 'normal' }: TopicGridProps) {
  if (variant === 'kidFriendly') {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, index) => {
          const isApi = isApiTopic(topic);
          const key = isApi ? topic.id : topic.title;
          const defaultStyling = getDefaultStyling(index);
          const Icon = topic.icon;

          // For API topics, use description or generate one
          const description = isApi
            ? topic.description ||
              `Practice ${topic.title.toLowerCase()} problems`
            : topic.description;

          return (
            <div
              key={key}
              onClick={() => {
                if (topic.onClick) {
                  isApi ? topic.onClick(topic) : topic.onClick();
                }
              }}
              className={`transform cursor-pointer rounded-2xl bg-[rgb(183,198,163)] p-6 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 ${
                topic.onClick ? 'cursor-pointer' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <h3 className="mb-2 text-center text-2xl font-bold text-white">
                  {topic.title}
                </h3>
                {topic.iconImage ? (
                  <Image
                    src={topic.iconImage}
                    alt={topic.title}
                    width={64}
                    height={64}
                    className="mb-4 object-contain"
                    style={{ width: '64px', height: '64px' }}
                    priority
                  />
                ) : Icon ? (
                  <Icon className="mb-4 h-16 w-16 text-white drop-shadow-lg" />
                ) : null}
                <p className="text-center text-sm text-white">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic, index) => {
        const isApi = isApiTopic(topic);
        const key = isApi ? topic.id : topic.title;
        const defaultStyling = getDefaultStyling(index);
        const normalColor = topic.normalColor || defaultStyling.normalColor;
        const Icon = topic.icon;

        // For API topics, use description or generate one
        const description = isApi
          ? topic.description ||
            `Practice ${topic.title.toLowerCase()} problems`
          : topic.description;

        return (
          <div
            key={key}
            onClick={() => {
              if (topic.onClick) {
                isApi ? topic.onClick(topic) : topic.onClick();
              }
            }}
            className={`bg-${normalColor}-50 dark:bg-${normalColor}-900/20 rounded-lg border p-6 border-${normalColor}-200 dark:border-${normalColor}-800 ${
              topic.onClick
                ? 'cursor-pointer transition-shadow hover:shadow-md'
                : ''
            }`}
          >
            <div className="mb-2 flex items-center gap-3">
              {Icon && (
                <Icon
                  className={`h-6 w-6 text-${normalColor}-600 dark:text-${normalColor}-400`}
                />
              )}
              <h3
                className={`font-semibold text-${normalColor}-900 dark:text-${normalColor}-100`}
              >
                {topic.title}
              </h3>
            </div>
            <p
              className={`text-${normalColor}-700 dark:text-${normalColor}-300 text-sm`}
            >
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
