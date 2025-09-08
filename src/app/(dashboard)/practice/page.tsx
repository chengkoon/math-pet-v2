export default function PracticePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Practice by Topic
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Choose a topic to start practising
        </p>
        
        {/* Topic grid will go here in future */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Addition</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">Practice basic addition problems</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Subtraction</h3>
            <p className="text-green-700 dark:text-green-300 text-sm">Practice basic subtraction problems</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Multiplication</h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm">Practice multiplication tables</p>
          </div>
        </div>
      </div>
    </div>
  );
}
