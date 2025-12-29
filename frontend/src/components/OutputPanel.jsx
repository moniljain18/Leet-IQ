import React, { useState, useEffect } from "react";
import {
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  ZapIcon,
  DatabaseIcon,
  TerminalIcon,
  ChevronRightIcon,
  AlertCircleIcon
} from "lucide-react";

function OutputPanel({ output, problem, selectedLanguage }) {
  const [activeTab, setActiveTab] = useState("testcase");
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  // Switch to Test Result automatically when output arrives
  useEffect(() => {
    if (output) {
      setActiveTab("testresult");
    }
  }, [output]);

  if (!problem) return (
    <div className="h-full bg-base-100 flex items-center justify-center text-base-content/20 italic">
      Select a problem to see output...
    </div>
  );

  const testCases = problem.examples || [];
  const currentTestResult = output?.cases && output.cases[selectedCaseIdx];

  return (
    <div className="h-full bg-base-100 flex flex-col border-t border-base-300">
      {/* Tab Header */}
      <div className="flex items-center px-4 bg-base-200 border-b border-base-300">
        <button
          onClick={() => setActiveTab("testcase")}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === "testcase" ? "border-primary text-primary" : "border-transparent opacity-50 hover:opacity-100"
            }`}
        >
          <TerminalIcon className="size-4" />
          Testcase
        </button>
        <button
          onClick={() => setActiveTab("testresult")}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === "testresult" ? "border-primary text-primary" : "border-transparent opacity-50 hover:opacity-100"
            }`}
        >
          <div className={`size-2 rounded-full ${output ? (output.success ? 'bg-success' : 'bg-error') : 'bg-base-content/20'}`} />
          Test Result
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">

        {activeTab === "testcase" ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Case Navigation within Testcase Tab */}
            <div className="flex gap-2">
              {testCases.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`btn btn-sm rounded-xl px-4 normal-case ${selectedCaseIdx === idx ? "bg-base-300 font-black text-base-content" : "btn-ghost bg-base-200/50 opacity-50"
                    }`}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Input Data */}
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black opacity-30 mb-2 uppercase tracking-widest">Input</p>
                <div className="bg-base-200/50 rounded-2xl p-4 font-mono text-sm border border-base-300 text-base-content/80">
                  <pre className="whitespace-pre-wrap">{testCases[selectedCaseIdx]?.input || "N/A"}</pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full animate-in slide-in-from-bottom-2 duration-300">
            {!output ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-base-content/30 italic">
                <ClockIcon className="size-12 mb-4 opacity-10" />
                <p>Run your code to see results here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status Banner */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className={`text-2xl font-black ${output.success ? 'text-success' : 'text-error'}`}>
                      {output.status === "Accepted" ? "Accepted" : output.status}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-mono opacity-50">
                      <span className="flex items-center gap-1"><ZapIcon size={12} /> {Math.ceil(output.runtime)}ms</span>
                      <span className="flex items-center gap-1"><DatabaseIcon size={12} /> {(output.memory / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                  </div>
                </div>

                {/* Case Selector within Test Result */}
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {output.cases?.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCaseIdx(idx)}
                        className={`btn btn-sm rounded-xl px-4 normal-case gap-2 whitespace-nowrap ${selectedCaseIdx === idx
                          ? (c.status === 'Accepted' ? 'bg-success/20 text-success border-success/30' : 'bg-error/20 text-error border-error/30')
                          : 'btn-ghost bg-base-200/50 opacity-50'
                          }`}
                      >
                        {c.status === 'Accepted' ? <CheckCircle2Icon className="size-3" /> : <XCircleIcon className="size-3" />}
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {currentTestResult && (
                    <div className="space-y-6 animate-in fade-in duration-200 bg-base-200/30 p-6 rounded-3xl border border-base-300">
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-30 mb-2 tracking-widest">Input</p>
                        <div className="bg-base-300/50 rounded-xl p-3 font-mono text-xs text-base-content/70">
                          {testCases[selectedCaseIdx]?.input || "N/A"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-30 mb-2 tracking-widest">Output</p>
                          <div className={`rounded-xl p-3 font-mono text-sm whitespace-pre-wrap ${currentTestResult.status === 'Accepted' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                            }`}>
                            {JSON.stringify(currentTestResult.actual, null, 2)}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-30 mb-2 tracking-widest">Expected</p>
                          <div className="bg-base-300/50 rounded-xl p-3 font-mono text-sm whitespace-pre-wrap text-base-content/60">
                            {JSON.stringify(currentTestResult.expected, null, 2)}
                          </div>
                        </div>
                      </div>

                      {currentTestResult.error && (
                        <div className="mt-4 p-4 bg-error/5 rounded-2xl border border-error/10">
                          <p className="text-[10px] font-black text-error mb-2 uppercase tracking-widest">Runtime Error</p>
                          <pre className="text-xs font-mono text-error whitespace-pre-wrap opacity-80">{currentTestResult.error}</pre>
                        </div>
                      )}
                    </div>
                  )}

                  {!currentTestResult && output.status === "Runtime Error" && output.output && (
                    <div className="mt-4 p-6 bg-error/5 rounded-3xl border border-error/10">
                      <div className="flex items-center gap-2 mb-4 text-error">
                        <AlertCircleIcon size={18} />
                        <h4 className="font-black text-sm uppercase tracking-widest">Execution Error</h4>
                      </div>
                      <pre className="text-xs font-mono text-error whitespace-pre-wrap opacity-80 leading-relaxed">
                        {output.output}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
