function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className="text-base-content/50 text-sm">Click "Run Code" to see the output here...</p>
        ) : output.success ? (
          <div>
            <pre className="text-sm font-mono text-success whitespace-pre-wrap">{output.output}</pre>
            {output.runtime !== undefined && (
              <div className="mt-4 pt-4 border-t border-base-300 text-xs text-base-content/60 font-mono">
                <p>Runtime: <span className="text-base-content/90 font-semibold">{output.runtime}ms</span> (Total latency)</p>
                {output.memory !== null && (
                  <p>Memory: <span className="text-base-content/90 font-semibold">{(output.memory / 1024 / 1024).toFixed(2)} MB</span></p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-error whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
