import { spawn } from "node:child_process";

const processes = [
  spawn(process.execPath, ["apps/api/index.js"], {
    stdio: "inherit",
    env: process.env,
  }),
  spawn(process.execPath, ["apps/web/server.js"], {
    stdio: "inherit",
    env: process.env,
  }),
];

let shuttingDown = false;
let requestedExitCode = 0;

function allProcessesExited() {
  return processes.every(
    (child) => child.exitCode !== null || child.signalCode !== null,
  );
}

function stop(signal, exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;
  requestedExitCode = exitCode;

  for (const child of processes) {
    if (child.exitCode === null && child.signalCode === null) child.kill(signal);
  }

  setTimeout(() => {
    for (const child of processes) {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill("SIGKILL");
      }
    }
  }, 5_000).unref();
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => stop(signal, 0));
}

for (const child of processes) {
  child.once("error", (error) => {
    console.error(error);
    stop("SIGTERM", 1);
  });
  child.once("exit", (code, signal) => {
    if (!shuttingDown) {
      console.error(`A production process exited (${signal ?? code ?? 1})`);
      stop("SIGTERM", code ?? 1);
    }
    if (allProcessesExited()) process.exit(requestedExitCode);
  });
}
