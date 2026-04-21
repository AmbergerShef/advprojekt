#!/usr/bin/env python3

"""
Fetch cleaned public datasets for the portfolio charts.

Sources:
- Eurostat API
- World Bank API

The script writes website-friendly CSV files to /data and generates the
runtime chart-data.js bundle used by the static site.
"""

from __future__ import annotations

import csv
import json
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
PUBLIC_RUNTIME_DIR = ROOT / "public" / "runtime"
CHART_DATA_JS = PUBLIC_RUNTIME_DIR / "chart-data.js"

EU_COUNTRIES = [
    {"code": "AT", "name": "Austria", "wb": "AUT"},
    {"code": "BE", "name": "Belgium", "wb": "BEL"},
    {"code": "BG", "name": "Bulgaria", "wb": "BGR"},
    {"code": "HR", "name": "Croatia", "wb": "HRV"},
    {"code": "CY", "name": "Cyprus", "wb": "CYP"},
    {"code": "CZ", "name": "Czechia", "wb": "CZE"},
    {"code": "DK", "name": "Denmark", "wb": "DNK"},
    {"code": "EE", "name": "Estonia", "wb": "EST"},
    {"code": "FI", "name": "Finland", "wb": "FIN"},
    {"code": "FR", "name": "France", "wb": "FRA"},
    {"code": "DE", "name": "Germany", "wb": "DEU"},
    {"code": "EL", "name": "Greece", "wb": "GRC"},
    {"code": "HU", "name": "Hungary", "wb": "HUN"},
    {"code": "IE", "name": "Ireland", "wb": "IRL"},
    {"code": "IT", "name": "Italy", "wb": "ITA"},
    {"code": "LV", "name": "Latvia", "wb": "LVA"},
    {"code": "LT", "name": "Lithuania", "wb": "LTU"},
    {"code": "LU", "name": "Luxembourg", "wb": "LUX"},
    {"code": "MT", "name": "Malta", "wb": "MLT"},
    {"code": "NL", "name": "Netherlands", "wb": "NLD"},
    {"code": "PL", "name": "Poland", "wb": "POL"},
    {"code": "PT", "name": "Portugal", "wb": "PRT"},
    {"code": "RO", "name": "Romania", "wb": "ROU"},
    {"code": "SK", "name": "Slovakia", "wb": "SVK"},
    {"code": "SI", "name": "Slovenia", "wb": "SVN"},
    {"code": "ES", "name": "Spain", "wb": "ESP"},
    {"code": "SE", "name": "Sweden", "wb": "SWE"},
]

EU_CODES = [item["code"] for item in EU_COUNTRIES]
WORLD_BANK_CODES = [item["wb"] for item in EU_COUNTRIES]
COUNTRY_NAMES = {item["code"]: item["name"] for item in EU_COUNTRIES}
COUNTRY_NAMES["EU27_2020"] = "EU average"
ISO3_TO_NAME = {item["wb"]: item["name"] for item in EU_COUNTRIES}
FOCUS_COUNTRY_CODES = {"RO", "HU"}
RENEWABLE_YEARS = [str(year) for year in range(2018, 2025)]
ENERGY_RECOVERY_YEARS = [str(year) for year in range(2018, 2024)]
CIRCULAR_CANDIDATE_YEARS = [str(year) for year in range(2024, 2019, -1)]


def fetch_json(url: str) -> dict | list:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "waste-to-energy-portfolio-data-fetcher/1.0"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def eurostat_url(dataset: str, params: dict[str, list[str] | str]) -> str:
    query = urllib.parse.urlencode(params, doseq=True)
    return (
        f"https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/"
        f"{dataset}?{query}"
    )


def fetch_eurostat(dataset: str, params: dict[str, list[str] | str]) -> list[dict]:
    payload = fetch_json(eurostat_url(dataset, params))
    ids = payload["id"]
    sizes = payload["size"]
    dims = payload["dimension"]
    values = payload.get("value", {})
    statuses = payload.get("status", {})

    codes_by_dim = []
    for dim_id in ids:
        index_map = dims[dim_id]["category"]["index"]
        inverse = {position: code for code, position in index_map.items()}
        codes_by_dim.append(inverse)

    multipliers = []
    running = 1
    for size in reversed(sizes[1:]):
        running *= size
        multipliers.append(running)
    multipliers = list(reversed(multipliers)) + [1]

    observations = []
    for flat_key, value in values.items():
        position = int(flat_key)
        coordinates = {}
        remainder = position

        for dim_id, dim_codes, multiplier in zip(ids, codes_by_dim, multipliers):
            dim_position = remainder // multiplier
            remainder %= multiplier
            coordinates[dim_id] = dim_codes[dim_position]

        coordinates["value"] = value
        if flat_key in statuses:
            coordinates["status"] = statuses[flat_key]
        observations.append(coordinates)

    return observations


