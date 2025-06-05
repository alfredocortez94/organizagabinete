import React from "react";

const GlobalLoader: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;
  return (
    <div className="fixed top-0 left-0 w-full z-[9999] pointer-events-none">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-loader-bar" />
    </div>
  );
};

export default GlobalLoader;
