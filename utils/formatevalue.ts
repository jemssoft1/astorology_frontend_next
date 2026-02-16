export const formatValue = (value: any): string => {
  if (value == null) return "-";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  // Tithi
  if (value.name && value.number) {
    return `${value.name} (${value.number}) • ${value.percentage?.toFixed(2)}%`;
  }

  // Yoga
  if (value.Name && value.Description) {
    return `${value.Name} – ${value.Description}`;
  }

  // Hora
  if (value.horaPlanet) {
    return `${value.horaPlanet} (${value.duration} min)`;
  }

  // Generic Name
  if (value.Name) {
    return value.Name;
  }

  // Fallback
  return JSON.stringify(value);
};
