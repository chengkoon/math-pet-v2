import React from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import type { TopicResponse, PackResponse } from '@chengkoon/mathpet-api-types';

type Topic = TopicResponse & {
  icon?: LucideIcon;
  iconImage?: string;
  color?: string;
  normalColor?: string;
  onClick?: (topic: TopicResponse) => void;
};

type Pack = PackResponse & {
  icon?: LucideIcon | undefined;
  iconImage?: string | undefined;
  color?: string;
  normalColor?: string;
  onClick?: (pack: PackResponse) => void;
};

type Card = Topic | Pack;

// Helper function to determine if it's an API topic
const isTopic = (topic: Card): topic is Topic => {
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

type CardGridProps = {
  cards: Card[];
  variant?: 'kidFriendly' | 'normal';
};

export function CardGrid({ cards, variant = 'normal' }: CardGridProps) {
  if (variant === 'kidFriendly') {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const isTopicType = isTopic(card);
          const key = isTopicType ? card.id : card.title;
          const defaultStyling = getDefaultStyling(index);
          const Icon = card.icon;

          // For API topics, use description or generate one
          const description = isTopicType
            ? card.description ||
              `Practice ${card.title.toLowerCase()} problems`
            : card.description;

          return (
            <div
              key={key}
              onClick={() => {
                if (card.onClick) {
                  isTopicType ? card.onClick(card) : card.onClick();
                }
              }}
              className={`transform cursor-pointer rounded-2xl bg-[rgb(183,198,163)] p-6 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 ${
                card.onClick ? 'cursor-pointer' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <h3 className="mb-2 text-center text-2xl font-bold text-white">
                  {card.title}
                </h3>
                {card.iconImage ? (
                  <Image
                    src={card.iconImage}
                    alt={card.title}
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
      {cards.map((card, index) => {
        const isTopicType = isTopic(card);
        const key = isTopicType ? card.id : card.title;
        const defaultStyling = getDefaultStyling(index);
        const normalColor = card.normalColor || defaultStyling.normalColor;
        const Icon = card.icon;

        // For API topics, use description or generate one
        const description = isTopicType
          ? card.description || `Practice ${card.title.toLowerCase()} problems`
          : card.description;

        return (
          <div
            key={key}
            onClick={() => {
              if (card.onClick) {
                isTopicType ? card.onClick(card) : card.onClick();
              }
            }}
            className={`bg-${normalColor}-50 dark:bg-${normalColor}-900/20 rounded-lg border p-6 border-${normalColor}-200 dark:border-${normalColor}-800 ${
              card.onClick
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
                {card.title}
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
