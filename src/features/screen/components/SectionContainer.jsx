const SectionContainer = ({title, children}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <hr className="mb-4" />
      {children}
    </div>
  );
}

export default SectionContainer;