import {
  BENCHMARK_COUNTRY,
  DASHBOARD_INDICATORS,
  PROFILE_FOCUS_COUNTRIES,
  dashboardIndicatorMap
} from "../core/constants.js";
import { countryLabel, indicatorLabel, t, unitLabel } from "../core/i18n.js";
import { cloneState, setMultiSelectValues } from "../core/utils.js";
import { applyResponsiveChartSpec } from "../core/chart-runtime.js";
import { createCheckboxPicker } from "../ui/filter-picker.js";

let dashboardRuntimeState = null;

function formatDashboardValue(row) {
  const unit = unitLabel(row.unitKey);
  return `${Number(row.value).toFixed(row.decimals)} ${unit}`;
}

function formatIndicatorValue(indicatorKey, value) {
  const indicator = dashboardIndicatorMap[indicatorKey];
  if (!indicator) {
    return String(value);
  }
  return `${Number(value).toFixed(indicator.decimals)} ${unitLabel(indicator.unitKey)}`;
}

function formatIndicatorDelta(indicatorKey, value) {
  const indicator = dashboardIndicatorMap[indicatorKey];
  if (!indicator) {
    return String(value);
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(indicator.decimals)} ${unitLabel(indicator.unitKey)}`;
}

function formatPercent(value, digits = 1) {
  return `${Number(value).toFixed(digits)}%`;
}

function wrapDashboardAxisLabel(text) {
  const maxLineLength = window.innerWidth <= 700 ? 12 : window.innerWidth <= 1024 ? 16 : 18;
  const words = String(text).split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxLineLength) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
}

function buildDashboardDataset() {
  const rows = [];

  for (const row of window.chartData.municipalWastePerCapita) {
    rows.push({
      country: row.country,
      year: Number(row.year),
      indicatorKey: "municipal_waste_per_capita",
      value: Number(row.waste_kg_per_capita),
      unitKey: dashboardIndicatorMap.municipal_waste_per_capita.unitKey,
      decimals: dashboardIndicatorMap.municipal_waste_per_capita.decimals
    });
  }

  for (const row of window.chartData.wasteTreatmentComparison) {
    const indicatorKey =
      row.treatment_type === "Recycling"
        ? "recycling_share"
        : row.treatment_type === "Landfill"
          ? "landfill_share"
          : "energy_recovery_share";

    rows.push({
      country: row.country,
      year: Number(row.year),
      indicatorKey,
      value: Number(row.share_percent),
      unitKey: dashboardIndicatorMap[indicatorKey].unitKey,
      decimals: dashboardIndicatorMap[indicatorKey].decimals
    });
  }

  for (const row of window.chartData.renewableEnergyShare) {
    if (row.country === BENCHMARK_COUNTRY) {
      continue;
    }

    rows.push({
      country: row.country,
      year: Number(row.year),
      indicatorKey: "renewable_energy_share",
      value: Number(row.renewable_share_percent),
      unitKey: dashboardIndicatorMap.renewable_energy_share.unitKey,
      decimals: dashboardIndicatorMap.renewable_energy_share.decimals
    });
  }

  for (const row of window.chartData.circularVsRecycling) {
    rows.push({
      country: row.country,
      year: Number(row.year),
      indicatorKey: "circular_material_use_rate",
      value: Number(row.circular_material_use_rate_percent),
      unitKey: dashboardIndicatorMap.circular_material_use_rate.unitKey,
      decimals: dashboardIndicatorMap.circular_material_use_rate.decimals
    });
  }

  for (const row of window.chartData.ghgPerCapita) {
    rows.push({
      country: row.country,
      year: Number(row.year),
      indicatorKey: "ghg_per_capita",
      value: Number(row.ghg_tonnes_per_capita),
      unitKey: dashboardIndicatorMap.ghg_per_capita.unitKey,
      decimals: dashboardIndicatorMap.ghg_per_capita.decimals
    });
  }

  for (const row of window.chartData.energyRecoveryOverTime) {
    if (row.country === BENCHMARK_COUNTRY) {
      continue;
    }

    rows.push({
      country: row.country,
      year: Number(row.year),
      indicatorKey: "energy_recovery_level",
      value: Number(row.energy_recovery_kg_per_capita),
      unitKey: dashboardIndicatorMap.energy_recovery_level.unitKey,
      decimals: dashboardIndicatorMap.energy_recovery_level.decimals
    });
  }

  return rows
    .filter((row) => Number.isFinite(row.year) && Number.isFinite(row.value))
    .sort((left, right) => {
      if (left.country !== right.country) {
        return left.country.localeCompare(right.country);
      }
      if (left.indicatorKey !== right.indicatorKey) {
        return left.indicatorKey.localeCompare(right.indicatorKey);
      }
      return left.year - right.year;
    });
}

function localizeDashboardRows(rows) {
  return rows.map((row) => ({
    ...row,
    countryLabel: countryLabel(row.country),
    countryLabelWrapped: wrapDashboardAxisLabel(countryLabel(row.country)),
    indicatorLabel: indicatorLabel(row.indicatorKey),
    unitLabel: unitLabel(row.unitKey),
    formattedValue: formatDashboardValue(row)
  }));
}

function dashboardChartConfig() {
  const isCompactViewport = window.innerWidth <= 700;
  const isTabletViewport = window.innerWidth <= 1024;
  return {
    view: { stroke: null },
    axis: {
      labelColor: "#1f2a28",
      titleColor: "#1f2a28",
      gridColor: "rgba(31, 42, 40, 0.10)",
      labelFont: "Source Sans 3",
      titleFont: "Source Sans 3",
      labelLimit: isCompactViewport ? 180 : isTabletViewport ? 300 : 420,
      titleLimit: 1000,
      labelBound: true,
      titlePadding: isCompactViewport ? 10 : 12
    },
    legend: {
      labelLimit: isCompactViewport ? 140 : 220,
      titleLimit: 1000
    },
    title: {
      color: "#1f2a28",
      font: "Fraunces",
      fontSize: isCompactViewport ? 16 : isTabletViewport ? 18 : 20,
      anchor: "start",
      lineHeight: isCompactViewport ? 20 : 24
    }
  };
}

function dashboardHorizontalBarPadding() {
  if (window.innerWidth <= 700) {
    return { left: 24, right: 18, top: 10, bottom: 10 };
  }
  if (window.innerWidth <= 1024) {
    return { left: 28, right: 20, top: 12, bottom: 12 };
  }
  return { left: 32, right: 24, top: 14, bottom: 14 };
}

function dashboardHorizontalAxis() {
  const isCompactViewport = window.innerWidth <= 700;
  const isTabletViewport = window.innerWidth <= 1024;

  return {
    title: null,
    labelLimit: isCompactViewport ? 110 : isTabletViewport ? 130 : 150,
    labelPadding: 6,
    labelLineHeight: 14,
    tickSize: 0,
    minExtent: isCompactViewport ? 64 : isTabletViewport ? 78 : 88,
    maxExtent: isCompactViewport ? 78 : isTabletViewport ? 92 : 104
  };
}

function buildDashboardChartSpec(rows, state) {
  const indicatorCount = state.indicators.length;
  const countryCount = state.countries.length;
  const isTimeRange = state.startYear !== state.endYear;
  const isCompactViewport = window.innerWidth <= 700;
  const isTabletViewport = window.innerWidth <= 1024;
  const snapshotHeight = Math.max(
    isCompactViewport ? 220 : isTabletViewport ? 260 : 300,
    Math.min(
      isCompactViewport ? 360 : isTabletViewport ? 440 : 520,
      84 + countryCount * (isCompactViewport ? 14 : isTabletViewport ? 16 : 18)
    )
  );
  const trendFacetHeight =
    indicatorCount > 1
      ? isCompactViewport
        ? 150
        : isTabletViewport
          ? 165
          : 180
      : isCompactViewport
        ? 220
        : isTabletViewport
          ? 240
          : 260;
  const title = isTimeRange
    ? t("dashboard.chartTrendTitle")
    : t("dashboard.chartSnapshotTitle", { year: state.endYear });

  if (rows.length === 0) {
    return null;
  }

  if (!isTimeRange) {
    if (indicatorCount === 1) {
      return {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        title,
        padding: dashboardHorizontalBarPadding(),
        height: snapshotHeight,
        background: "transparent",
        data: { values: rows },
        mark: {
          type: "bar",
          cornerRadiusTopRight: 6,
          cornerRadiusBottomRight: 6,
          color: "#2f5d50"
        },
        encoding: {
          x: {
            field: "value",
            type: "quantitative",
            title: `${rows[0].indicatorLabel} (${rows[0].unitLabel})`
          },
          y: {
            field: "countryLabelWrapped",
            type: "nominal",
            sort: "-x",
            axis: dashboardHorizontalAxis()
          },
          tooltip: [
            { field: "countryLabel", type: "nominal", title: t("charts.countryTooltip") },
            { field: "indicatorLabel", type: "nominal", title: t("charts.indicatorTooltip") },
            { field: "year", type: "quantitative", title: t("charts.yearTooltip"), format: "d" },
            { field: "formattedValue", type: "nominal", title: t("charts.valueTooltip") }
          ]
        },
        config: dashboardChartConfig()
      };
    }

    return null;
  }

  if (countryCount > 10 && indicatorCount > 3) {
    return null;
  }

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title,
    background: "transparent",
    data: { values: rows },
    facet:
      indicatorCount > 1
        ? {
            row: {
              field: "indicatorLabel",
              type: "nominal",
              title: null,
              sort: state.indicators.map((key) => indicatorLabel(key)),
              header: {
                labelColor: "#1f2a28",
                labelFont: "Fraunces",
                labelFontSize: 14
              }
            }
          }
        : undefined,
    spec: {
      height: trendFacetHeight,
      mark: {
        type: "line",
        point: true,
        strokeWidth: 2.2
      },
      encoding: {
        x: {
          field: "year",
          type: "quantitative",
          title: t("charts.yearAxis"),
          axis: { format: "d" }
        },
        y: {
          field: "value",
          type: "quantitative",
          title:
            indicatorCount === 1
              ? `${rows[0].indicatorLabel} (${rows[0].unitLabel})`
              : t("charts.valueTooltip")
        },
        detail: { field: "country", type: "nominal" },
        color: {
          field: "countryLabel",
          type: "nominal",
          title: t("charts.countryLegend"),
          legend:
            countryCount > 12
              ? null
              : {
                  orient: isCompactViewport ? "bottom" : "top",
                  direction: "horizontal"
                }
        },
        tooltip: [
          { field: "countryLabel", type: "nominal", title: t("charts.countryTooltip") },
          { field: "indicatorLabel", type: "nominal", title: t("charts.indicatorTooltip") },
          { field: "year", type: "quantitative", title: t("charts.yearTooltip"), format: "d" },
          { field: "formattedValue", type: "nominal", title: t("charts.valueTooltip") }
        ]
      }
    },
    ...(indicatorCount > 1 ? { resolve: { scale: { y: "independent" } } } : {}),
    config: dashboardChartConfig()
  };
}

function buildDashboardFallbackSpec(rows, state) {
  if (!rows || rows.length === 0) {
    return null;
  }

  const fallbackIndicator =
    state.indicators.find((indicatorKey) => rows.some((row) => row.indicatorKey === indicatorKey)) ||
    rows[0].indicatorKey;
  const fallbackRows = rows.filter((row) => row.indicatorKey === fallbackIndicator);

  if (fallbackRows.length === 0) {
    return null;
  }

  const fallbackLabel = indicatorLabel(fallbackIndicator);
  const fallbackUnit = unitLabel(dashboardIndicatorMap[fallbackIndicator].unitKey);
  const isTrend = state.startYear !== state.endYear;

  if (!isTrend) {
    return {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      title: `${t("dashboard.currentView")}: ${fallbackLabel}`,
      background: "transparent",
      padding:
        window.innerWidth <= 700
          ? { left: 24, right: 18, top: 10, bottom: 18 }
          : window.innerWidth <= 1024
            ? { left: 28, right: 20, top: 12, bottom: 20 }
            : { left: 32, right: 24, top: 14, bottom: 22 },
      data: { values: fallbackRows },
      height: Math.max(220, Math.min(520, 84 + fallbackRows.length * 16)),
      mark: {
        type: "bar",
        cornerRadiusTopRight: 6,
        cornerRadiusBottomRight: 6,
        color: "#2f5d50"
      },
      encoding: {
        x: {
          field: "value",
          type: "quantitative",
          title: `${fallbackLabel} (${fallbackUnit})`
        },
        y: {
          field: "countryLabelWrapped",
          type: "nominal",
          sort: "-x",
          axis: dashboardHorizontalAxis()
        },
        tooltip: [
          { field: "countryLabel", type: "nominal", title: t("charts.countryTooltip") },
          { field: "year", type: "quantitative", title: t("charts.yearTooltip"), format: "d" },
          { field: "formattedValue", type: "nominal", title: t("charts.valueTooltip") }
        ]
      },
      config: dashboardChartConfig()
    };
  }

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: `${t("dashboard.currentView")}: ${fallbackLabel}`,
    background: "transparent",
    data: { values: fallbackRows },
    height: window.innerWidth <= 700 ? 220 : 260,
    mark: {
      type: "line",
      point: true,
      strokeWidth: 2.2
    },
    encoding: {
      x: {
        field: "year",
        type: "quantitative",
        title: t("charts.yearAxis"),
        axis: { format: "d" }
      },
      y: {
        field: "value",
        type: "quantitative",
        title: `${fallbackLabel} (${fallbackUnit})`
      },
      color: {
        field: "countryLabel",
        type: "nominal",
        title: t("charts.countryLegend")
      },
      detail: { field: "country", type: "nominal" },
      tooltip: [
        { field: "countryLabel", type: "nominal", title: t("charts.countryTooltip") },
        { field: "year", type: "quantitative", title: t("charts.yearTooltip"), format: "d" },
        { field: "formattedValue", type: "nominal", title: t("charts.valueTooltip") }
      ]
    },
    config: dashboardChartConfig()
  };
}

function average(values) {
  if (values.length === 0) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function compareIndicatorValues(left, right, direction) {
  return direction === "lower_better" ? left - right : right - left;
}

function buildRankMap(entries, getValue, direction) {
  return Object.fromEntries(
    [...entries]
      .sort((left, right) => compareIndicatorValues(getValue(left), getValue(right), direction))
      .map((entry, index) => [entry.country, index + 1])
  );
}

function buildIndicatorSummaries(rows, state) {
  const byIndicator = new Map();

  for (const row of rows) {
    if (!byIndicator.has(row.indicatorKey)) {
      byIndicator.set(row.indicatorKey, new Map());
    }

    const countries = byIndicator.get(row.indicatorKey);
    if (!countries.has(row.country)) {
      countries.set(row.country, []);
    }

    countries.get(row.country).push(row);
  }

  return state.indicators
    .map((indicatorKey) => {
      const indicatorMeta = dashboardIndicatorMap[indicatorKey];
      const byCountry = byIndicator.get(indicatorKey);
      if (!indicatorMeta || !byCountry) {
        return null;
      }

      const entries = Array.from(byCountry.entries())
        .map(([country, countryRows]) => {
          const sortedRows = [...countryRows].sort((left, right) => left.year - right.year);
          const first = sortedRows[0];
          const latest = sortedRows[sortedRows.length - 1];
          const hasTrend = sortedRows.length >= 2 && first.year !== latest.year;
          return {
            country,
            rows: sortedRows,
            first,
            latest,
            value: latest.value,
            trendDelta: hasTrend ? latest.value - first.value : null,
            hasTrend
          };
        })
        .sort((left, right) =>
          compareIndicatorValues(left.latest.value, right.latest.value, indicatorMeta.direction)
        )
        .map((entry, index, sortedEntries) => ({
          ...entry,
          rank: index + 1,
          score:
            sortedEntries.length === 1 ? 1 : 1 - index / Math.max(sortedEntries.length - 1, 1)
        }));

      if (entries.length === 0) {
        return null;
      }

      const values = entries.map((entry) => entry.latest.value);
      const leader = entries[0];
      const laggard = entries[entries.length - 1];
      const averageValue = average(values);
      const medianValue = median(values);
      const leaderAdvantageRaw =
        indicatorMeta.direction === "lower_better"
          ? averageValue - leader.latest.value
          : leader.latest.value - averageValue;
      const leaderAdvantageRatio =
        averageValue && Number.isFinite(averageValue)
          ? Math.abs(leaderAdvantageRaw) / Math.abs(averageValue)
          : null;

      const trendEntries = entries.filter((entry) => entry.hasTrend);
      const startRanks = buildRankMap(trendEntries, (entry) => entry.first.value, indicatorMeta.direction);
      const endRanks = buildRankMap(trendEntries, (entry) => entry.latest.value, indicatorMeta.direction);
      const improvingEntries = trendEntries
        .map((entry) => {
          const improvementScore =
            indicatorMeta.direction === "lower_better" ? -entry.trendDelta : entry.trendDelta;
          return {
            ...entry,
            startRank: startRanks[entry.country] ?? null,
            endRank: endRanks[entry.country] ?? null,
            improvementScore
          };
        })
        .filter((entry) => entry.improvementScore > 0)
        .sort((left, right) => right.improvementScore - left.improvementScore);

      return {
        indicatorKey,
        direction: indicatorMeta.direction,
        excellenceKey: indicatorMeta.excellenceKey,
        entries,
        leader,
        laggard,
        averageValue,
        medianValue,
        gapValue: Math.abs(leader.latest.value - laggard.latest.value),
        leaderAdvantageRatio,
        strongestImprover: improvingEntries[0] || null
      };
    })
    .filter(Boolean);
}

function valueByIndicator(summary, country) {
  return summary.entries.find((entry) => entry.country === country) || null;
}

function buildBalancedProfile(indicatorSummaries) {
  if (indicatorSummaries.length <= 1) {
    return null;
  }

  const byCountry = new Map();

  for (const summary of indicatorSummaries) {
    for (const entry of summary.entries) {
      if (!byCountry.has(entry.country)) {
        byCountry.set(entry.country, []);
      }
      byCountry.get(entry.country).push({
        indicatorKey: summary.indicatorKey,
        score: entry.score,
        rank: entry.rank
      });
    }
  }

  const requiredCoverage = indicatorSummaries.length;
  const candidates = Array.from(byCountry.entries())
    .filter(([, scores]) => scores.length === requiredCoverage)
    .map(([country, scores]) => ({
      country,
      averageScore: average(scores.map((item) => item.score)),
      averageRank: average(scores.map((item) => item.rank)),
      coverage: scores.length
    }))
    .sort((left, right) => {
      if (right.averageScore !== left.averageScore) {
        return right.averageScore - left.averageScore;
      }
      if (left.averageRank !== right.averageRank) {
        return left.averageRank - right.averageRank;
      }
      return left.country.localeCompare(right.country);
    });

  return candidates[0] || null;
}

function buildStandoutCountry(indicatorSummaries) {
  const counts = new Map();

  for (const summary of indicatorSummaries) {
    if (!counts.has(summary.leader.country)) {
      counts.set(summary.leader.country, { leads: 0, scores: [] });
    }
    counts.get(summary.leader.country).leads += 1;
  }

  for (const summary of indicatorSummaries) {
    for (const entry of summary.entries) {
      if (!counts.has(entry.country)) {
        counts.set(entry.country, { leads: 0, scores: [] });
      }
      counts.get(entry.country).scores.push(entry.score);
    }
  }

  const ranked = Array.from(counts.entries())
    .map(([country, record]) => ({
      country,
      leads: record.leads,
      averageScore: average(record.scores)
    }))
    .sort((left, right) => {
      if (right.leads !== left.leads) {
        return right.leads - left.leads;
      }
      if (right.averageScore !== left.averageScore) {
        return right.averageScore - left.averageScore;
      }
      return left.country.localeCompare(right.country);
    });

  return ranked[0] || null;
}

function buildSingleCountryProfile(indicatorSummaries, country) {
  const values = Object.fromEntries(
    indicatorSummaries
      .map((summary) => [summary.indicatorKey, valueByIndicator(summary, country)])
      .filter(([, entry]) => Boolean(entry))
  );

  const recycling = values.recycling_share?.latest.value ?? null;
  const landfill = values.landfill_share?.latest.value ?? null;
  const energyShare = values.energy_recovery_share?.latest.value ?? null;
  const circularity = values.circular_material_use_rate?.latest.value ?? null;
  const renewable = values.renewable_energy_share?.latest.value ?? null;
  const ghg = values.ghg_per_capita?.latest.value ?? null;
  const waste = values.municipal_waste_per_capita?.latest.value ?? null;
  const energyLevel = values.energy_recovery_level?.latest.value ?? null;

  let profileTypeKey = "dashboard.profileMixed";
  if (landfill !== null && landfill >= 40) {
    profileTypeKey = "dashboard.profileLandfill";
  } else if (recycling !== null && recycling >= 50 && landfill !== null && landfill < 20) {
    profileTypeKey = "dashboard.profileRecycling";
  } else if (landfill !== null && landfill <= 10 && energyShare !== null && energyShare >= 25) {
    profileTypeKey = "dashboard.profileLowLandfill";
  } else if (energyShare !== null && energyShare >= 25) {
    profileTypeKey = "dashboard.profileRecovery";
  }

  let strengthIndicatorKey = null;
  if (recycling !== null && recycling >= 45) {
    strengthIndicatorKey = "recycling_share";
  } else if (landfill !== null && landfill <= 15) {
    strengthIndicatorKey = "landfill_share";
  } else if (circularity !== null && circularity >= 15) {
    strengthIndicatorKey = "circular_material_use_rate";
  } else if (renewable !== null && renewable >= 35) {
    strengthIndicatorKey = "renewable_energy_share";
  } else if (energyShare !== null && energyShare >= 25) {
    strengthIndicatorKey = "energy_recovery_share";
  } else if (energyLevel !== null && energyLevel >= 150) {
    strengthIndicatorKey = "energy_recovery_level";
  }

  let pressureIndicatorKey = null;
  if (landfill !== null && landfill >= 30) {
    pressureIndicatorKey = "landfill_share";
  } else if (recycling !== null && recycling < 25) {
    pressureIndicatorKey = "recycling_share";
  } else if (circularity !== null && circularity < 10) {
    pressureIndicatorKey = "circular_material_use_rate";
  } else if (ghg !== null && ghg >= 8) {
    pressureIndicatorKey = "ghg_per_capita";
  } else if (waste !== null && waste >= 650) {
    pressureIndicatorKey = "municipal_waste_per_capita";
  }

  return {
    profileTypeKey,
    strengthIndicatorKey,
    pressureIndicatorKey,
    values
  };
}

function buildSnapshotPairNarratives(indicatorSummaries) {
  const narratives = [];
  const recyclingSummary = indicatorSummaries.find((item) => item.indicatorKey === "recycling_share");
  const landfillSummary = indicatorSummaries.find((item) => item.indicatorKey === "landfill_share");
  const circularitySummary = indicatorSummaries.find(
    (item) => item.indicatorKey === "circular_material_use_rate"
  );
  const energyShareSummary = indicatorSummaries.find(
    (item) => item.indicatorKey === "energy_recovery_share"
  );

  if (recyclingSummary && landfillSummary) {
    const candidates = recyclingSummary.entries
      .map((entry) => {
        const landfillEntry = valueByIndicator(landfillSummary, entry.country);
        if (!landfillEntry) {
          return null;
        }
        return {
          country: entry.country,
          composite: (entry.score + landfillEntry.score) / 2,
          recyclingValue: entry.latest.value,
          landfillValue: landfillEntry.latest.value
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.composite - left.composite);

    const bestCombo = candidates[0];
    if (
      bestCombo &&
      bestCombo.recyclingValue >= recyclingSummary.averageValue &&
      bestCombo.landfillValue <= landfillSummary.averageValue
    ) {
      narratives.push(
        t("dashboard.narrativePairRecyclingLandfill", {
          country: countryLabel(bestCombo.country)
        })
      );
    }
  }

  if (circularitySummary && recyclingSummary) {
    const circularLeader = circularitySummary.leader;
    const recyclingEntry = valueByIndicator(recyclingSummary, circularLeader.country);
    if (recyclingEntry && recyclingEntry.rank > Math.ceil(recyclingSummary.entries.length / 2)) {
      narratives.push(
        t("dashboard.narrativePairCircularity", {
          country: countryLabel(circularLeader.country)
        })
      );
    }
  }

  if (energyShareSummary && landfillSummary) {
    const energyLeader = energyShareSummary.leader;
    const landfillEntry = valueByIndicator(landfillSummary, energyLeader.country);
    if (landfillEntry && landfillEntry.latest.value > landfillSummary.medianValue) {
      narratives.push(
        t("dashboard.narrativePairEnergyLandfill", {
          country: countryLabel(energyLeader.country)
        })
      );
    }
  }

  return narratives;
}

function buildTrendNarratives(indicatorSummaries) {
  const improving = indicatorSummaries
    .filter((summary) => summary.strongestImprover)
    .map((summary) => ({
      summary,
      improver: summary.strongestImprover
    }))
    .sort((left, right) => right.improver.improvementScore - left.improver.improvementScore);

  if (improving.length === 0) {
    return [];
  }

  const strongest = improving[0];
  const narratives = [
    t("dashboard.narrativeTrendImprovement", {
      country: countryLabel(strongest.improver.country),
      indicator: indicatorLabel(strongest.summary.indicatorKey),
      delta: formatIndicatorDelta(strongest.summary.indicatorKey, strongest.improver.trendDelta),
      startYear: strongest.improver.first.year,
      endYear: strongest.improver.latest.year
    })
  ];

  if (
    strongest.improver.startRank !== null &&
    strongest.improver.endRank !== null &&
    strongest.improver.startRank !== strongest.improver.endRank
  ) {
    narratives.push(
      t("dashboard.narrativeTrendRank", {
        country: countryLabel(strongest.improver.country),
        startRank: strongest.improver.startRank,
        endRank: strongest.improver.endRank
      })
    );
  }

  return narratives;
}

function buildInsightModel(rows, state) {
  const countryCount = new Set(rows.map((row) => row.country)).size;
  const yearCount = new Set(rows.map((row) => row.year)).size;
  const isTrend = state.startYear !== state.endYear;

  if (rows.length === 0 || countryCount === 0) {
    return null;
  }

  const indicatorSummaries = buildIndicatorSummaries(rows, state);
  if (indicatorSummaries.length === 0) {
    return null;
  }

  if (countryCount === 1) {
    const country = rows[0].country;
    const profile = buildSingleCountryProfile(indicatorSummaries, country);
    const cards = [
      {
        label: t("dashboard.cardProfileType"),
        value: t(profile.profileTypeKey),
        note: t("dashboard.cardProfileTypeNote")
      },
      {
        label: t("dashboard.cardCoverage"),
        value: t("dashboard.cardCoverageValue", {
          indicators: indicatorSummaries.length,
          years: yearCount
        }),
        note: t("dashboard.cardCoverageNote", { count: rows.length })
      }
    ];

    if (profile.pressureIndicatorKey && profile.values[profile.pressureIndicatorKey]) {
      cards.splice(1, 0, {
        label: t("dashboard.cardNeedsImprovement"),
        value: indicatorLabel(profile.pressureIndicatorKey),
        note: formatIndicatorValue(
          profile.pressureIndicatorKey,
          profile.values[profile.pressureIndicatorKey].latest.value
        )
      });
    }

    const narratives = [];

    if (profile.strengthIndicatorKey && profile.values[profile.strengthIndicatorKey]) {
      narratives.push(
        t("dashboard.narrativeSingleCountryStrength", {
          country: countryLabel(country),
          indicator: t(dashboardIndicatorMap[profile.strengthIndicatorKey].excellenceKey),
          value: formatIndicatorValue(
            profile.strengthIndicatorKey,
            profile.values[profile.strengthIndicatorKey].latest.value
          )
        })
      );
    }

    if (profile.pressureIndicatorKey && profile.values[profile.pressureIndicatorKey]) {
      narratives.push(
        t("dashboard.narrativeSingleCountryWeakness", {
          country: countryLabel(country),
          indicator: indicatorLabel(profile.pressureIndicatorKey),
          value: formatIndicatorValue(
            profile.pressureIndicatorKey,
            profile.values[profile.pressureIndicatorKey].latest.value
          )
        })
      );
    }

    narratives.push(
      t("dashboard.narrativeCoverage", {
        count: rows.length,
        countries: countryCount,
        indicators: indicatorSummaries.length
      })
    );

    return {
      headline: t("dashboard.insightHeadlineSingleCountry", {
        country: countryLabel(country)
      }),
      cards,
      narratives
    };
  }

  const balanced = buildBalancedProfile(indicatorSummaries);
  const standout = buildStandoutCountry(indicatorSummaries);
  const biggestGap = [...indicatorSummaries].sort((left, right) => {
    const leftGap = left.leaderAdvantageRatio ?? 0;
    const rightGap = right.leaderAdvantageRatio ?? 0;
    return rightGap - leftGap;
  })[0];
  const topSummary =
    biggestGap ||
    [...indicatorSummaries].sort((left, right) => right.entries.length - left.entries.length)[0];

  const headline =
    balanced && indicatorSummaries.length > 1
      ? t("dashboard.insightHeadlineBalanced", {
          country: countryLabel(balanced.country)
        })
      : t("dashboard.insightHeadlineSingleIndicator", {
          country: countryLabel(topSummary.leader.country),
          indicator: indicatorLabel(topSummary.indicatorKey),
          laggard: countryLabel(topSummary.laggard.country),
          gap: formatIndicatorValue(topSummary.indicatorKey, topSummary.gapValue)
        });

  const cards = [
    {
      label: t("dashboard.cardTopPerformer"),
      value: countryLabel(topSummary.leader.country),
      note: t("dashboard.cardTopPerformerNote", {
        indicator: indicatorLabel(topSummary.indicatorKey),
        value: formatIndicatorValue(topSummary.indicatorKey, topSummary.leader.latest.value)
      })
    },
    {
      label: t("dashboard.cardBiggestGap"),
      value: formatIndicatorValue(biggestGap.indicatorKey, biggestGap.gapValue),
      note: t("dashboard.cardBiggestGapNote", {
        indicator: indicatorLabel(biggestGap.indicatorKey),
        leader: countryLabel(biggestGap.leader.country),
        laggard: countryLabel(biggestGap.laggard.country)
      })
    }
  ];

  if (standout) {
    cards.push({
      label: t("dashboard.cardStandoutCountry"),
      value: countryLabel(standout.country),
      note: t("dashboard.cardStandoutCountryNote", { count: standout.leads })
    });
  }

  if (balanced && indicatorSummaries.length > 1) {
    cards.push({
      label: t("dashboard.cardBalancedProfile"),
      value: countryLabel(balanced.country),
      note: t("dashboard.cardBalancedProfileNote", { count: balanced.coverage })
    });
  }

  const narratives = [];
  const featuredSummaries = indicatorSummaries
    .filter((summary) => summary.entries.length >= 2)
    .slice(0, Math.min(2, indicatorSummaries.length));

  for (const summary of featuredSummaries) {
    narratives.push(
      t("dashboard.narrativeLeader", {
        country: countryLabel(summary.leader.country),
        indicator: indicatorLabel(summary.indicatorKey),
        value: formatIndicatorValue(summary.indicatorKey, summary.leader.latest.value),
        laggard: countryLabel(summary.laggard.country),
        laggardValue: formatIndicatorValue(summary.indicatorKey, summary.laggard.latest.value)
      })
    );
  }

  if (biggestGap) {
    const gapPercent =
      biggestGap.leaderAdvantageRatio !== null
        ? formatPercent(biggestGap.leaderAdvantageRatio * 100, 0)
        : formatPercent(0, 0);
    narratives.push(
      t("dashboard.narrativeGap", {
        indicator: indicatorLabel(biggestGap.indicatorKey),
        gap: formatIndicatorValue(biggestGap.indicatorKey, biggestGap.gapValue),
        avgGapPercent: gapPercent
      })
    );
  }

  const extraNarratives = isTrend
    ? buildTrendNarratives(indicatorSummaries)
    : buildSnapshotPairNarratives(indicatorSummaries);

  for (const narrative of extraNarratives) {
    if (!narratives.includes(narrative)) {
      narratives.push(narrative);
    }
  }

  narratives.push(
    t("dashboard.narrativeCoverage", {
      count: rows.length,
      countries: countryCount,
      indicators: indicatorSummaries.length
    })
  );

  return {
    headline,
    cards,
    narratives: narratives.slice(0, 4)
  };
}

function renderDashboardInsights(rows, state) {
  const panel = document.querySelector("#dashboard-insight-panel");
  const headline = document.querySelector("#dashboard-insight-headline");
  const cardsWrap = document.querySelector("#dashboard-insight-cards");
  const list = document.querySelector("#dashboard-insight-list");

  if (!panel || !headline || !cardsWrap || !list) {
    return;
  }

  const model = buildInsightModel(rows, state);

  if (!model) {
    panel.hidden = true;
    headline.textContent = "";
    cardsWrap.innerHTML = "";
    list.innerHTML = "";
    return;
  }

  panel.hidden = false;
  headline.textContent = model.headline;
  cardsWrap.innerHTML = model.cards
    .map(
      (card) => `
        <article class="dashboard-insight-card">
          <p class="dashboard-insight-card__label">${card.label}</p>
          <p class="dashboard-insight-card__value">${card.value}</p>
          <p class="dashboard-insight-card__note">${card.note}</p>
        </article>
      `
    )
    .join("");
  list.innerHTML = model.narratives
    .map((item) => `<li class="dashboard-insight-list__item">${item}</li>`)
    .join("");
}

function renderDashboardTable(rows) {
  const body = document.querySelector("#dashboard-table-body");
  const summary = document.querySelector("#dashboard-table-summary");

  if (!body || !summary) {
    return;
  }

  if (rows.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="4">${t("dashboard.tableEmpty")}</td>
      </tr>
    `;
    summary.textContent = t("dashboard.tableRowsEmpty");
    return;
  }

  const sortedRows = [...rows].sort((left, right) => {
    if (left.country !== right.country) {
      return left.country.localeCompare(right.country);
    }
    if (left.indicatorKey !== right.indicatorKey) {
      return left.indicatorKey.localeCompare(right.indicatorKey);
    }
    return left.year - right.year;
  });

  body.innerHTML = sortedRows
    .map(
      (row) => `
        <tr>
          <td>${row.countryLabel}</td>
          <td>${row.indicatorLabel}</td>
          <td>${row.year}</td>
          <td>${row.formattedValue}</td>
        </tr>
      `
    )
    .join("");

  summary.textContent = t("dashboard.tableRows", { count: rows.length });
}

