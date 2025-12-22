import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../api/executor";
import axiosInstance from "../lib/axios";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [contestData, setContestData] = useState(null);

  const currentProblem = PROBLEMS[currentProblemId];
  const contestId = new URLSearchParams(window.location.search).get("contestId");

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
      fetchSubmissions(id);
    }
  }, [id, selectedLanguage, contestId]);

  useEffect(() => {
    if (contestId) {
      fetchContestData();
    }
  }, [contestId]);

  const fetchSubmissions = async (problemId) => {
    setIsLoadingSubmissions(true);
    const targetContestId = contestId || "practice";
    try {
      const response = await axiosInstance.get(`/contests/${targetContestId}/submissions?problemId=${problemId}`);
      setSubmissions(response.data);
      setIsSolved(response.data.some(s => s.status === "Accepted"));
    } catch (e) {
      console.error("Failed to fetch submissions:", e);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const fetchContestData = async () => {
    try {
      const response = await axiosInstance.get(`/contests/${contestId}`);
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

    const result = await executeCode(selectedLanguage, code, currentProblemId);

    // Check constraints if execution was successful
    if (result.success) {
      if (result.runtime > currentProblem.timeLimit * 2) {
        result.success = false;
        result.error = `Time Limit Exceeded! (Total time: ${result.runtime}ms, Limit: ${currentProblem.timeLimit}ms)`;
      } else if (result.memory && result.memory / 1024 / 1024 > currentProblem.memoryLimit) {
        result.success = false;
        const memoryMB = (result.memory / 1024 / 1024).toFixed(2);
        result.error = `Memory Limit Exceeded! Your code used ${memoryMB}MB (Limit: ${currentProblem.memoryLimit}MB)`;
      }
    }

    setOutput(result);
    setIsRunning(false);

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      // CHECK ALL TEST CASES
      const lines = result.output.trim().split("\n").filter(l => l.trim().length > 0);
      const expectedLines = expectedOutput.trim().split("\n").filter(l => l.trim().length > 0);

      // Lenient comparison: trim and ignore empty lines
      const testsPassed = lines.length === expectedLines.length &&
        lines.every((line, i) => line.trim() === expectedLines[i]?.trim());

      const memoryMB = result.memory ? (result.memory / 1024 / 1024).toFixed(2) : "N/A";

      if (testsPassed) {
        toast.success(`Run Success! Output matches expected.`);
      } else {
        toast.error("Test failed. Check your output!");
      }
    } else {
      toast.error(result.error || "Code execution failed!");
    }
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    const targetContestId = contestId || "practice";
    try {
      const runResult = await executeCode(selectedLanguage, code, currentProblemId);
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const isCorrect = checkIfTestsPassed(runResult.output, expectedOutput);
      const status = isCorrect ? "Accepted" : "Wrong Answer";

      // If it ran but had a runtime error
      if (!runResult.success) {
        await axiosInstance.post(`/contests/${targetContestId}/submit`, {
          problemId: currentProblemId,
          code,
          language: selectedLanguage,
          status: "Runtime Error",
          runtime: runResult.runtime,
          memory: runResult.memory || 0
        });
        setOutput(runResult);
        toast.error("Runtime Error in submission");
        return;
      }

      // Submit the judged result
      await axiosInstance.post(`/contests/${targetContestId}/submit`, {
        problemId: currentProblemId,
        code,
        language: selectedLanguage,
        status,
        runtime: runResult.runtime,
        memory: runResult.memory || 0
      });

      // Refetch history
      await fetchSubmissions(currentProblemId);

      setOutput(runResult);

      if (isCorrect) {
        toast.success(isSolved ? "Changes saved successfully!" : "Solution Accepted!");
        if (!isSolved) triggerConfetti();
        setIsSolved(true);
      } else {
        toast.error("Wrong Answer. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit code");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

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
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
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

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
