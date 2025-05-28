const FormsContainer = ({children}) => {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            {children}
        </div>
    );
};

export default FormsContainer;