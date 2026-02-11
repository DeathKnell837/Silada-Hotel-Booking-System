const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`${sizes[size]} border-2 border-dark-lighter border-t-gold rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;
