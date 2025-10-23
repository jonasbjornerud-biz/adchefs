const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-accent mb-4"></div>
        <p className="text-xl text-foreground/80">Loading videos...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
