import { t } from "./i18n.js";
import { clampValue } from "./utils.js";

export function getResponsiveChartWidth(container, options = {}) {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1280;
  const framePadding = options.framePadding ?? (viewportWidth <= 480 ? 20 : viewportWidth <= 700 ? 24 : 28);
  const availableWidth = Math.max((container?.clientWidth || 0) - framePadding, 0);

  if (availableWidth === 0) {
    return options.fallbackWidth ?? 640;
  }

  const minWidth = options.minWidth ?? (viewportWidth <= 480 ? 260 : viewportWidth <= 700 ? 300 : 420);
  const maxWidth = options.maxWidth ?? Math.max(availableWidth, minWidth);
  return clampValue(availableWidth, minWidth, maxWidth);
}

export function applyResponsiveChartSpec(spec, container, options = {}) {
  const width = getResponsiveChartWidth(container, options);
  const isCompactViewport = window.innerWidth <= 700;
  const isTabletViewport = window.innerWidth <= 1024;
  const defaultPadding = isCompactViewport
    ? { left: 6, right: 12, top: 8, bottom: 6 }
    : isTabletViewport
      ? { left: 8, right: 14, top: 10, bottom: 8 }
      : { left: 10, right: 16, top: 12, bottom: 10 };

  return {
    ...spec,
    width,
    autosize: {
      type: "fit-x",
      contains: "padding"
    },
    padding: spec.padding || defaultPadding,
    config: {
      ...(spec.config || {}),
      axis: {
        ...(spec.config?.axis || {}),
        labelLimit: isCompactViewport ? 180 : isTabletViewport ? 300 : 420,
        titleLimit: 1000,
        labelBound: true,
        titlePadding: isCompactViewport ? 10 : 12
      },
      legend: {
        ...(spec.config?.legend || {}),
        orient: isCompactViewport ? "bottom" : spec.config?.legend?.orient,
        direction: isCompactViewport ? "horizontal" : spec.config?.legend?.direction,
        labelLimit: isCompactViewport ? 140 : 220,
        titleLimit: 1000
      },
      title: {
        ...(spec.config?.title || {}),
        fontSize: isCompactViewport ? 16 : isTabletViewport ? 18 : 20,
        limit: width,
        lineHeight: isCompactViewport ? 20 : 24
      }
    }
  };
}

export function renderEmptyChartMessage(container) {
  container.innerHTML = `
    <div class="chart-error">
      <strong>${t("dynamic.noChartDataTitle")}</strong>
      <p>${t("dynamic.noChartDataText")}</p>
    </div>
  `;
}
