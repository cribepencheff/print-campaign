export function slugify(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function formatEventDate(date: string) {
  const d = new Date(date);
  return {
    weekday: d.toLocaleDateString("sv-SE", { weekday: "short" }),
    date: d.toLocaleDateString("sv-SE", { day: "numeric" }),
    month: d.toLocaleDateString("sv-SE", { month: "numeric" }),
  };
}