function renderDashboardSummary(rows, state, noteText) {
  const summary = document.querySelector("#dashboard-summary");
  const note = document.querySelector("#dashboard-note");

  if (!summary || !note) {
    return;
  }

  if (rows.length === 0) {
    summary.textContent = t("dashboard.summaryEmpty");
  } else {
    summary.textContent = t("dashboard.summary", {
      countries: state.countries.length,
      indicators: state.indicators.length,
      startYear: state.startYear,
      endYear: state.endYear
    });
  }

  note.textContent = noteText;
}

async function renderDashboardChart(rows, state) {
  const container = document.querySelector("#dashboard-chart");
  if (!container) {
    return;
  }

  const spec = buildDashboardChartSpec(rows, state);
  const fallbackSpec = buildDashboardFallbackSpec(rows, state);

  if (!spec && !fallbackSpec) {
    container.innerHTML = `
      <div class="chart-error">
        <strong>${t("dashboard.chartDenseTitle")}</strong>
        <p>${t("dashboard.chartDenseText")}</p>
      </div>
    `;
    return;
  }

  try {
    const responsiveSpec = applyResponsiveChartSpec(spec || fallbackSpec, container, {
      minWidth: window.innerWidth <= 700 ? 280 : 420
    });
    await window.vegaEmbed(container, responsiveSpec, { actions: false, renderer: "canvas" });
  } catch (error) {
    console.error("Failed to render dashboard chart:", error);

    if (fallbackSpec && spec) {
      try {
        const responsiveFallbackSpec = applyResponsiveChartSpec(fallbackSpec, container, {
          minWidth: window.innerWidth <= 700 ? 280 : 420
        });
        await window.vegaEmbed(container, responsiveFallbackSpec, {
          actions: false,
          renderer: "canvas"
        });
        return;
      } catch (fallbackError) {
        console.error("Failed to render dashboard fallback chart:", fallbackError);
      }
    }

    container.innerHTML = `
      <div class="chart-error">
        <strong>${t("dashboard.chartErrorTitle")}</strong>
        <p>${t("dashboard.chartErrorText")}</p>
      </div>
    `;
  }
}

