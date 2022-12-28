export const formatDateTime = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);

  const years = String(date.getFullYear()).padStart(4, "0");
  const months = String(date.getMonth() + 1).padStart(2, "0");
  const days = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");

  return `${years}/${months}/${days} ${hours}:${mins}`;
};

export const formatMonogram = (name: string) => {
  return name
    .split(/\s+/, 2)
    .map((v) => v[0])
    .join("")
    .concat(name.slice(-1))
    .slice(-2)
    .toUpperCase();
};
