'use client';
import { TopicGrid } from '@/components/features/topic-grid';
import { GraduationCap, BookOpen, Trophy } from 'lucide-react';

const testPacks = [
  {
    id: 1,
    title: 'Hougang Primary School',
    description: 'End of Year Examination 2020',
    icon: GraduationCap,
    normalColor: 'blue' as const,
    onClick: () => console.log('Hougang test clicked'),
  },
  {
    id: 2,
    title: 'Zhonghua Primary School',
    description: 'Mid Year Examination 2022',
    icon: BookOpen,
    normalColor: 'green' as const,
    onClick: () => console.log('Zhonghua test clicked'),
  },
  {
    id: 3,
    title: 'Yangzhen Primary School',
    description: 'End of Year Examination 2023',
    icon: Trophy,
    normalColor: 'purple' as const,
    onClick: () => console.log('Yangzhen test clicked'),
  },
];

export default function TestPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Practice by Topic
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Choose a topic to start practising
        </p>

        <TopicGrid topics={testPacks} />
      </div>
    </div>
  );
}
