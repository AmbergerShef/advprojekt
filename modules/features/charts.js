import { t } from "../core/i18n.js";
import { applyResponsiveChartSpec, renderEmptyChartMessage } from "../core/chart-runtime.js";
import { cloneState } from "../core/utils.js";
import {
  createActionButton,
  createActionRow,
  createCheckboxPicker,
  createFilterMeta,
  selectionSummary
} from "../ui/filter-picker.js";

const chartRuntimeStates = new Map();

async function renderSingleChart(chart, state) {
  const container = document.querySelector(chart.selector);
  if (!container) {
    return;
  }

  const spec = chart.buildSpec(state);
  if (!spec) {
    renderEmptyChartMessage(container);
    return;
  }

  try {
    const responsiveSpec = applyResponsiveChartSpec(spec, container, {
      minWidth: window.innerWidth <= 700 ? 280 : 480
    });
    await window.vegaEmbed(container, responsiveSpec, { actions: false, renderer: "svg" });
  } catch (error) {
    console.error(`Failed to render ${chart.id}:`, error);
    container.innerHTML = `
      <div class="chart-error">
        <strong>${t("dynamic.chartLoadErrorTitle")}</strong>
        <p>${t("dynamic.chartLoadErrorText", { id: chart.id })}</p>
      </div>
    `;
  }
}

function createChartControls(chart, state, rerender) {
  const container = document.querySelector(chart.selector);
  const section = container ? container.closest(".section-card") : null;

  if (!container || !section || !chart.controls || chart.controls.length === 0) {
    return;
  }

  section.querySelector(`[data-chart-controls="${chart.id}"]`)?.remove();

  const controlsWrap = document.createElement("div");
  controlsWrap.className = "chart-controls";
  controlsWrap.dataset.chartControls = chart.id;

  const header = document.createElement("div");
  header.className = "chart-controls__header";

  const helper = document.createElement("p");
  helper.className = "chart-controls__helper";
  helper.textContent = t("dynamic.filterDefaults");
  header.append(helper);

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "chart-controls__reset";
  resetButton.textContent = t("dynamic.resetFilters");
  resetButton.addEventListener("click", () => {
    const nextState = cloneState(chart.defaultState);
    Object.keys(nextState).forEach((key) => {
      state[key] = nextState[key];
    });
    chartRuntimeStates.set(chart.id, cloneState(state));
    createChartControls(chart, state, rerender);
    rerender();
  });
  header.append(resetButton);
  controlsWrap.append(header);

  const grid = document.createElement("div");
  grid.className = "chart-controls__grid";

  for (const control of chart.controls) {
    const group = document.createElement("div");
    group.className = "chart-control-group filter-card";
    const labelText = control.labelKey ? t(control.labelKey) : control.label;
    const helpText = control.helpKey ? t(control.helpKey) : control.help;

    if (control.type === "multiselect") {
      const picker = createCheckboxPicker({
        labelText,
        options: control.options,
        selected: state[control.key],
        nounKey: control.nounKey || "optionsNoun",
        defaultMessage: t("dynamic.allOptionsDefault"),
        onChange: (nextValues) => {
          state[control.key] = nextValues;
          chartRuntimeStates.set(chart.id, cloneState(state));
          rerender();
        },
        formatOption: control.formatOption || ((value) => value)
      });

      group.append(picker.element);
    }

    if (control.type === "checkbox-group") {
      const { meta, status } = createFilterMeta(labelText, t("dynamic.allOptionsDefault"));
      const list = document.createElement("div");
      list.className = "chart-control-group__checks";

      const updateSummary = () => {
        status.textContent = selectionSummary(
          state[control.key].length,
          control.options.length,
          control.nounKey || "optionsNoun"
        );
      };

      for (const optionValue of control.options) {
        const itemLabel = document.createElement("label");
        itemLabel.className = "chart-check";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = optionValue;
        input.checked = state[control.key].includes(optionValue);
        input.addEventListener("change", () => {
          state[control.key] = Array.from(list.querySelectorAll("input:checked")).map(
            (element) => element.value
          );
          chartRuntimeStates.set(chart.id, cloneState(state));
          updateSummary();
          rerender();
        });

        const text = document.createElement("span");
        text.textContent = control.formatOption ? control.formatOption(optionValue) : optionValue;

        itemLabel.append(input, text);
        list.append(itemLabel);
      }

      const allButton = createActionButton(t("dynamic.selectAll"), () => {
        state[control.key] = control.options.slice();
        Array.from(list.querySelectorAll("input")).forEach((input) => {
          input.checked = true;
        });
        chartRuntimeStates.set(chart.id, cloneState(state));
        updateSummary();
        rerender();
      });

      const clearButton = createActionButton(t("dynamic.clearAll"), () => {
        state[control.key] = [];
        Array.from(list.querySelectorAll("input")).forEach((input) => {
          input.checked = false;
        });
        chartRuntimeStates.set(chart.id, cloneState(state));
        updateSummary();
        rerender();
      });

      group.append(meta, createActionRow([allButton, clearButton]), list);
      updateSummary();
    }

    if (control.type === "checkbox") {
      const { meta, status } = createFilterMeta(labelText, t("dynamic.checkboxDefault"));
      const itemLabel = document.createElement("label");
      itemLabel.className = "chart-check";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(state[control.key]);
      input.addEventListener("change", () => {
        state[control.key] = input.checked;
        chartRuntimeStates.set(chart.id, cloneState(state));
        status.textContent = input.checked ? t("dynamic.enabled") : t("dynamic.disabled");
        rerender();
      });

      const text = document.createElement("span");
      text.textContent = labelText;

      itemLabel.append(input, text);
      group.append(meta, itemLabel);
      status.textContent = input.checked ? t("dynamic.enabled") : t("dynamic.disabled");
    }

    if (helpText) {
      const help = document.createElement("p");
      help.className = "chart-control-group__help";
      help.textContent = helpText;
      group.append(help);
    }

    grid.append(group);
  }

  controlsWrap.append(grid);
  section.insertBefore(controlsWrap, container);
}

export async function embedCharts() {
  const chartConfigs = window.chartConfigs || [];

  for (const chart of chartConfigs) {
    if (!chartRuntimeStates.has(chart.id)) {
      chartRuntimeStates.set(chart.id, cloneState(chart.defaultState));
    }

    const state = chartRuntimeStates.get(chart.id);
    createChartControls(chart, state, () => {
      chartRuntimeStates.set(chart.id, cloneState(state));
      renderSingleChart(chart, state);
    });
    await renderSingleChart(chart, state);
  }
}
