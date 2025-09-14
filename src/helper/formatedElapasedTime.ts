export const formattedElapsed = (time_spent: string) => {
  const minutes = Math.floor(Number(time_spent) / 60);
  const seconds = Number(time_spent) % 60;
  const formattedElapsed = `${minutes} Menit ${seconds.toString().padStart(2, "0")} Detik`;
  return formattedElapsed;
};
