'use client';
import { CardGrid } from '@/components/features/card-grid';
import { useExamPacks } from '@/hooks/use-exam-packs';
import { LucideIcon, GraduationCap, BookOpen, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { PackResponse } from '@chengkoon/mathpet-api-types';

export default function TestPage() {
  const router = useRouter();
  const {
    data: examPacksData,
    isLoading,
    error,
  } = useExamPacks({
    page: 0,
    size: 20,
  });

  // Transform API exam packs to add onClick handlers and icons
  const examPacks =
    examPacksData?.content?.map((pack: PackResponse, index: number) => {
      // Default icons cycling through available ones
      const icons = [GraduationCap, BookOpen, Trophy] as LucideIcon[];
      const colors = [
        'blue',
        'green',
        'purple',
        'red',
        'yellow',
        'indigo',
      ] as const;

      return {
        ...pack,
        icon: icons[index % icons.length],
        normalColor: colors[index % colors.length],
        onClick: async (selectedPack: typeof pack) => {
          try {
            // Fetch pack structure first to ensure it exists and is valid
            toast.info(`Loading pack: ${selectedPack.title}...`);

            // Navigate to pack details page - the page will handle structure loading
            router.push(`/packs/${selectedPack.id}`);
          } catch (error) {
            console.error('Error accessing pack:', error);
            toast.error('Failed to load pack structure. Please try again.');
          }
        },
      };
    }) || [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="animate-pulse">
            <div className="mb-2 h-8 w-64 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="mb-6 h-4 w-96 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-lg bg-gray-300 dark:bg-gray-600"
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
              Unable to Load Exam Packs
            </h1>
            <p className="mb-6 text-red-600 dark:text-red-400">
              There was an error loading exam packs. Please try again later.
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
          Exam Packs
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Choose an exam pack to start practicing
        </p>

        <CardGrid cards={examPacks} />
      </div>
    </div>
  );
}
