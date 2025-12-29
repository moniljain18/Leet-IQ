import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";
import { useProfile } from "../hooks/useAuth";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../api/executor";
import axiosInstance from "../lib/axios";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useAuth } from "@clerk/clerk-react";
import { useProctoring } from "../hooks/useProctoring";
import ProctoringOverlay from "../components/ProctoringOverlay";
import { useClaimProblemReward } from "../hooks/useRewards";
import ChallengeCompletionModal from "../components/ChallengeCompletionModal";
import SubmissionResult from "../components/SubmissionResult";
import { ChevronUpIcon, ChevronDownIcon, CheckCircle2Icon, TerminalIcon, Maximize2Icon } from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { data: profile } = useProfile();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [contestData, setContestData] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [newStreak, setNewStreak] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(30);

  const claimReward = useClaimProblemReward();

  const currentProblem = PROBLEMS[currentProblemId];
  const contestId = new URLSearchParams(window.location.search).get("contestId");

  // Proctoring
  const { isLocked, strikeCount, unlock } = useProctoring(contestId);

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setOutput(null);
      setSelectedSubmission(null);
      fetchSubmissions(id, selectedLanguage);
    }
  }, [id, contestId]);

  // Handle language change persistence separately
  useEffect(() => {
    if (currentProblemId && id) {
      const savedSubmission = submissions.find(s => s.language === selectedLanguage && s.status === "Accepted");
      if (savedSubmission) {
        console.log(`[Persistence] Loading saved ${selectedLanguage} code`);
        setCode(savedSubmission.code);
      } else {
        setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      }
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (contestId) {
      fetchContestData();
    }
  }, [contestId]);

  const fetchSubmissions = async (problemId, lang) => {
    setIsLoadingSubmissions(true);
    const targetContestId = contestId || "practice";
    try {
      const token = await getToken();
      const response = await axiosInstance.get(`/contests/${targetContestId}/submissions?problemId=${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allSubs = response.data;
      setSubmissions(allSubs);

      const successfulSubmissions = allSubs.filter(s => s.status === "Accepted");
      setIsSolved(successfulSubmissions.length > 0);

      // Persistence: Load the last accepted code for the current language if it exists
      const lastSuccessfulSolveForLanguage = successfulSubmissions.find(s => s.language === (lang || selectedLanguage));
      if (lastSuccessfulSolveForLanguage) {
        console.log(`[Persistence] Initial load: previous solution for ${lang || selectedLanguage}`);
        setCode(lastSuccessfulSolveForLanguage.code);
      } else {
        // Fallback to starter code if no solve found
        setCode(PROBLEMS[problemId].starterCode[lang || selectedLanguage]);
      }
    } catch (e) {
      console.error("Failed to fetch submissions:", e);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const fetchContestData = async () => {
    try {
      const token = await getToken();
      const response = await axiosInstance.get(`/contests/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContestData(response.data);
    } catch (e) {
      console.error("Failed to fetch contest metadata:", e);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => {
    const contestId = new URLSearchParams(window.location.search).get("contestId");
    navigate(`/problem/${newProblemId}${contestId ? `?contestId=${contestId}` : ""}`);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/'/g, '"') // Normalize single to double quotes
          .replace(/\s+/g, "") // Remove ALL whitespace for strict content matching
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    // Now judge-powered for better precision
    const result = await executeCode(selectedLanguage, code, currentProblemId);

    setOutput(result);
    setIsRunning(false);
    setIsConsoleOpen(true); // Automatically show console when run
    setConsoleHeight(40);  // Give it some room

    if (result.success) {
      toast.success(`Run Success! Output matches expected.`);
    } else {
      toast.error(result.status === "Runtime Error" ? "Execution Error" : (result.status || "Test failed"));
    }
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    const targetContestId = contestId || "practice";
    try {
      // BACKEND JUDGING: Use isSubmit: true
      const judgeResult = await executeCode(selectedLanguage, code, currentProblemId, true);

      // GUARD: If judging failed completely (e.g. problem not found, system error)
      if (!judgeResult || judgeResult.status === "System Error" || !judgeResult.status) {
        toast.error(judgeResult?.error || "Judging failed. Please try again.");
        setIsRunning(false);
        return;
      }

      // If it ran but produced something (Accepted, Wrong Answer, etc)
      // Save it to the DB via our existing contest route
      await axiosInstance.post(`/contests/${targetContestId}/submit`, {
        problemId: currentProblemId,
        code,
        language: selectedLanguage,
        status: judgeResult.status,
        runtime: judgeResult.runtime || 0,
        memory: judgeResult.memory || 0,
        benchmarks: judgeResult.benchmarks // Store for detail view
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      // Refetch history
      await fetchSubmissions(currentProblemId);

      // Show the Detail View automatically
      setSelectedSubmission({
        ...judgeResult,
        language: selectedLanguage,
        code: code
      });

      if (judgeResult.status === "Accepted") {
        toast.success(isSolved ? "Changes saved successfully!" : "Solution Accepted!");
        if (!isSolved) triggerConfetti();

        // Only show modal if it's the FIRST solve of the day
        const isAlreadyCompleted = profile?.lastSolvedDate && new Date(profile.lastSolvedDate).toDateString() === new Date().toDateString();
        const rewardProblemId = id || currentProblemId;

        claimReward.mutate({
          problemId: rewardProblemId,
          difficulty: currentProblem.difficulty
        }, {
          onSuccess: (data) => {
            console.log("[ProblemPage] Reward claimed successfully response:", data);

            if (!isAlreadyCompleted) {
              const streakToDisplay = typeof data.streak === 'number' ? data.streak : 1;
              setNewStreak(streakToDisplay);
              // setShowCompletionModal(true); // User requested to NOT show the modal
              console.log(`[ProblemPage] Streak updated: ${streakToDisplay}`);
            } else {
              console.log("[ProblemPage] Streak already completed today.");
            }
          },
          onError: (err) => {
            console.error("[ProblemPage] Reward claim failed:", err);
            toast.error("Failed to update streak/coins. Please try again.");
          }
        });

        setIsSolved(true);
      } else {
        toast.error("Wrong Answer. Try again.");
      }
    } catch (error) {
      console.error("Submission Error Details:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to submit code");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <ProctoringOverlay
        isLocked={isLocked}
        strikeCount={strikeCount}
        onUnlock={unlock}
      />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={contestData ? contestData.problems.map(p => ({
                id: p.problemId,
                title: PROBLEMS[p.problemId]?.title || p.title || "Unknown",
                difficulty: PROBLEMS[p.problemId]?.difficulty || p.difficulty || "Medium",
                score: p.score
              })) : Object.values(PROBLEMS)}
              contestId={contestId}
              submissions={submissions}
              isLoadingSubmissions={isLoadingSubmissions}
              selectedSubmission={selectedSubmission}
              setSelectedSubmission={setSelectedSubmission}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col bg-base-300">
              <div className="flex-1 min-h-0 relative">
                <PanelGroup direction="vertical">
                  {/* Top panel - Code editor */}
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      isSolved={isSolved}
                      contestId={contestId}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={setCode}
                      onRunCode={handleRunCode}
                      onSubmit={handleSubmitCode}
                    />
                  </Panel>

                  {/* Bottom panel - Output Panel*/}
                  {isConsoleOpen && (
                    <>
                      <PanelResizeHandle className="h-1 bg-base-200 hover:bg-primary/50 transition-colors cursor-row-resize" />
                      <Panel
                        defaultSize={consoleHeight}
                        minSize={20}
                        onResize={(size) => setConsoleHeight(size)}
                      >
                        <OutputPanel
                          output={output}
                          problem={currentProblem}
                          selectedLanguage={selectedLanguage}
                        />
                      </Panel>
                    </>
                  )}
                </PanelGroup>
              </div>

              {/* Editor Footer with Console Toggle */}
              <div className="flex items-center justify-between px-4 py-1.5 bg-base-300 border-t border-base-300 select-none">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                    className="btn btn-sm btn-ghost gap-2 font-bold normal-case hover:bg-base-200"
                  >
                    Console
                    <div className={`transition-transform duration-300 ${isConsoleOpen ? 'rotate-180' : ''}`}>
                      <ChevronUpIcon className="size-4" />
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-sm btn-ghost gap-2 font-black opacity-50 hover:opacity-100 normal-case"
                    onClick={handleRunCode}
                    disabled={isRunning}
                  >
                    Run
                  </button>
                  <button
                    className="btn btn-sm btn-primary px-6 font-black normal-case"
                    onClick={handleSubmitCode}
                    disabled={isRunning}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
      <ChallengeCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        streak={newStreak}
      />
    </div>
  );
}

export default ProblemPage;
