import { TopicGrid } from '@/components/features/topic-grid';

const practiceTopics = [
  {
    title: 'Addition',
    description: 'Practice basic addition problems',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    color: 'from-green-400 to-blue-500',
    normalColor: 'blue',
  },
  {
    title: 'Subtraction',
    description: 'Practice basic subtraction problems',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
    color: 'from-pink-500 to-yellow-500',
    normalColor: 'green',
  },
  {
    title: 'Multiplication',
    description: 'Practice multiplication tables',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    color: 'from-purple-400 to-indigo-500',
    normalColor: 'purple',
  },
];


export default function PracticePage() {
  const gridVariant = 'kidFriendly';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Practice by Topic
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Choose a topic to start practising
        </p>
        
        <TopicGrid topics={practiceTopics} variant={gridVariant} />
      </div>
    </div>
  );
}