def fetch_world_bank_indicator(indicator: str, countries: list[str]) -> list[dict]:
    country_list = ";".join(countries)
    url = (
        "https://api.worldbank.org/v2/country/"
        f"{country_list}/indicator/{indicator}?format=json&per_page=2000"
    )
    payload = fetch_json(url)
    rows = payload[1]

    selected = []
    for row in rows:
        if row["value"] is None:
            continue
        iso3 = row.get("countryiso3code")
        if iso3 not in countries:
            continue
        selected.append(
            {
                "country_code": iso3,
                "year": int(row["date"]),
                "value": float(row["value"]),
            }
        )
    return selected


def write_csv(path: Path, fieldnames: list[str], rows: list[dict]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def read_csv(path: Path) -> list[dict]:
    with path.open("r", newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def convert_value(raw_value: str):
    if raw_value is None:
        return raw_value
    value = raw_value.strip()
    if value == "":
        return value

    try:
        number = float(value)
    except ValueError:
        return value

    if number.is_integer():
        return int(number)

    return number


def round1(value: float) -> float:
    return round(value, 1)


def build_chart_data_js() -> None:
    PUBLIC_RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    datasets = {
        "municipalWastePerCapita": read_csv(DATA_DIR / "municipal_waste_per_capita.csv"),
        "wasteTreatmentComparison": read_csv(DATA_DIR / "waste_treatment_comparison.csv"),
        "renewableEnergyShare": read_csv(DATA_DIR / "renewable_energy_share.csv"),
        "circularVsRecycling": read_csv(DATA_DIR / "circular_vs_recycling.csv"),
        "ghgPerCapita": read_csv(DATA_DIR / "ghg_per_capita.csv"),
        "energyRecoveryOverTime": read_csv(DATA_DIR / "energy_recovery_over_time.csv"),
    }

    cleaned = {}
    for key, rows in datasets.items():
        cleaned[key] = [
            {column: convert_value(value) for column, value in row.items()}
            for row in rows
        ]

    content = (
        "/* Generated by scripts/update_data.py. */\n"
        f"const chartData = {json.dumps(cleaned, indent=2)};\n"
    )
    CHART_DATA_JS.write_text(content, encoding="utf-8")


def best_year_by_coverage(
    rows_by_year: dict[int, set[str]], preferred_order: list[int] | None = None
) -> int:
    if preferred_order:
        candidates = preferred_order
    else:
        candidates = sorted(rows_by_year.keys(), reverse=True)

    best_year = None
    best_score = (-1, -1)
    for year in candidates:
        count = len(rows_by_year.get(year, set()))
        score = (count, year)
        if score > best_score:
            best_score = score
            best_year = year

    if best_year is None:
        raise ValueError("Could not determine a suitable year from the source data.")

    return best_year


def country_name_from_eurostat(code: str) -> str:
    return COUNTRY_NAMES[code]


def build_municipal_waste_per_capita() -> None:
    observations = fetch_eurostat(
        "cei_pc031",
        {
            "geo": EU_CODES,
            "unit": "KG_HAB",
            "time": "2023",
        },
    )

    by_code = {item["geo"]: item["value"] for item in observations if item["geo"] in COUNTRY_NAMES}
    rows = []
    for code in EU_CODES:
        if code not in by_code:
            continue
        rows.append(
            {
                "country": country_name_from_eurostat(code),
                "waste_kg_per_capita": by_code[code],
                "year": 2023,
            }
        )

    rows.sort(key=lambda item: item["country"])
    write_csv(
        DATA_DIR / "municipal_waste_per_capita.csv",
        ["country", "waste_kg_per_capita", "year"],
        rows,
    )


def build_waste_treatment_comparison() -> None:
    observations = fetch_eurostat(
        "env_wasmun",
        {
            "geo": EU_CODES,
            "wst_oper": ["GEN", "DSP_L_OTH", "RCV_E", "RCY_M", "RCY_C_D"],
            "unit": "KG_HAB",
            "time": "2023",
        },
    )

    by_country_operation = {}
    for item in observations:
        by_country_operation[(item["geo"], item["wst_oper"])] = item["value"]

    rows = []
    for code in EU_CODES:
        required_keys = [
            (code, "GEN"),
            (code, "DSP_L_OTH"),
            (code, "RCV_E"),
            (code, "RCY_M"),
            (code, "RCY_C_D"),
        ]
        if not all(key in by_country_operation for key in required_keys):
            continue

        generated = by_country_operation[(code, "GEN")]
        recycling = by_country_operation[(code, "RCY_M")] + by_country_operation[
            (code, "RCY_C_D")
        ]
        landfill = by_country_operation[(code, "DSP_L_OTH")]
        energy_recovery = by_country_operation[(code, "RCV_E")]

        rows.extend(
            [
                {
                    "country": country_name_from_eurostat(code),
                    "treatment_type": "Recycling",
                    "share_percent": round1((recycling / generated) * 100),
                    "year": 2023,
                },
                {
                    "country": country_name_from_eurostat(code),
                    "treatment_type": "Landfill",
                    "share_percent": round1((landfill / generated) * 100),
                    "year": 2023,
                },
                {
                    "country": country_name_from_eurostat(code),
                    "treatment_type": "Incineration with energy recovery",
                    "share_percent": round1((energy_recovery / generated) * 100),
                    "year": 2023,
                },
            ]
        )

    rows.sort(key=lambda item: (item["country"], item["treatment_type"]))
    write_csv(
        DATA_DIR / "waste_treatment_comparison.csv",
        ["country", "treatment_type", "share_percent", "year"],
        rows,
    )


def build_renewable_energy_share() -> None:
    observations = fetch_eurostat(
        "sdg_07_40",
        {
            "geo": EU_CODES + ["EU27_2020"],
            "nrg_bal": "REN",
            "time": RENEWABLE_YEARS,
        },
    )

    rows = []
    for item in observations:
        if item["geo"] not in COUNTRY_NAMES:
            continue
        rows.append(
            {
                "country": COUNTRY_NAMES[item["geo"]],
                "year": int(item["time"]),
                "renewable_share_percent": item["value"],
            }
        )

    rows.sort(key=lambda item: (item["country"], item["year"]))
    write_csv(
        DATA_DIR / "renewable_energy_share.csv",
        ["country", "year", "renewable_share_percent"],
        rows,
    )


def build_circular_vs_recycling() -> None:
    circular = fetch_eurostat(
        "cei_srm030",
        {
            "geo": EU_CODES,
            "unit": "PC",
            "time": CIRCULAR_CANDIDATE_YEARS,
        },
    )
    recycling = fetch_eurostat(
        "cei_wm011",
        {
            "geo": EU_CODES,
            "wst_oper": "RCY",
            "unit": "PC",
            "time": CIRCULAR_CANDIDATE_YEARS,
        },
    )

    circular_by_key = {(item["geo"], int(item["time"])): item["value"] for item in circular}
    recycling_by_key = {(item["geo"], int(item["time"])): item["value"] for item in recycling}

    coverage_by_year = {}
    for year in (int(value) for value in CIRCULAR_CANDIDATE_YEARS):
        coverage_by_year[year] = {
            code
            for code in EU_CODES
            if (code, year) in circular_by_key and (code, year) in recycling_by_key
        }

    chosen_year = best_year_by_coverage(
        coverage_by_year,
        preferred_order=[int(value) for value in CIRCULAR_CANDIDATE_YEARS],
    )

    rows = []
    for code in EU_CODES:
        if code not in coverage_by_year[chosen_year]:
            continue
        rows.append(
            {
                "country": country_name_from_eurostat(code),
                "recycling_rate_percent": recycling_by_key[(code, chosen_year)],
                "circular_material_use_rate_percent": circular_by_key[(code, chosen_year)],
                "year": chosen_year,
            }
        )

    rows.sort(key=lambda item: item["country"])
    write_csv(
        DATA_DIR / "circular_vs_recycling.csv",
        [
            "country",
            "recycling_rate_percent",
            "circular_material_use_rate_percent",
            "year",
        ],
        rows,
    )


def build_ghg_per_capita() -> None:
    observations = fetch_world_bank_indicator(
        "EN.GHG.ALL.PC.CE.AR5",
        WORLD_BANK_CODES,
    )

    coverage_by_year = {}
    values_by_key = {}
    for item in observations:
        values_by_key[(item["country_code"], item["year"])] = item["value"]
        coverage_by_year.setdefault(item["year"], set()).add(item["country_code"])

    chosen_year = best_year_by_coverage(coverage_by_year)

    rows = []
    for country in EU_COUNTRIES:
        code = country["wb"]
        if (code, chosen_year) not in values_by_key:
            continue
        rows.append(
            {
                "country": ISO3_TO_NAME[code],
                "ghg_tonnes_per_capita": round1(values_by_key[(code, chosen_year)]),
                "year": chosen_year,
            }
        )

    rows.sort(key=lambda item: item["country"])
    write_csv(
        DATA_DIR / "ghg_per_capita.csv",
        ["country", "ghg_tonnes_per_capita", "year"],
        rows,
    )


def build_energy_recovery_over_time() -> None:
    observations = fetch_eurostat(
        "env_wasmun",
        {
            "geo": EU_CODES + ["EU27_2020"],
            "wst_oper": "RCV_E",
            "unit": "KG_HAB",
            "time": ENERGY_RECOVERY_YEARS,
        },
    )

    rows = []
    for item in observations:
        if item["geo"] not in COUNTRY_NAMES:
            continue
        rows.append(
            {
                "country": COUNTRY_NAMES[item["geo"]],
                "year": int(item["time"]),
                "energy_recovery_kg_per_capita": item["value"],
            }
        )

    rows.sort(key=lambda item: (item["country"], item["year"]))
    write_csv(
        DATA_DIR / "energy_recovery_over_time.csv",
        ["country", "year", "energy_recovery_kg_per_capita"],
        rows,
    )


def main() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    build_municipal_waste_per_capita()
    build_waste_treatment_comparison()
    build_renewable_energy_share()
    build_circular_vs_recycling()
    build_ghg_per_capita()
    build_energy_recovery_over_time()
    build_chart_data_js()


if __name__ == "__main__":
    main()
