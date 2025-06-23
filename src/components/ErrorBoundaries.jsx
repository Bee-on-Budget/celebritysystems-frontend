import React from 'react';
import { Button } from './';
import { FaSyncAlt } from 'react-icons/fa';

class ErrorBoundaries extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(_, errorInfo) {
        this.setState({ errorInfo });
        // You can also log error info to an error reporting service here
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full bg-primary bg-opacity-10 p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-primary mb-4">Something went wrong</h1>
                    <p className="text-lg text-dark mb-2">An unexpected error has occurred in this part of the application.</p>
                    {this.state.error && process.env.REACT_APP_NODE_ENV === "development" && (
                        <pre className="bg-primary bg-opacity-5 text-dark p-4 rounded mb-4 max-w-xl overflow-x-auto text-sm">
                            {this.state.error.toString()}
                        </pre>
                    )}
                    <Button
                        onClick={this.handleReload}
                        icon={<FaSyncAlt />}
                    >
                        Reload Page
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundaries; 