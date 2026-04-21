/*
  The source CSV files remain in /data, but the charts render from chartData,
  a generated local JavaScript object loaded from data/chart-data.js.
  This avoids runtime CSV fetch issues when the page is opened as a simple
  static file while keeping the underlying data files easy to inspect.
*/

const CHART_BENCHMARK_COUNTRY = "EU average";
const SERIES_COLORS = ["#2f5d50", "#b77a52", "#5d7d8a", "#7b8f47", "#8b5a3c", "#4f6d7a"];

function ct(path, params = {}) {
  return window.siteI18n.t(path, params);
}

function localizedCountry(name) {
  return window.siteI18n.country(name);
}

function localizedTreatment(value) {
  if (value === "Recycling") {
    return ct("charts.treatment.recycling");
  }
  if (value === "Landfill") {
    return ct("charts.treatment.landfill");
  }
  if (value === "Incineration with energy recovery") {
    return ct("charts.treatment.energy");
  }
  return value;
}

function localizeCountryRows(rows) {
  return rows.map((row) => ({
    ...row,
    countryLabel: localizedCountry(row.country)
  }));
}

function localizeTreatmentRows(rows) {
  return rows.map((row) => ({
    ...row,
    countryLabel: localizedCountry(row.country),
    treatmentLabel: localizedTreatment(row.treatment_type)
  }));
}

const countryLists = {
  municipal: uniqueCountries(chartData.municipalWastePerCapita),
  treatment: uniqueCountries(chartData.wasteTreatmentComparison),
  renewable: uniqueCountries(chartData.renewableEnergyShare, {
    exclude: [CHART_BENCHMARK_COUNTRY]
  }),
  circular: uniqueCountries(chartData.circularVsRecycling),
  ghg: uniqueCountries(chartData.ghgPerCapita),
  energy: uniqueCountries(chartData.energyRecoveryOverTime, {
    exclude: [CHART_BENCHMARK_COUNTRY]
  })
};

const treatmentOptions = [
  "Recycling",
  "Landfill",
  "Incineration with energy recovery"
];

const sharedConfig = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  autosize: {
    type: "fit-x",
    contains: "padding"
  },
  width: 640,
  height: 280,
  background: "transparent",
  config: {
    view: {
      stroke: null
    },
    axis: {
      labelColor: "#1f2a28",
      titleColor: "#1f2a28",
      gridColor: "rgba(31, 42, 40, 0.10)",
      labelFont: "Source Sans 3",
      titleFont: "Source Sans 3",
      titleFontWeight: 700,
      labelLimit: 160,
      titleLimit: 220,
      labelOverlap: true
    },
    legend: {
      labelColor: "#1f2a28",
      titleColor: "#1f2a28",
      labelFont: "Source Sans 3",
      titleFont: "Source Sans 3",
      labelLimit: 150,
      titleLimit: 180
    },
    title: {
      color: "#1f2a28",
      font: "Fraunces",
      fontSize: 20,
      anchor: "start"
    }
  }
};

function buildSpec(spec) {
  return {
    ...sharedConfig,
    ...spec,
    config: {
      ...sharedConfig.config,
      ...(spec.config || {})
    }
  };
}

function inlineData(values) {
  return { values };
}

function isCompactViewport() {
  return window.innerWidth <= 700;
}

function isTabletViewport() {
  return window.innerWidth <= 1024;
}

function categoricalChartHeight(count, options = {}) {
  const compact = isCompactViewport();
  const tablet = isTabletViewport();
  const step = compact
    ? options.mobileStep ?? 14
    : tablet
      ? options.tabletStep ?? 16
      : options.desktopStep ?? 18;
  const base = options.base ?? 86;
  const min = compact ? options.mobileMin ?? 240 : tablet ? options.tabletMin ?? 280 : options.desktopMin ?? 320;
  const max = compact ? options.mobileMax ?? 420 : tablet ? options.tabletMax ?? 520 : options.desktopMax ?? 640;
  return Math.max(min, Math.min(max, base + count * step));
}

function trendChartHeight() {
  if (isCompactViewport()) {
    return 260;
  }
  if (isTabletViewport()) {
    return 300;
  }
  return 340;
}

function horizontalLabelLimit() {
  if (isCompactViewport()) {
    return 120;
  }
  if (isTabletViewport()) {
    return 180;
  }
  return 260;
}

