const CompanyLogo = () => {
  return (
    <div className="flex items-center space-x-3 select-none cursor-pointer">
      {/* Circle with initials */}
      <div className="flex items-center justify-center rounded-full bg-primary w-9 h-9">
        <span className="text-white font-semibold text-lg leading-none">CS</span>
      </div>

      {/* Company name stacked */}
      <div className="flex flex-col leading-tight">
        <span className="text-primary font-bold">Celebrity</span>
        <span className="text-white font-bold">Systems</span>
      </div>
    </div>
  );
};

export default CompanyLogo;
