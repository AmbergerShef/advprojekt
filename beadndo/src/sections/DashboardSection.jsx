import SectionHeading from "../components/SectionHeading.jsx";
import RevealInView from "../components/RevealInView.jsx";

export default function DashboardSection() {
  return (
    <RevealInView as="section" className="section-card section-card--dashboard" id="dashboard">
      <SectionHeading
        kickerKey="dashboard.kicker"
        kickerText="Interactive Dashboard"
        titleKey="dashboard.title"
        titleText="Build your own cross-country comparison"
      />
      <p className="section-text" data-i18n="dashboard.intro">
        This final dashboard turns the project into a hands-on comparison tool. You can select
        countries, choose indicators, and move across years to explore patterns visually. The
        chart shows the overall shape of the data, while the table reports the exact values in
        the current view.
      </p>
      <div className="dashboard-shell">
        <div
          className="dashboard-controls"
          data-i18n-aria-label="language.dashboardFilters"
          aria-label="Dashboard filters"
        >
          <div className="dashboard-controls__header">
            <p className="dashboard-controls__title" data-i18n="dashboard.controlsTitle">
              Choose what to compare
            </p>
            <button
              type="button"
              className="dashboard-reset"
              id="dashboard-reset"
              data-i18n="dashboard.reset"
            >
              Reset dashboard
            </button>
          </div>
          <div className="dashboard-controls__grid">
            <div className="dashboard-control-group">
              <label
                className="dashboard-control-group__label"
                htmlFor="dashboard-countries"
                data-i18n="dashboard.countries"
              >
                Countries
              </label>
              <select id="dashboard-countries" className="dashboard-control-group__select" multiple></select>
              <p className="dashboard-control-group__help" data-i18n="dashboard.countriesHelp">
                Open the picker to include one or more countries.
              </p>
            </div>
            <div className="dashboard-control-group">
              <label
                className="dashboard-control-group__label"
                htmlFor="dashboard-indicators"
                data-i18n="dashboard.indicators"
              >
                Indicators
              </label>
              <select
                id="dashboard-indicators"
                className="dashboard-control-group__select"
                multiple
              ></select>
              <p className="dashboard-control-group__help" data-i18n="dashboard.indicatorsHelp">
                Choose one indicator for a cleaner comparison, or several for a faceted dashboard
                view.
              </p>
            </div>
            <div className="dashboard-control-group">
              <label
                className="dashboard-control-group__label"
                htmlFor="dashboard-year-start"
                data-i18n="dashboard.startYear"
              >
                Start year
              </label>
              <select id="dashboard-year-start" className="dashboard-inline-select"></select>
            </div>
            <div className="dashboard-control-group">
              <label
                className="dashboard-control-group__label"
                htmlFor="dashboard-year-end"
                data-i18n="dashboard.endYear"
              >
                End year
              </label>
              <select id="dashboard-year-end" className="dashboard-inline-select"></select>
            </div>
          </div>
          <p className="dashboard-note" id="dashboard-note" data-i18n="dashboard.noteDefault">
            The dashboard will update automatically when the filters change.
          </p>
        </div>

        <div className="dashboard-main">
          <div className="dashboard-visual-panel">
            <div className="dashboard-meta">
              <p className="dashboard-meta__kicker" data-i18n="dashboard.currentView">
                Current View
              </p>
              <p className="dashboard-meta__summary" id="dashboard-summary">
                Loading dashboard view.
              </p>
            </div>
            <section className="dashboard-insight-panel" id="dashboard-insight-panel">
              <div className="dashboard-insight-panel__header">
                <p className="dashboard-meta__kicker" data-i18n="dashboard.insightKicker">
                  Analytical Readout
                </p>
                <h3 className="dashboard-insight-panel__title" data-i18n="dashboard.insightTitle">
                  What stands out in this selection
                </h3>
                <p className="dashboard-insight-panel__intro" data-i18n="dashboard.insightIntro">
                  The dashboard translates the visible rows into a short comparative interpretation.
                </p>
              </div>
              <p className="dashboard-insight-panel__headline" id="dashboard-insight-headline">
                Loading analytical readout.
              </p>
              <div className="dashboard-insight-cards" id="dashboard-insight-cards"></div>
              <ul className="dashboard-insight-list" id="dashboard-insight-list"></ul>
            </section>
            <div id="dashboard-chart" className="dashboard-chart-frame"></div>
          </div>
          <div className="dashboard-table-panel">
            <div className="dashboard-table-panel__header">
              <p className="dashboard-meta__kicker" data-i18n="dashboard.exactValues">
                Exact Values
              </p>
              <p className="dashboard-table-panel__summary" id="dashboard-table-summary">
                Loading table.
              </p>
            </div>
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th data-i18n="dashboard.tableCountry">Country</th>
                    <th data-i18n="dashboard.tableIndicator">Indicator</th>
                    <th data-i18n="dashboard.tableYear">Year</th>
                    <th data-i18n="dashboard.tableValue">Value</th>
                  </tr>
                </thead>
                <tbody id="dashboard-table-body"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </RevealInView>
  );
}
