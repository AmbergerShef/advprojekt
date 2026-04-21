export const PROFILE_FOCUS_COUNTRIES = ["Romania", "Hungary"];
export const BENCHMARK_COUNTRY = "EU average";

export const DASHBOARD_INDICATORS = [
  {
    key: "municipal_waste_per_capita",
    unitKey: "units.kgPerCapita",
    decimals: 0,
    direction: "lower_better",
    excellenceKey: "dashboardInsights.excellence.municipal_waste_per_capita"
  },
  {
    key: "recycling_share",
    unitKey: "units.percent",
    decimals: 1,
    direction: "higher_better",
    excellenceKey: "dashboardInsights.excellence.recycling_share"
  },
  {
    key: "landfill_share",
    unitKey: "units.percent",
    decimals: 1,
    direction: "lower_better",
    excellenceKey: "dashboardInsights.excellence.landfill_share"
  },
  {
    key: "energy_recovery_share",
    unitKey: "units.percent",
    decimals: 1,
    direction: "higher_better",
    excellenceKey: "dashboardInsights.excellence.energy_recovery_share"
  },
  {
    key: "renewable_energy_share",
    unitKey: "units.percent",
    decimals: 1,
    direction: "higher_better",
    excellenceKey: "dashboardInsights.excellence.renewable_energy_share"
  },
  {
    key: "circular_material_use_rate",
    unitKey: "units.percent",
    decimals: 1,
    direction: "higher_better",
    excellenceKey: "dashboardInsights.excellence.circular_material_use_rate"
  },
  {
    key: "ghg_per_capita",
    unitKey: "units.ghgPerCapita",
    decimals: 1,
    direction: "lower_better",
    excellenceKey: "dashboardInsights.excellence.ghg_per_capita"
  },
  {
    key: "energy_recovery_level",
    unitKey: "units.kgPerCapita",
    decimals: 0,
    direction: "higher_better",
    excellenceKey: "dashboardInsights.excellence.energy_recovery_level"
  }
];

export const dashboardIndicatorMap = Object.fromEntries(
  DASHBOARD_INDICATORS.map((indicator) => [indicator.key, indicator])
);
