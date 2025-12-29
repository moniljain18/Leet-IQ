import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/**
 * Executes code inside a local Docker container for maximum security and limit enforcement.
 */
export async function runCodeInDocker(language, code, options = {}) {
    const {
        timeLimit = 2000,    // ms
        memoryLimit = 128,   // MB
    } = options;

    const imageName = `leetiq-${language.toLowerCase()}`;
    const tempFileName = `code_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tempPath = path.join(os.tmpdir(), tempFileName);

    try {
        await fs.writeFile(tempPath, code);

        return new Promise((resolve) => {
            const start = performance.now();
            let timedOut = false;

            // Enforce hard memory limit via Docker
            const dockerArgs = [
                'run', '--rm', '-i',
                '--memory', `${memoryLimit}m`,
                '--cpus', '0.5',
                imageName
            ];

            const child = spawn('docker', dockerArgs);

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => { stdout += data; });
            child.stderr.on('data', (data) => { stderr += data; });

            // Handle TLE at the process level
            const timeout = setTimeout(() => {
                timedOut = true;
                child.kill('SIGKILL');
            }, timeLimit + 500); // 500ms safety buffer

            child.on('close', (code) => {
                clearTimeout(timeout);
                const end = performance.now();
                const totalContainerTime = parseFloat((end - start).toFixed(2));

                // Extract memory usage and clean output
                let memory = 0;
                const memMatch = stdout.match(/__MEMORY_USAGE__(\d+)/);
                if (memMatch) {
                    memory = parseInt(memMatch[1]);
                    stdout = stdout.replace(/__MEMORY_USAGE__\d+/, '').trim();
                }

                // If Docker exits with code 137, it usually means OOM (MLE) or SIGKILL (TLE)
                let status = "success";
                let error = null;

                if (timedOut) {
                    status = "Time Limit Exceeded";
                    error = "Process timed out";
                } else if (code === 137) {
                    status = "Memory Limit Exceeded";
                    error = "Process exceeded memory limit";
                } else if (code !== 0) {
                    status = "error";
                    error = stderr || "Execution failed";
                }

                resolve({
                    status,
                    output: stdout.trim(),
                    error,
                    runtime: totalContainerTime,
                    memory: memory
                });
            });

            // Pipe the code to stdin
            child.stdin.write(code);
            child.stdin.end();
        });
    } catch (err) {
        console.error("Docker Executor Error:", err);
        return {
            status: "system_error",
            error: err.message
        };
    } finally {
        try {
            await fs.unlink(tempPath);
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}
