import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEndSession, useJoinSession, useLeaveSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../api/executor";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { CheckIcon, CopyIcon, Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const leaveSessionMutation = useLeaveSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const streamState = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );
  const { call, channel, chatClient, isInitializingCall, streamClient } = streamState;

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // Update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  // Handle auto-join
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    if (session.status !== "active") return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  if (loadingSession) {
    return (
      <div className="h-screen bg-base-100 flex flex-col items-center justify-center">
        <Loader2Icon className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-bold font-mono tracking-tighter uppercase">Loading Session Data...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen bg-base-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <PhoneOffIcon className="w-16 h-16 mx-auto text-error mb-4" />
            <h1 className="text-2xl font-bold">Session Not Found</h1>
            <p className="text-base-content/60 mt-2">This session may have ended or does not exist.</p>
          </div>
        </div>
      </div>
    );
  }


  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    // Now judge-powered even for sessions
    const result = await executeCode(selectedLanguage, code, problemData.id);

    setOutput(result);
    setIsRunning(false);
  };

  const handleLeave = () => {
    console.log("handleLeave called", { isParticipant, sessionId: id, user: user?.id });
    if (isParticipant) {
      console.log("Calling leaveSession API");
      leaveSessionMutation.mutate(id, {
        onSuccess: (data) => {
          console.log("leaveSession success", data);
          navigate("/dashboard");
        },
        onError: (error) => {
          console.error("leaveSession error", error);
        }
      });
      return;
    }
    console.log("Host leaving - just navigating");
    navigate("/dashboard");
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/join/${session?.inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(session?.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  {/* HEADER SECTION */}
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base-content/60 mt-1">{problemData.category}</p>
                        )}
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>

                        {session?.inviteCode && (
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2 bg-base-200 px-3 py-1.5 rounded-lg border border-base-300">
                              <span className="text-xs font-bold uppercase text-base-content/40">Code</span>
                              <span className="font-mono font-bold text-primary">{session.inviteCode}</span>
                              <button
                                onClick={copyInviteCode}
                                className="ml-1 p-1 hover:bg-base-300 rounded transition-colors"
                                title="Copy code"
                              >
                                {copiedCode ? <CheckIcon className="w-3.5 h-3.5 text-success" /> : <CopyIcon className="w-3.5 h-3.5 text-base-content/40" />}
                              </button>
                            </div>

                            <button
                              onClick={copyInviteLink}
                              className="btn btn-ghost btn-xs gap-2 text-primary hover:bg-primary/10 transition-all normal-case"
                            >
                              {copiedLink ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
                              {copiedLink ? "Copied Link!" : "Copy Invite Link"}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`badge badge-lg ${getDifficultyBadgeClass(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty.slice(0, 1).toUpperCase() +
                            session?.difficulty.slice(1) || "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="badge badge-ghost badge-lg">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                        <div className="space-y-3 text-base leading-relaxed">
                          <p className="text-base-content/90">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-base-content/90">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

                        <div className="space-y-4">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-sm">{idx + 1}</span>
                                <p className="font-semibold text-base-content">Example {idx + 1}</p>
                              </div>
                              <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-primary font-bold min-w-[70px]">
                                    Input:
                                  </span>
                                  <span>{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-secondary font-bold min-w-[70px]">
                                    Output:
                                  </span>
                                  <span>{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-2">
                                    <span className="text-base-content/60 font-sans text-xs">
                                      <span className="font-semibold">Explanation:</span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                        <ul className="space-y-2 text-base-content/90">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <code className="text-sm">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg font-mono tracking-tighter uppercase">Connecting to video call...</p>
                  </div>
                </div>
              ) : streamClient && call ? (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} onLeave={handleLeave} session={session} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              ) : null}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;
