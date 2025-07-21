import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
        <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gradient-to-r from-primary-200 to-primary-300 rounded animate-pulse"></div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table/Content skeleton */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;