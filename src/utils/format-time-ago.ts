export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) {
    return "саяхан";
  }
  if (diffMin < 60) {
    return `${diffMin} минутын өмнө`;
  }
  if (diffHr < 24) {
    return `${diffHr} цагийн өмнө`;
  }

  return `${diffDay} өдрийн өмнө`;
};
