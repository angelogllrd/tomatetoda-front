export const formatearFecha = (fechaString: string) => {
  if (!fechaString) return "";

  const [year, month, day] = fechaString.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  // Retorna siempre el formato: "3 may 2026"
  return `${parseInt(day, 10)} ${meses[parseInt(month, 10) - 1]} ${year}`;
};

export const formatearMoneda = (monto: number) => {
  if (monto === undefined || monto === null) return "$0";
  return "$" + monto.toLocaleString("es-AR");
};

export const getDaysRemaining = (dateString: string) => {
  if (!dateString) return "";

  const eventDate = new Date(dateString + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays < 0) return "Caducado";

  return `${diffDays}d restantes`;
};
