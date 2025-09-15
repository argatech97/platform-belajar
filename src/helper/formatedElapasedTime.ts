export const formattedElapsed = (time_spent: string) => {
  const totalSeconds = Number(time_spent);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  const formattedSeconds = seconds.toString().padStart(2, "0");
  return `${minutes} Menit ${formattedSeconds} Detik`;
};
