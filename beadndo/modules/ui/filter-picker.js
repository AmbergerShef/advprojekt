import { t } from "../core/i18n.js";

function selectionSummary(selectedCount, totalCount, nounKey) {
  const noun = t(`dynamic.${nounKey}`);

  if (selectedCount === 0) {
    return t("dynamic.noneSelected", { noun });
  }

  if (selectedCount === totalCount) {
    return t("dynamic.allSelected", { noun });
  }

  return t("dynamic.selectedCount", {
    selected: selectedCount,
    total: totalCount,
    noun
  });
}

function createActionButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-action-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createActionRow(buttons) {
  const row = document.createElement("div");
  row.className = "filter-actions";
  buttons.forEach((button) => row.append(button));
  return row;
}

function createFilterMeta(labelText, defaultText) {
  const meta = document.createElement("div");
  meta.className = "filter-meta";

  const label = document.createElement("label");
  label.className = "filter-meta__label";
  label.textContent = labelText;

  const status = document.createElement("p");
  status.className = "filter-meta__status";
  status.textContent = defaultText;

  meta.append(label, status);
  return { meta, status };
}

export function createCheckboxPicker({
  labelText,
  options,
  selected,
  nounKey,
  defaultMessage,
  onChange,
  formatOption = (value) => value
}) {
  const wrapper = document.createElement("div");
  wrapper.className = "filter-picker";

  const { meta, status } = createFilterMeta(labelText, defaultMessage);
  const details = document.createElement("details");
  details.className = "filter-picker__details";

  const summary = document.createElement("summary");
  summary.className = "filter-picker__summary";

  const summaryText = document.createElement("span");
  summaryText.className = "filter-picker__summary-text";

  const summaryState = document.createElement("span");
  summaryState.className = "filter-picker__summary-state";

  summary.append(summaryText, summaryState);

  const panel = document.createElement("div");
  panel.className = "filter-picker__panel";

  const list = document.createElement("div");
  list.className = "filter-picker__list";

  function getCheckedValues() {
    return Array.from(list.querySelectorAll("input:checked")).map((element) => element.value);
  }

  function refreshDisclosureLabel() {
    summaryState.textContent = details.open ? t("dynamic.closePicker") : t("dynamic.openPicker");
  }

  function updateTexts(values) {
    const summaryTextValue = selectionSummary(values.length, options.length, nounKey);
    status.textContent = summaryTextValue;
    summaryText.textContent = summaryTextValue;
    refreshDisclosureLabel();
  }

  function sync(values) {
    const selectedSet = new Set(values);
    Array.from(list.querySelectorAll("input")).forEach((input) => {
      input.checked = selectedSet.has(input.value);
    });
    updateTexts(values);
  }

  for (const optionValue of options) {
    const itemLabel = document.createElement("label");
    itemLabel.className = "filter-picker__item chart-check";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = optionValue;
    input.checked = selected.includes(optionValue);
    input.addEventListener("change", () => {
      const nextValues = getCheckedValues();
      updateTexts(nextValues);
      onChange(nextValues);
    });

    const text = document.createElement("span");
    text.textContent = formatOption(optionValue);

    itemLabel.append(input, text);
    list.append(itemLabel);
  }

  details.addEventListener("toggle", refreshDisclosureLabel);

  const allButton = createActionButton(t("dynamic.selectAll"), () => {
    const values = options.slice();
    sync(values);
    onChange(values);
  });

  const clearButton = createActionButton(t("dynamic.clearAll"), () => {
    sync([]);
    onChange([]);
  });

  panel.append(createActionRow([allButton, clearButton]), list);
  details.append(summary, panel);
  wrapper.append(meta, details);
  sync(selected);

  return {
    element: wrapper,
    setSelected: sync
  };
}

export {
  createActionButton,
  createActionRow,
  createFilterMeta,
  selectionSummary
};