function horizontalChartPadding() {
  if (isCompactViewport()) {
    return { left: 92, right: 18, top: 10, bottom: 10 };
  }
  if (isTabletViewport()) {
    return { left: 132, right: 20, top: 12, bottom: 12 };
  }
  return { left: 176, right: 24, top: 14, bottom: 14 };
}

function uniqueCountries(rows, options = {}) {
  const excluded = new Set(options.exclude || []);
  return Array.from(
    new Set(rows.map((row) => row.country).filter((country) => !excluded.has(country)))
  ).sort((left, right) => left.localeCompare(right));
}

function filterByCountries(rows, countries) {
  if (!countries || countries.length === 0) {
    return [];
  }

  const selected = new Set(countries);
  return rows.filter((row) => selected.has(row.country));
}

function baseLineTooltip(valueField, valueTitle) {
  return [
    { field: "countryLabel", type: "nominal", title: ct("charts.countryTooltip") },
    { field: "year", type: "quantitative", title: ct("charts.yearTooltip"), format: "d" },
    { field: valueField, type: "quantitative", title: valueTitle }
  ];
}

function colorScaleForCountries(countries) {
  return {
    domain: countries.map((country) => localizedCountry(country)),
    range: countries.map((_, index) => SERIES_COLORS[index % SERIES_COLORS.length])
  };
}

function buildMunicipalWasteSpec(state) {
  const rows = localizeCountryRows(
    filterByCountries(chartData.municipalWastePerCapita, state.countries)
  );
  if (rows.length === 0) {
    return null;
  }

  return buildSpec({
    title: ct("charts.wasteTitle"),
    data: inlineData(rows),
    padding: horizontalChartPadding(),
    height: categoricalChartHeight(rows.length, {
      desktopStep: 18,
      tabletStep: 16,
      mobileStep: 14
    }),
    mark: {
      type: "bar",
      cornerRadiusTopRight: 6,
      cornerRadiusBottomRight: 6,
      color: "#2f5d50"
    },
    encoding: {
      x: {
        field: "waste_kg_per_capita",
        type: "quantitative",
        title: ct("charts.wasteAxis")
      },
      y: {
        field: "countryLabel",
        type: "nominal",
        sort: "-x",
        axis: {
          title: null,
          labelLimit: horizontalLabelLimit(),
          labelPadding: 8,
          labelLineHeight: 14,
          tickSize: 0
        }
      },
      tooltip: [
        { field: "countryLabel", type: "nominal", title: ct("charts.countryTooltip") },
        {
          field: "waste_kg_per_capita",
          type: "quantitative",
          title: ct("charts.wasteTooltip")
        },
        { field: "year", type: "quantitative", title: ct("charts.yearTooltip"), format: "d" }
      ]
    }
  });
}

function buildWasteTreatmentSpec(state) {
  const rows = localizeTreatmentRows(
    chartData.wasteTreatmentComparison.filter(
      (row) =>
        state.countries.includes(row.country) &&
        state.treatmentTypes.includes(row.treatment_type)
    )
  );

  if (rows.length === 0) {
    return null;
  }

  return buildSpec({
    title: ct("charts.treatmentTitle"),
    data: inlineData(rows),
    padding: horizontalChartPadding(),
    height: categoricalChartHeight(state.countries.length, {
      desktopStep: 18,
      tabletStep: 16,
      mobileStep: 14
    }),
    mark: {
      type: "bar",
      cornerRadiusTopRight: 4,
      cornerRadiusBottomRight: 4
    },
    encoding: {
      x: {
        field: "share_percent",
        type: "quantitative",
        stack: "zero",
        title: ct("charts.treatmentAxis")
      },
      y: {
        field: "countryLabel",
        type: "nominal",
        sort: "-x",
        axis: {
          title: null,
          labelLimit: horizontalLabelLimit(),
          labelPadding: 8,
          labelLineHeight: 14,
          tickSize: 0
        }
      },
      color: {
        field: "treatmentLabel",
        type: "nominal",
        title: ct("charts.treatmentLegend"),
        legend: {
          orient: isCompactViewport() ? "bottom" : "top",
          direction: isCompactViewport() ? "horizontal" : "horizontal",
          columns: isCompactViewport() ? 1 : 3
        },
        scale: {
          domain: treatmentOptions.map((value) => localizedTreatment(value)),
          range: ["#2f5d50", "#b77a52", "#7b8f47"]
        }
      },
      tooltip: [
        { field: "countryLabel", type: "nominal", title: ct("charts.countryTooltip") },
        { field: "treatmentLabel", type: "nominal", title: ct("charts.treatmentLegend") },
        { field: "share_percent", type: "quantitative", title: ct("charts.treatmentTooltip") },
        { field: "year", type: "quantitative", title: ct("charts.yearTooltip"), format: "d" }
      ]
    }
  });
}

