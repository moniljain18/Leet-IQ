import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJoinByCode } from "../hooks/useSessions";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function JoinPage() {
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const joinByCodeMutation = useJoinByCode();

    useEffect(() => {
        if (inviteCode) {
            joinByCodeMutation.mutate(inviteCode, {
                onSuccess: (data) => {
                    navigate(`/session/${data.session._id}`);
                },
                onError: (error) => {
                    console.error("Join by code error:", error);
                    toast.error(error.response?.data?.message || "Invalid or inactive meeting link");
                    navigate("/dashboard");
                }
            });
        } else {
            navigate("/dashboard");
        }
    }, [inviteCode, navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-base-300">
            <div className="bg-base-100 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-md w-full mx-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div>
                    <h1 className="text-3xl font-black mb-2">Joining Meeting...</h1>
                    <p className="text-base-content/60 font-medium">
                        Preparing your workspace for code <b>{inviteCode}</b>. Please wait a moment.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default JoinPage;
