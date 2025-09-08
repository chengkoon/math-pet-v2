export default function TestPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Test Yourself
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Challenge yourself with timed tests
        </p>
        
        {/* Test grid will go here in future */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Hougang Primary School</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">End of Year Examination 2020</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Zhonghua Primary School</h3>
            <p className="text-green-700 dark:text-green-300 text-sm">Mid Year Examination 2022</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Yangzhen Primary School</h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm">End of Year Examination 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}