function buildRenewableEnergySpec(state) {
  let rows = localizeCountryRows(
    filterByCountries(chartData.renewableEnergyShare, state.countries)
  );

  if (state.includeBenchmark) {
    rows = rows.concat(
      localizeCountryRows(
        chartData.renewableEnergyShare.filter((row) => row.country === CHART_BENCHMARK_COUNTRY)
      )
    );
  }

  if (rows.length === 0) {
    return null;
  }

  const visibleCountries = state.countries.slice();
  const useCountryColors = visibleCountries.length <= 6;
  const layers = [];

  if (state.includeBenchmark) {
    layers.push({
      transform: [{ filter: `datum.country === '${CHART_BENCHMARK_COUNTRY}'` }],
      mark: {
        type: "line",
        strokeWidth: 2.8,
        strokeDash: [7, 5],
        color: "#1f2a28"
      },
      encoding: {
        x: {
          field: "year",
          type: "quantitative",
          title: ct("charts.yearAxis"),
          axis: { format: "d" }
        },
        y: {
          field: "renewable_share_percent",
          type: "quantitative",
          title: ct("charts.renewableAxis")
        },
        tooltip: baseLineTooltip("renewable_share_percent", ct("charts.renewableTooltip"))
      }
    });
  }

  if (useCountryColors) {
    layers.push({
      transform: [{ filter: `datum.country !== '${CHART_BENCHMARK_COUNTRY}'` }],
      mark: {
        type: "line",
        point: true,
        strokeWidth: 2.4
      },
      encoding: {
        x: {
          field: "year",
          type: "quantitative",
          title: ct("charts.yearAxis"),
          axis: { format: "d" }
        },
        y: {
          field: "renewable_share_percent",
          type: "quantitative",
          title: ct("charts.renewableAxis")
        },
        color: {
          field: "countryLabel",
          type: "nominal",
          title: ct("charts.countryLegend"),
          scale: colorScaleForCountries(visibleCountries)
        },
        tooltip: baseLineTooltip("renewable_share_percent", ct("charts.renewableTooltip"))
      }
    });
  } else {
    layers.push({
      transform: [{ filter: `datum.country !== '${CHART_BENCHMARK_COUNTRY}'` }],
      mark: {
        type: "line",
        strokeWidth: 1.6,
        color: "#5f746d",
        opacity: 0.9
      },
      encoding: {
        x: {
          field: "year",
          type: "quantitative",
          title: ct("charts.yearAxis"),
          axis: { format: "d" }
        },
        y: {
          field: "renewable_share_percent",
          type: "quantitative",
          title: ct("charts.renewableAxis")
        },
        detail: { field: "country", type: "nominal" },
        tooltip: baseLineTooltip("renewable_share_percent", ct("charts.renewableTooltip"))
      }
    });
  }

  return buildSpec({
    title: ct("charts.renewableTitle"),
    data: inlineData(rows),
    height: trendChartHeight(),
    layer: layers
  });
}

function buildCircularitySpec(state) {
  const rows = localizeCountryRows(filterByCountries(chartData.circularVsRecycling, state.countries));
  if (rows.length === 0) {
    return null;
  }

  const useCountryColors = rows.length <= 8;
  const layers = [
    {
      mark: {
        type: "circle",
        size: 150,
        opacity: 0.9,
        color: useCountryColors ? undefined : "#2f5d50"
      },
      encoding: {
        x: {
          field: "recycling_rate_percent",
          type: "quantitative",
          title: ct("charts.circularXAxis")
        },
        y: {
          field: "circular_material_use_rate_percent",
          type: "quantitative",
          title: ct("charts.circularYAxis")
        },
        ...(useCountryColors
          ? {
              color: {
                field: "countryLabel",
                type: "nominal",
                title: ct("charts.countryLegend"),
                scale: colorScaleForCountries(state.countries)
              }
            }
          : {}),
        tooltip: [
          { field: "countryLabel", type: "nominal", title: ct("charts.countryTooltip") },
          {
            field: "recycling_rate_percent",
            type: "quantitative",
            title: ct("charts.treatmentTooltip")
          },
          {
            field: "circular_material_use_rate_percent",
            type: "quantitative",
            title: ct("charts.circularTooltip")
          },
          { field: "year", type: "quantitative", title: ct("charts.yearTooltip"), format: "d" }
        ]
      }
    }
  ];

  if (rows.length <= (isCompactViewport() ? 0 : 6)) {
    layers.push({
      mark: {
        type: "text",
        dy: -12,
        font: "Source Sans 3",
        fontSize: 11,
        color: "#1f2a28",
        clip: true
      },
      encoding: {
        x: { field: "recycling_rate_percent", type: "quantitative" },
        y: {
          field: "circular_material_use_rate_percent",
          type: "quantitative"
        },
        text: { field: "countryLabel", type: "nominal" }
      }
    });
  }

  return buildSpec({
    title: ct("charts.circularTitle"),
    data: inlineData(rows),
    height: isCompactViewport() ? 280 : isTabletViewport() ? 320 : 360,
    layer: layers
  });
}

