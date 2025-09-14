'use client';
import { CardGrid } from '@/components/features/card-grid';
import { useTopics } from '@/hooks/use-topics';

export default function PracticePage() {
  const {
    data: topicsData,
    isLoading,
    error,
  } = useTopics({
    page: 0,
    size: 20,
    depthType: 'Sub-strand',
  });

  // Transform API topics to add onClick handlers
  const practiceTopics =
    topicsData?.content?.map((topic) => ({
      ...topic,
      onClick: (selectedTopic: typeof topic) => {
        // TODO: Navigate to topic practice session
        console.log(
          'Starting practice for topic:',
          selectedTopic.id,
          selectedTopic.title
        );
      },
    })) || [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="animate-pulse">
            <div className="mb-2 h-8 w-64 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="mb-6 h-4 w-96 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-gray-300 dark:bg-gray-600"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Unable to Load Topics
            </h1>
            <p className="mb-6 text-red-600 dark:text-red-400">
              There was an error loading practice topics. Please try again
              later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Practice by Topic
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Choose a topic to start practising
        </p>

        <CardGrid cards={practiceTopics} />
      </div>
    </div>
  );
}
