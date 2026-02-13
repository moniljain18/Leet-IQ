import { AlertTriangleIcon, Loader2Icon, XIcon } from "lucide-react";

/**
 * Reusable confirmation modal component for admin actions
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {function} props.onClose - Called when modal is closed/cancelled
 * @param {function} props.onConfirm - Called when user confirms
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Text for confirm button (default: "Confirm")
 * @param {string} props.cancelText - Text for cancel button (default: "Cancel")
 * @param {string} props.variant - Button variant: "error" | "warning" | "primary" (default: "error")
 * @param {boolean} props.isLoading - Show loading state on confirm button
 * @param {React.ReactNode} props.icon - Custom icon (default: AlertTriangleIcon)
 */
function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "error",
    isLoading = false,
    icon: Icon = AlertTriangleIcon
}) {
    if (!isOpen) return null;

    const variantClasses = {
        error: {
            iconBg: "bg-error/20",
            iconColor: "text-error",
            button: "btn-error"
        },
        warning: {
            iconBg: "bg-warning/20",
            iconColor: "text-warning",
            button: "btn-warning"
        },
        primary: {
            iconBg: "bg-primary/20",
            iconColor: "text-primary",
            button: "btn-primary"
        }
    };

    const styles = variantClasses[variant] || variantClasses.error;

    return (
        <div className="modal modal-open z-50">
            <div className="modal-box border border-base-300 bg-base-200 max-w-md">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    disabled={isLoading}
                >
                    <XIcon className="size-4" />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center pt-2">
                    <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mb-4`}>
                        <Icon className={`w-8 h-8 ${styles.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{title}</h3>
                    <p className="text-base-content/70 mb-6">{message}</p>

                    {/* Actions */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="btn btn-ghost flex-1"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`btn ${styles.button} flex-1 gap-2`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2Icon className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div
                className="modal-backdrop bg-black/50"
                onClick={isLoading ? undefined : onClose}
            />
        </div>
    );
}

export default ConfirmModal;