function buildGhgSpec(state) {
  const rows = localizeCountryRows(filterByCountries(chartData.ghgPerCapita, state.countries));
  if (rows.length === 0) {
    return null;
  }

  return buildSpec({
    title: ct("charts.ghgTitle"),
    data: inlineData(rows),
    padding: horizontalChartPadding(),
    height: categoricalChartHeight(rows.length, {
      desktopStep: 18,
      tabletStep: 16,
      mobileStep: 14
    }),
    mark: {
      type: "bar",
      cornerRadiusTopRight: 6,
      cornerRadiusBottomRight: 6,
      color: "#5d7d8a"
    },
    encoding: {
      x: {
        field: "ghg_tonnes_per_capita",
        type: "quantitative",
        title: ct("charts.ghgAxis")
      },
      y: {
        field: "countryLabel",
        type: "nominal",
        sort: "-x",
        axis: {
          title: null,
          labelLimit: horizontalLabelLimit(),
          labelPadding: 8,
          labelLineHeight: 14,
          tickSize: 0
        }
      },
      tooltip: [
        { field: "countryLabel", type: "nominal", title: ct("charts.countryTooltip") },
        {
          field: "ghg_tonnes_per_capita",
          type: "quantitative",
          title: ct("charts.ghgTooltip")
        },
        { field: "year", type: "quantitative", title: ct("charts.yearTooltip"), format: "d" }
      ]
    }
  });
}

function buildEnergyRecoverySpec(state) {
  let rows = localizeCountryRows(filterByCountries(chartData.energyRecoveryOverTime, state.countries));

  if (state.includeBenchmark) {
    rows = rows.concat(
      localizeCountryRows(
        chartData.energyRecoveryOverTime.filter((row) => row.country === CHART_BENCHMARK_COUNTRY)
      )
    );
  }

  if (rows.length === 0) {
    return null;
  }

  const visibleCountries = state.countries.slice();
  const useCountryColors = visibleCountries.length <= 6;
  const layers = [];

  if (state.includeBenchmark) {
    layers.push({
      transform: [{ filter: `datum.country === '${CHART_BENCHMARK_COUNTRY}'` }],
      mark: {
        type: "line",
        point: true,
        strokeWidth: 2.8,
        strokeDash: [7, 5],
        color: "#1f2a28"
      },
      encoding: {
        x: {
          field: "year",
          type: "quantitative",
          title: ct("charts.yearAxis"),
          axis: { format: "d" }
        },
        y: {
          field: "energy_recovery_kg_per_capita",
          type: "quantitative",
          title: ct("charts.energyAxis")
        },
        tooltip: baseLineTooltip("energy_recovery_kg_per_capita", ct("charts.energyTooltip"))
      }
    });
  }

  if (useCountryColors) {
    layers.push({
      transform: [{ filter: `datum.country !== '${CHART_BENCHMARK_COUNTRY}'` }],
      mark: {
        type: "line",
        point: true,
        strokeWidth: 2.5
      },
      encoding: {
        x: {
          field: "year",
          type: "quantitative",
          title: ct("charts.yearAxis"),
          axis: { format: "d" }
        },
        y: {
          field: "energy_recovery_kg_per_capita",
          type: "quantitative",
          title: ct("charts.energyAxis")
        },
        color: {
          field: "countryLabel",
          type: "nominal",
          title: ct("charts.countryLegend"),
          scale: colorScaleForCountries(visibleCountries)
        },
        tooltip: baseLineTooltip("energy_recovery_kg_per_capita", ct("charts.energyTooltip"))
      }
    });
  } else {
    layers.push({
      transform: [{ filter: `datum.country !== '${CHART_BENCHMARK_COUNTRY}'` }],
      mark: {
        type: "line",
        strokeWidth: 1.7,
        point: true,
        color: "#5f746d",
        opacity: 0.9
      },
      encoding: {
        x: {
          field: "year",
          type: "quantitative",
          title: ct("charts.yearAxis"),
          axis: { format: "d" }
        },
        y: {
          field: "energy_recovery_kg_per_capita",
          type: "quantitative",
          title: ct("charts.energyAxis")
        },
        detail: { field: "country", type: "nominal" },
        tooltip: baseLineTooltip("energy_recovery_kg_per_capita", ct("charts.energyTooltip"))
      }
    });
  }

  return buildSpec({
    title: ct("charts.energyTitle"),
    data: inlineData(rows),
    height: trendChartHeight(),
    layer: layers
  });
}

