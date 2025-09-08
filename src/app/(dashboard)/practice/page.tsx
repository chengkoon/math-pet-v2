import { PlusCircle, MinusCircle, PercentCircle } from 'lucide-react';
import { TopicGrid } from '@/components/features/topic-grid';

const practiceTopics = [
  {
    title: 'Addition',
    description: 'Practice basic addition problems',
    icon: PlusCircle,
    color: 'from-green-400 to-blue-500',
    normalColor: 'blue',
  },
  {
    title: 'Subtraction',
    description: 'Practice basic subtraction problems',
    icon: MinusCircle,
    color: 'from-pink-500 to-yellow-500',
    normalColor: 'green',
  },
  {
    title: 'Percentage',
    description: 'Practice percentage problems',
    icon: PercentCircle,
    color: 'from-purple-400 to-indigo-500',
    normalColor: 'purple',
  },
];

export default function PracticePage() {
  const gridVariant = 'kidFriendly';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Practice by Topic
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Choose a topic to start practising
        </p>

        <TopicGrid topics={practiceTopics} variant={gridVariant} />
      </div>
    </div>
  );
}
