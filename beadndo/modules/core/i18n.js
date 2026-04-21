export function t(path, params = {}) {
  return window.siteI18n.t(path, params);
}

export function countryLabel(name) {
  return window.siteI18n.country(name);
}

export function indicatorLabel(indicatorKey) {
  return t(`dashboardIndicators.${indicatorKey}`);
}

export function unitLabel(unitKey) {
  return t(unitKey);
}

export function treatmentLabel(value) {
  if (value === "Recycling") {
    return t("charts.treatment.recycling");
  }
  if (value === "Landfill") {
    return t("charts.treatment.landfill");
  }
  if (value === "Incineration with energy recovery") {
    return t("charts.treatment.energy");
  }
  return value;
}
