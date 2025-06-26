import { Button } from "./";

const FormsContainer = ({ title, actionTitle, isLoading, onSubmit, children }) => {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100 mt-8">
            <h1 className="text-2xl font-semibold mb-8">{title}</h1>
            <form onSubmit={onSubmit} noValidate>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
                {children}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button isLoading={isLoading} type="submit">{actionTitle}</Button>
                </div>
            </form>
        </div>
    );
};

export default FormsContainer;