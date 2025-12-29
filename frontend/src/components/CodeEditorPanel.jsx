import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onSubmit,
  isSolved,
  contestId
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-base-100 border-b border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-5"
          />
          <select className="select select-xs font-bold bg-base-200 border-none rounded-lg" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost btn-xs gap-2 font-black normal-case opacity-50 hover:opacity-100"
            disabled={isRunning}
            onClick={onRunCode}
          >
            {isRunning ? <Loader2Icon className="size-3 animate-spin" /> : <PlayIcon className="size-3 fill-current" />}
            Run
          </button>
          <button
            className={`btn btn-xs gap-2 px-4 font-black normal-case ${isSolved ? 'btn-secondary' : 'btn-primary'}`}
            disabled={isRunning}
            onClick={onSubmit}
          >
            {isRunning && <Loader2Icon className="size-3 animate-spin" />}
            {isSolved ? 'Save Changes' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