const chartConfigs = [
  {
    id: "municipal-waste-per-capita",
    selector: "#chart-1",
    controls: [
      {
        type: "multiselect",
        key: "countries",
        labelKey: "dashboard.countries",
        helpKey: "dashboard.countriesHelp",
        nounKey: "countriesNoun",
        options: countryLists.municipal,
        formatOption: localizedCountry
      }
    ],
    defaultState: {
      countries: countryLists.municipal.slice()
    },
    buildSpec: buildMunicipalWasteSpec
  },
  {
    id: "waste-treatment-comparison",
    selector: "#chart-2",
    controls: [
      {
        type: "multiselect",
        key: "countries",
        labelKey: "dashboard.countries",
        helpKey: "dashboard.countriesHelp",
        nounKey: "countriesNoun",
        options: countryLists.treatment,
        formatOption: localizedCountry
      },
      {
        type: "checkbox-group",
        key: "treatmentTypes",
        labelKey: "charts.treatmentLegend",
        nounKey: "optionsNoun",
        options: treatmentOptions,
        formatOption: localizedTreatment
      }
    ],
    defaultState: {
      countries: countryLists.treatment.slice(),
      treatmentTypes: treatmentOptions.slice()
    },
    buildSpec: buildWasteTreatmentSpec
  },
  {
    id: "renewable-energy-over-time",
    selector: "#chart-3",
    controls: [
      {
        type: "multiselect",
        key: "countries",
        labelKey: "dashboard.countries",
        helpKey: "dashboard.countriesHelp",
        nounKey: "countriesNoun",
        options: countryLists.renewable,
        formatOption: localizedCountry
      },
      {
        type: "checkbox",
        key: "includeBenchmark",
        labelKey: "charts.benchmarkToggle"
      }
    ],
    defaultState: {
      countries: countryLists.renewable.slice(),
      includeBenchmark: true
    },
    buildSpec: buildRenewableEnergySpec
  },
  {
    id: "circular-vs-recycling",
    selector: "#chart-4",
    controls: [
      {
        type: "multiselect",
        key: "countries",
        labelKey: "dashboard.countries",
        helpKey: "dashboard.countriesHelp",
        nounKey: "countriesNoun",
        options: countryLists.circular,
        formatOption: localizedCountry
      }
    ],
    defaultState: {
      countries: countryLists.circular.slice()
    },
    buildSpec: buildCircularitySpec
  },
  {
    id: "ghg-per-capita",
    selector: "#chart-5",
    controls: [
      {
        type: "multiselect",
        key: "countries",
        labelKey: "dashboard.countries",
        helpKey: "dashboard.countriesHelp",
        nounKey: "countriesNoun",
        options: countryLists.ghg,
        formatOption: localizedCountry
      }
    ],
    defaultState: {
      countries: countryLists.ghg.slice()
    },
    buildSpec: buildGhgSpec
  },
  {
    id: "energy-recovery-over-time",
    selector: "#chart-6",
    controls: [
      {
        type: "multiselect",
        key: "countries",
        labelKey: "dashboard.countries",
        helpKey: "dashboard.countriesHelp",
        nounKey: "countriesNoun",
        options: countryLists.energy,
        formatOption: localizedCountry
      },
      {
        type: "checkbox",
        key: "includeBenchmark",
        labelKey: "charts.benchmarkToggle"
      }
    ],
    defaultState: {
      countries: countryLists.energy.slice(),
      includeBenchmark: true
    },
    buildSpec: buildEnergyRecoverySpec
  }
];
