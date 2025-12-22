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
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select className="select select-sm font-bold bg-base-200 border-none rounded-lg" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm gap-2 font-bold" disabled={isRunning} onClick={onRunCode}>
            {isRunning ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <PlayIcon className="size-4" />
            )}
            Run
          </button>

          <button
            className={`btn btn-sm gap-2 px-6 font-bold ${isSolved ? 'btn-secondary' : 'btn-primary'}`}
            disabled={isRunning}
            onClick={onSubmit}
          >
            {isRunning && <Loader2Icon className="size-4 animate-spin" />}
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
