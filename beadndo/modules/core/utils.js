export function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

export function clampValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function formatValue(value, suffix = "", digits = 1) {
  if (value === null || value === undefined) {
    return window.siteI18n.t("dynamic.notAvailable");
  }

  return `${Number(value).toFixed(digits)}${suffix}`;
}

export function selectedValues(select) {
  return Array.from(select.selectedOptions).map((option) => option.value);
}

export function setMultiSelectValues(select, values) {
  const selected = new Set(values);
  Array.from(select.options).forEach((option) => {
    option.selected = selected.has(option.value);
  });
}