function setupDashboardPicker(select, config) {
  const group = select.closest(".dashboard-control-group");
  if (!group) {
    return { sync: () => {}, setSelected: () => {} };
  }

  group.querySelector(".filter-picker")?.remove();
  select.classList.add("dashboard-control-group__select--hidden");

  const picker = createCheckboxPicker({
    labelText: config.labelText,
    options: config.options,
    selected: config.selected,
    nounKey: config.nounKey,
    defaultMessage: config.defaultMessage,
    onChange: (nextValues) => {
      setMultiSelectValues(select, nextValues);
      config.onChange(nextValues);
    },
    formatOption: config.formatOption
  });

  group.insertBefore(picker.element, select);
  return picker;
}

export function renderDashboard() {
  const countrySelect = document.querySelector("#dashboard-countries");
  const indicatorSelect = document.querySelector("#dashboard-indicators");
  const yearStartSelect = document.querySelector("#dashboard-year-start");
  const yearEndSelect = document.querySelector("#dashboard-year-end");
  const resetButton = document.querySelector("#dashboard-reset");

  if (!countrySelect || !indicatorSelect || !yearStartSelect || !yearEndSelect || !resetButton) {
    return;
  }

  const dashboardRows = buildDashboardDataset();
  const availableCountries = Array.from(new Set(dashboardRows.map((row) => row.country))).sort(
    (left, right) => left.localeCompare(right)
  );
  const availableYears = Array.from(new Set(dashboardRows.map((row) => row.year))).sort(
    (left, right) => left - right
  );
  const defaultCountries = PROFILE_FOCUS_COUNTRIES.filter((country) =>
    availableCountries.includes(country)
  );

  const defaultState = {
    countries: defaultCountries.length > 0 ? defaultCountries : availableCountries.slice(0, 5),
    indicators: ["municipal_waste_per_capita"],
    startYear: availableYears[availableYears.length - 1],
    endYear: availableYears[availableYears.length - 1]
  };

  if (!dashboardRuntimeState) {
    dashboardRuntimeState = cloneState(defaultState);
  }

  dashboardRuntimeState.countries = dashboardRuntimeState.countries.filter((country) =>
    availableCountries.includes(country)
  );
  if (dashboardRuntimeState.countries.length === 0) {
    dashboardRuntimeState.countries = defaultState.countries.slice();
  }

  dashboardRuntimeState.indicators = dashboardRuntimeState.indicators.filter((indicator) =>
    DASHBOARD_INDICATORS.some((item) => item.key === indicator)
  );
  if (dashboardRuntimeState.indicators.length === 0) {
    dashboardRuntimeState.indicators = defaultState.indicators.slice();
  }

  if (!availableYears.includes(dashboardRuntimeState.startYear)) {
    dashboardRuntimeState.startYear = defaultState.startYear;
  }
  if (!availableYears.includes(dashboardRuntimeState.endYear)) {
    dashboardRuntimeState.endYear = defaultState.endYear;
  }

  countrySelect.innerHTML = "";
  indicatorSelect.innerHTML = "";
  yearStartSelect.innerHTML = "";
  yearEndSelect.innerHTML = "";

  for (const country of availableCountries) {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = countryLabel(country);
    option.selected = dashboardRuntimeState.countries.includes(country);
    countrySelect.append(option);
  }

  for (const indicator of DASHBOARD_INDICATORS) {
    const option = document.createElement("option");
    option.value = indicator.key;
    option.textContent = `${indicatorLabel(indicator.key)} (${unitLabel(indicator.unitKey)})`;
    option.selected = dashboardRuntimeState.indicators.includes(indicator.key);
    indicatorSelect.append(option);
  }

  for (const year of availableYears) {
    const startOption = document.createElement("option");
    startOption.value = String(year);
    startOption.textContent = String(year);
    startOption.selected = year === dashboardRuntimeState.startYear;
    yearStartSelect.append(startOption);

    const endOption = document.createElement("option");
    endOption.value = String(year);
    endOption.textContent = String(year);
    endOption.selected = year === dashboardRuntimeState.endYear;
    yearEndSelect.append(endOption);
  }

  const countryPicker = setupDashboardPicker(countrySelect, {
    labelText: t("dashboard.countries"),
    options: availableCountries,
    selected: dashboardRuntimeState.countries,
    nounKey: "countriesNoun",
    defaultMessage: t("dynamic.filterDefaults"),
    onChange: (nextValues) => {
      dashboardRuntimeState.countries = nextValues;
      rerenderDashboard();
    },
    formatOption: countryLabel
  });

  const indicatorPicker = setupDashboardPicker(indicatorSelect, {
    labelText: t("dashboard.indicators"),
    options: DASHBOARD_INDICATORS.map((indicator) => indicator.key),
    selected: dashboardRuntimeState.indicators,
    nounKey: "indicatorsNoun",
    defaultMessage: t("dynamic.allOptionsDefault"),
    onChange: (nextValues) => {
      dashboardRuntimeState.indicators = nextValues;
      rerenderDashboard();
    },
    formatOption: (value) =>
      `${indicatorLabel(value)} (${unitLabel(dashboardIndicatorMap[value].unitKey)})`
  });

  function updateStateFromControls() {
    dashboardRuntimeState.startYear = Number(yearStartSelect.value);
    dashboardRuntimeState.endYear = Number(yearEndSelect.value);

    if (dashboardRuntimeState.startYear > dashboardRuntimeState.endYear) {
      const swap = dashboardRuntimeState.startYear;
      dashboardRuntimeState.startYear = dashboardRuntimeState.endYear;
      dashboardRuntimeState.endYear = swap;
      yearStartSelect.value = String(dashboardRuntimeState.startYear);
      yearEndSelect.value = String(dashboardRuntimeState.endYear);
    }

    countryPicker.setSelected(dashboardRuntimeState.countries);
    indicatorPicker.setSelected(dashboardRuntimeState.indicators);
  }

  async function rerenderDashboard() {
    updateStateFromControls();

    const noteParts = [];
    const candidateRows = dashboardRows
      .filter((row) => dashboardRuntimeState.countries.includes(row.country))
      .filter((row) => dashboardRuntimeState.indicators.includes(row.indicatorKey));

    let visibleRows = candidateRows.filter(
      (row) => row.year >= dashboardRuntimeState.startYear && row.year <= dashboardRuntimeState.endYear
    );

    if (visibleRows.length === 0 && candidateRows.length > 0) {
      if (dashboardRuntimeState.startYear === dashboardRuntimeState.endYear) {
        const fallbackYear = Math.max(...candidateRows.map((row) => row.year));
        dashboardRuntimeState.startYear = fallbackYear;
        dashboardRuntimeState.endYear = fallbackYear;
        yearStartSelect.value = String(fallbackYear);
        yearEndSelect.value = String(fallbackYear);
        visibleRows = candidateRows.filter((row) => row.year === fallbackYear);
      } else {
        const minYear = Math.min(...candidateRows.map((row) => row.year));
        const maxYear = Math.max(...candidateRows.map((row) => row.year));
        dashboardRuntimeState.startYear = minYear;
        dashboardRuntimeState.endYear = maxYear;
        yearStartSelect.value = String(minYear);
        yearEndSelect.value = String(maxYear);
        visibleRows = candidateRows.filter((row) => row.year >= minYear && row.year <= maxYear);
      }
    }

    const filteredRows = localizeDashboardRows(visibleRows);
    const selectedKeys = new Set(dashboardRuntimeState.indicators);

    if (dashboardRuntimeState.startYear !== dashboardRuntimeState.endYear) {
      const snapshotOnly = [
        "municipal_waste_per_capita",
        "recycling_share",
        "landfill_share",
        "energy_recovery_share",
        "circular_material_use_rate",
        "ghg_per_capita"
      ].filter((key) => selectedKeys.has(key));

      if (snapshotOnly.length > 0) {
        noteParts.push(t("dashboard.noteSparse"));
      }
    }

    if (dashboardRuntimeState.countries.length === 0 || dashboardRuntimeState.indicators.length === 0) {
      noteParts.push(t("dashboard.noteNeedSelection"));
    }

    renderDashboardSummary(
      filteredRows,
      dashboardRuntimeState,
      noteParts[0] || t("dashboard.noteAutoUpdate")
    );
    renderDashboardInsights(visibleRows, dashboardRuntimeState);
    renderDashboardTable(filteredRows);
    await renderDashboardChart(filteredRows, dashboardRuntimeState);
  }

  countrySelect.onchange = rerenderDashboard;
  indicatorSelect.onchange = rerenderDashboard;
  yearStartSelect.onchange = rerenderDashboard;
  yearEndSelect.onchange = rerenderDashboard;
  resetButton.onclick = () => {
    dashboardRuntimeState = cloneState(defaultState);
    setMultiSelectValues(countrySelect, defaultState.countries);
    setMultiSelectValues(indicatorSelect, defaultState.indicators);
    yearStartSelect.value = String(defaultState.startYear);
    yearEndSelect.value = String(defaultState.endYear);
    rerenderDashboard();
  };

  rerenderDashboard();
}
