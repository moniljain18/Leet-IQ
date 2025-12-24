import React from "react";
import { AlertTriangleIcon, RefreshCcwIcon } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen bg-base-100 flex items-center justify-center p-4">
                    <div className="card bg-base-200 shadow-2xl max-w-lg w-full border border-error/20">
                        <div className="card-body items-center text-center py-10">
                            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangleIcon className="w-10 h-10 text-error" />
                            </div>
                            <h2 className="card-title text-3xl font-black mb-2 uppercase tracking-tighter">Something went wrong</h2>
                            <p className="text-base-content/70 mb-8 max-w-sm">
                                The session encountered a rendering error. This can happen if the video connection is interrupted or the data is temporarily out of sync.
                            </p>

                            <div className="w-full bg-base-300 rounded-lg p-4 mb-8 text-left overflow-auto max-h-40">
                                <p className="text-xs font-mono text-error/80 break-words">
                                    {this.state.error?.toString()}
                                </p>
                            </div>

                            <div className="card-actions">
                                <button
                                    onClick={this.handleReset}
                                    className="btn btn-primary btn-lg gap-3 rounded-xl shadow-lg shadow-primary/20"
                                >
                                    <RefreshCcwIcon className="w-5 h-5" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
