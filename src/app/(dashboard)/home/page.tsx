export default function DashboardHomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard Home
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to your MathPet dashboard! This is where you can see your progress and access all features.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Practice Sessions</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">Complete your daily math practice</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100">Exam Packs</h3>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">Prepare for upcoming tests</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Test Results</h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">Review your performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}