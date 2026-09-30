export const LOAD_TIMEOUT_MS = 10000;
export const LOADER_EXIT_MS = 480;
export type LoadingTasks = { canvas: number; font: number; brand: number };

// Completion of weighted work units, not an estimate of downloaded bytes.
export function loadingProgress(tasks: LoadingTasks) {
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  return Math.round(clamp(tasks.canvas) * 70 + clamp(tasks.font) * 20 + clamp(tasks.brand) * 10);
}
export function loadingComplete(tasks: LoadingTasks) {
  return tasks.canvas >= 1 && tasks.font >= 1 && tasks.brand >= 1;
}
