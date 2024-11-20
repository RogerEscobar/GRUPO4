export const formatExtraHourType = (type) => {
  const types = {
    EXTRA_DIURNA: "Extra Diurna",
    EXTRA_NOCTURNA: "Extra Nocturna",
    DOMINICAL_DIURNA: "Dominical Diurna",
    EXTRA_DOMINICAL_DIURNA: "Extra Dominical Diurna",
    DOMINICAL_NOCTURNA: "Dominical Nocturna",
    EXTRA_DOMINICAL_NOCTURNA: "Extra Dominical Nocturna",
    RECARGO_NOCTURNO: "Recargo Nocturno",
  };
  return types[type] || type;
};
