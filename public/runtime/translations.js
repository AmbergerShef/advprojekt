const translations = {
  en: {
    language: {
      selector: "Language selector",
      keyFacts: "Key facts",
      dashboardFilters: "Dashboard filters"
    },
    dashboard: {
      countries: "Countries",
      countriesHelp: "Open the picker and select one or more countries.",
      indicators: "Indicators",
      indicatorsHelp:
        "One indicator gives a cleaner comparison, while several indicators create a faceted dashboard view.",
      insightKicker: "Analytical Readout",
      insightTitle: "What stands out in this selection",
      insightIntro:
        "The dashboard converts the visible rows into a compact comparative interpretation.",
      startYear: "Start year",
      endYear: "End year",
      noteAutoUpdate: "The chart and table update automatically as you change the filters.",
      noteSparse:
        "Some selected indicators are available only for one recent year, so they appear only where source data exist.",
      noteNeedSelection: "Select at least one country and one indicator.",
      summary: "{countries} countries, {indicators} indicators, years {startYear}-{endYear}.",
      summaryEmpty: "No data match the current dashboard selection.",
      tableRows: "{count} rows shown.",
      tableRowsEmpty: "0 rows shown.",
      tableEmpty: "No values match the current dashboard selection.",
      chartTrendTitle: "Dashboard trend view",
      chartSnapshotTitle: "Dashboard snapshot for {year}",
      chartDenseTitle: "This dashboard view is too dense to plot clearly.",
      chartDenseText: "Try fewer countries, fewer indicators, or a shorter year range.",
      chartErrorTitle: "Dashboard chart could not be loaded.",
      chartErrorText: "Check the current dashboard selection and chart configuration.",
      insightHeadlineSingleIndicator:
        "{country} leads the current {indicator} comparison, with a visible gap of {gap} over {laggard}.",
      insightHeadlineBalanced:
        "{country} presents the strongest overall profile across the currently selected indicators.",
      insightHeadlineSingleCountry:
        "{country} is shown here as a focused profile rather than a cross-country ranking.",
      cardTopPerformer: "Top performer",
      cardTopPerformerNote: "{indicator}: {value}",
      cardBiggestGap: "Biggest gap",
      cardBiggestGapNote: "{indicator}: {leader} versus {laggard}",
      cardStandoutCountry: "Standout country",
      cardStandoutCountryNote: "Leads {count} visible indicators.",
      cardBalancedProfile: "Most balanced profile",
      cardBalancedProfileNote: "Strongest average rank across {count} indicators.",
      cardProfileType: "Profile type",
      cardProfileTypeNote: "Interpretation from the visible indicator mix.",
      cardNeedsImprovement: "Needs improvement",
      cardCoverage: "Coverage",
      cardCoverageValue: "{indicators} indicators across {years} years",
      cardCoverageNote: "{count} visible observations in the current view.",
      narrativeLeader:
        "{country} leads {indicator} at {value}, while {laggard} records the weakest visible result at {laggardValue}.",
      narrativeGap:
        "The widest separation appears in {indicator}, where the leading country sits {gap} away from the weakest visible result and {avgGapPercent} ahead of the selected-group average.",
      narrativeTrendImprovement:
        "{country} shows the clearest in-range improvement in {indicator}, changing by {delta} between {startYear} and {endYear}.",
      narrativeTrendRank:
        "Within the same comparison set, {country} moves from rank {startRank} to rank {endRank}.",
      narrativePairRecyclingLandfill:
        "{country} combines above-group recycling with below-group landfill, suggesting a comparatively mature treatment mix in the current selection.",
      narrativePairCircularity:
        "{country} leads circular-material use despite only mid-pack municipal recycling, implying that broader material efficiency extends beyond waste collection alone.",
      narrativePairEnergyLandfill:
        "{country} pairs strong energy recovery with still-elevated landfill, pointing to a transition model that has not fully displaced disposal.",
      narrativeSingleCountryStrength:
        "{country}'s clearest visible strength is {indicator} at {value}.",
      narrativeSingleCountryWeakness:
        "{country}'s most evident pressure point is {indicator} at {value}.",
      narrativeCoverage:
        "This view draws on {count} visible observations across {countries} countries and {indicators} indicators.",
      profileMixed: "mixed transition profile",
      profileLandfill: "landfill-reliant profile",
      profileRecycling: "recycling-led profile",
      profileLowLandfill: "low-landfill, recovery-oriented profile",
      profileRecovery: "recovery-led transition profile"
    },
    dashboardInsights: {
      excellence: {
        municipal_waste_per_capita: "waste-pressure management",
        recycling_share: "recycling performance",
        landfill_share: "landfill reduction",
        energy_recovery_share: "recovery-system depth",
        renewable_energy_share: "renewable-energy transition",
        circular_material_use_rate: "circular-material efficiency",
        ghg_per_capita: "low-emissions profile",
        energy_recovery_level: "energy-recovery capacity"
      }
    },
    dashboardIndicators: {
      municipal_waste_per_capita: "Municipal waste per capita",
      recycling_share: "Recycling share",
      landfill_share: "Landfill share",
      energy_recovery_share: "Energy recovery share",
      renewable_energy_share: "Renewable energy share",
      circular_material_use_rate: "Circular material use rate",
      ghg_per_capita: "GHG emissions per capita",
      energy_recovery_level: "Energy recovery level"
    },
    units: {
      kgPerCapita: "kg per capita",
      percent: "%",
      ghgPerCapita: "tCO2e per capita"
    },
    dynamic: {
      highestWasteLabel: "Highest Waste Level",
      strongestRecyclingLabel: "Strongest Recycling Share",
      highestRenewableLabel: "Highest Renewable Share",
      focusLabel: "Romania and Hungary",
      landfillNote: "Landfill share of generated municipal waste in 2023.",
      explorerProfileSummary: "Profile Summary",
      rankingTableTitle: "Selected indicators side by side",
      wasteGeneration: "Waste generation",
      wasteGenerationNote: "Municipal waste per capita in {year}",
      recyclingShare: "Recycling share",
      recyclingShareNote: "Share of generated municipal waste",
      landfillShare: "Landfill share",
      landfillShareNote: "Lower values usually indicate less landfill dependence",
      energyRecovery: "Energy recovery",
      energyRecoveryNote: "Municipal waste sent to energy recovery in {year}",
      circularity: "Circularity",
      circularityNote: "Circular material use rate in {year}",
      circularityUnavailable: "Not available in the current subset",
      ghgContext: "GHG context",
      ghgContextNote: "Greenhouse gas emissions per capita in {year}",
      ghgUnavailable: "Not available in the current subset",
      mixedSystem: "a mixed system",
      lowLandfillSystem: "a low-landfill, high-recovery system",
      recyclingLedSystem: "a recycling-led system",
      landfillReliantSystem: "a comparatively landfill-reliant system",
      renewableSentence: "{country} reached a renewable-energy share of {value} in {year}.",
      renewableUnavailable:
        "{country} does not have a matching renewable-energy value in the current local extract.",
      profileParagraph1:
        "In this dataset selection, <strong>{country}</strong> looks like {systemType}. Its 2023 treatment mix combines <strong>{recycling}</strong> recycling, <strong>{landfill}</strong> landfill, and <strong>{energy}</strong> energy recovery.",
      noChartDataTitle: "No chart data match the current filters.",
      noChartDataText: "Adjust the selected countries or filter options to display data again.",
      chartLoadErrorTitle: "Chart could not be loaded.",
      chartLoadErrorText: "Check the current spec or filter state for {id}.",
      filterDefaults: "Filters are optional. The default view shows the full available dataset.",
      resetFilters: "Reset filters",
      allSelected: "All {noun} selected",
      noneSelected: "No {noun} selected",
      selectedCount: "{selected} of {total} {noun} selected",
      selectAll: "Select all",
      clearAll: "Clear all",
      enabled: "Enabled",
      disabled: "Disabled",
      checkboxDefault: "This option is enabled by default.",
      openPicker: "Open",
      closePicker: "Close",
      allOptionsDefault: "All available options are included by default.",
      notAvailable: "Not available",
      countriesNoun: "countries",
      indicatorsNoun: "indicators",
      optionsNoun: "options"
    },
    charts: {
      wasteTitle: "Municipal waste generation per capita across EU countries",
      wasteAxis: "Kilograms per capita",
      wasteTooltip: "Waste per capita (kg)",
      treatmentTitle: "Waste treatment profiles reveal a strong landfill divide",
      treatmentAxis: "Share of generated municipal waste (%)",
      treatmentLegend: "Treatment path",
      treatmentTooltip: "Share (%)",
      renewableTitle: "Renewable energy has risen across the EU, but unevenly",
      renewableAxis: "Renewable energy share (%)",
      renewableTooltip: "Share (%)",
      circularTitle: "Recycling leadership does not always translate into circularity leadership",
      circularXAxis: "Recycling rate of municipal waste (%)",
      circularYAxis: "Circular material use rate (%)",
      circularTooltip: "Circular use rate (%)",
      ghgTitle: "Greenhouse-gas context also varies sharply across the EU",
      ghgAxis: "Tonnes CO2 equivalent per capita",
      ghgTooltip: "GHG emissions per capita (tCO2e)",
      energyTitle: "Energy recovery from municipal waste remains highly uneven",
      energyAxis: "Kilograms per capita",
      energyTooltip: "Energy recovery (kg/capita)",
      benchmarkToggle: "Show EU average benchmark",
      yearAxis: "Year",
      countryLegend: "Country",
      countryTooltip: "Country",
      indicatorTooltip: "Indicator",
      valueTooltip: "Value",
      yearTooltip: "Year",
      treatment: {
        recycling: "Recycling",
        landfill: "Landfill",
        energy: "Incineration with energy recovery"
      }
    }
  },
  hu: {
    meta: {
      title: "Hulladékból energia és fenntarthatóság Európában",
      description:
        "Egyetemi adatvizualizációs portfólióprojekt az európai települési hulladékról, energetikai hasznosításról és fenntarthatósági mutatókról."
    },
    language: {
      selector: "Nyelvválasztó",
      keyFacts: "Kulcsmegállapítások",
      dashboardFilters: "Irányítópult szűrői"
    },
    hero: {
      eyebrow: "Adatvizualizációs portfólió",
      title: "Hulladékból energia és fenntarthatóság Európában",
      subtitle:
        "Tömör vizuális elemzés arról, hogyan keletkezik a hulladék az európai országokban, hogyan oszlik meg a kezelési útvonalak között, és miként kapcsolódik mindez az energiatranzícióhoz és a fenntarthatósági teljesítményhez.",
      intro:
        "A hulladékgazdálkodás nem csupán környezeti kérdés. Azt is tükrözi, hogyan fogyasztanak a társadalmak, hogyan szerveződik az infrastruktúra, és miként egyensúlyoznak a szakpolitikai rendszerek az újrahasznosítás, a lerakók visszaszorítása, az energetikai hasznosítás és a klímacélok között. Ez a projekt nyilvános európai mutatókon keresztül vizsgálja ezt az összefüggést, külön figyelemmel Romániára és Magyarországra a tágabb uniós összefüggésben.",
      note:
        "A weboldal könnyű GitHub Pages projektként készült HTML, CSS, JavaScript és Vega-Lite használatával. Minden ábra hivatalos nyilvános adatforrásokból, elsősorban az Eurostattól és a Világbanktól származó tisztított helyi adatállományokra épül.",
      panelKicker: "Kiinduló kérdés",
      panelText:
        "Jobban teljesítenek-e a szélesebb fenntarthatósági mutatókban azok az országok, amelyek kevésbé támaszkodnak a lerakásra és erősebb hasznosítási rendszerekkel rendelkeznek?",
      navWaste: "Hulladékrendszer",
      navCircularity: "Körforgás",
      navClimate: "Klímakontextus",
      navMethods: "Módszertan"
    },
    overview: {
      kicker: "Projektkeret",
      title: "Hogyan érdemes olvasni ezt a projektet",
      researchTitle: "Kutatási kérdés",
      researchText:
        "A központi kérdés az, hogyan tér el Európában a hulladékképződés és a hulladékkezelés, illetve hogy az erősebb újrahasznosítási és hasznosítási rendszerek együtt járnak-e jobb teljesítménnyel a tágabb fenntarthatósági mutatókban.",
      storyTitle: "Történeti szerkezet",
      storyText:
        "Az oldal a hulladéknyomástól a kezelési döntéseken át a szélesebb fenntarthatósági kontextusig halad. Ez a sorrend azt szolgálja, hogy az ábrák együtt érvelést alkossanak, ne elszigetelt grafikonok maradjanak.",
      dataTitle: "Adatintegráció",
      dataText:
        "A <code>data/</code> mappa már a kívánt munkafolyamatot tükrözi: a grafikonok hivatalos nyilvános adatokból származó, tisztított helyi állományokat használnak, a források és átalakítások pedig átláthatóan dokumentáltak a <code>DATA_SOURCES.md</code> fájlban."
    },
    insights: {
      kicker: "Fő megállapítások",
      title: "Mit sugallnak a jelenlegi bizonyítékok",
      card1Title: "A hulladékképződés továbbra is egyenetlen",
      card1Text:
        "Az uniós lefedettség azt mutatja, hogy az egy főre jutó települési hulladék mennyisége jelentősen eltér a tagállamok között, ami arra utal, hogy a fogyasztási minták, a szolgáltatási rendszerek és a jelentési gyakorlatok továbbra is különböznek.",
      card2Title: "Az alacsony lerakási arány gyakran erősebb rendszerkapacitással jár együtt",
      card2Text:
        "Azok az országok, ahol minimális a lerakás, rendszerint az újrahasznosítás és az energetikai hasznosítás kombinációjára támaszkodnak, nem pedig egyetlen domináns megoldásra.",
      card3Title: "Az újrahasznosítás és a körforgásosság összefügg, de nem azonos",
      card3Text:
        "A magas települési újrahasznosítás nem jelenti automatikusan a legmagasabb körforgásos anyagfelhasználási arányt, mert ezt a szélesebb gazdasági szerkezet és az anyagáramlások is alakítják.",
      card4Title: "Románia és Magyarország két eltérő átmeneti pozíciót mutat",
      card4Text:
        "Románia sokkal inkább lerakófüggő, míg Magyarország erősebb újrahasznosítási, körforgásossági és energetikai hasznosítási értékeket mutat. Mindkettő fontos horgony az uniós összehasonlításban Közép- és Kelet-Európa szempontjából."
    },
    purpose: {
      kicker: "A projekt célja",
      title: "Miért fontos ez a téma",
      text1:
        "A hulladékpolitika a környezetvédelem, az erőforrás-gazdálkodás és az energiastratégia metszéspontjában helyezkedik el. Ez a weboldal tömör kurzusprojekt-portfólióként mutat be kulcsmutatókat az európai hulladékképződésről, kezelési útvonalakról, megújuló energiáról, körforgásosságról és fenntarthatósági teljesítményről.",
      text2:
        "A cél egy világos vizuális szerkezet és a nyilvános adatok átlátható használatának ötvözése, hogy a portfólió rövid, de koherens akadémiai adattörténetet nyújtson felesleges technikai bonyolultság nélkül.",
      lensLabel: "Elemzési nézőpont",
      lensText:
        "A projekt nem tekinti eleve sem pozitívnak, sem negatívnak a hulladék energetikai hasznosítását. Ehelyett azt vizsgálja, hogyan illeszkedik az energiavisszanyerés a lerakás csökkentésének, az újrahasznosításnak és a fenntarthatósági átmenetnek a tágabb mintázataiba."
    },
    chapters: {
      part1Label: "I. rész",
      part1Title: "Hulladéknyomás és kezelési döntések",
      part1Text:
        "Az első lépés annak feltárása, mennyi települési hulladék keletkezik, majd annak vizsgálata, mi történik ezzel a hulladékkal a begyűjtés után. Együtt ezek az ábrák keretezik a nemzeti hulladékrendszerekre nehezedő szerkezeti nyomást.",
      part2Label: "II. rész",
      part2Title: "Körforgásosság és a szélesebb átmenet",
      part2Text:
        "A következő két ábra túlmutat magán a hulladékgazdálkodáson. Azt vizsgálja, hogy a hulladékkezelésben erősebb országok a megújuló energia és a körforgásos gazdaság mutatóiban is jobban teljesítenek-e.",
      part3Label: "III. rész",
      part3Title: "Klímakontextus és energetikai hasznosítás",
      part3Text:
        "Az utolsó rész tágabb kibocsátási kontextusba helyezi a hulladékrendszereket, majd interaktív összehasonlítással tér vissza közvetlenül a hulladékból energia kérdéséhez."
    },
    figures: {
      fig1Kicker: "1. ábra",
      fig1Heading: "Mennyi települési hulladék keletkezik egy főre vetítve?",
      fig1Caption:
        "Ez az ábra a 2023-as egy főre jutó települési hulladékmennyiséget hasonlítja össze az uniós országok között. Az alapnézet a teljes rangsort mutatja egységes vizuális kezeléssel, a szűrők pedig lehetővé teszik egy szűkebb országcsoport kiemelt összevetését.",
      fig2Kicker: "2. ábra",
      fig2Heading: "Hová kerül a települési hulladék a begyűjtés után?",
      fig2Caption:
        "Ez az ábra három kulcsfontosságú kezelési útvonalat vet össze 2023-ban: újrahasznosítás, lerakás és energetikai hasznosítással járó égetés. Az alapnézet a teljes elérhető országkört mutatja, a szűrők pedig az országok és a kezelési utak szűkítését teszik lehetővé. Lettország azért hiányzik, mert a szükséges 2023-as harmonizált bontás nem teljes.",
      fig3Kicker: "3. ábra",
      fig3Heading: "Milyen ütemben bővül a megújuló energia részaránya?",
      fig3Caption:
        "Ez az ábra a hulladékból energia kérdését a szélesebb energiatranzíció kontextusába helyezi. Az alapnézet az összes elérhető uniós országot tartalmazza, a szűrők pedig segítenek csökkenteni a vizuális sűrűséget, ha egy kisebb összehasonlítás hasznosabb.",
      fig4Kicker: "4. ábra",
      fig4Heading: "Jár-e együtt a magasabb újrahasznosítás erősebb körforgásossággal?",
      fig4Caption:
        "Ez az ábra a települési újrahasznosítási arányt veti össze a körforgásos anyagfelhasználási aránnyal a legfrissebb közös elérhető évben. Az alapnézet az uniós szórást mutatja, a szűrők pedig lehetővé teszik kisebb országcsoportok részletesebb vizsgálatát.",
      fig5Kicker: "5. ábra",
      fig5Heading: "Mennyire eltérő a klímakontextus az országok között?",
      fig5Caption:
        "Ez az ábra az egy főre jutó üvegházhatásúgáz-kibocsátással ad tágabb környezeti kontextust. Bár a mutató a gazdaság számos részét tükrözi, nem csupán a hulladékgazdálkodást, segít a nemzeti hulladék- és energiamintázatok szélesebb klímapolitikai értelmezésében.",
      fig6Kicker: "6. ábra",
      fig6Heading: "Hogyan változott a hulladék energetikai hasznosítása az időben?",
      fig6Caption:
        "Ez az interaktív ábra a települési hulladék energetikai hasznosítását követi nyomon időben. Harmonizált Eurostat adatokon alapuló közelítő mutató, amely országonként, illetve az uniós átlaghoz mérten is összevethető."
    },
    highlight: {
      label: "Köztes tanulság",
      text:
        "A kezelési adatok azt sugallják, hogy az alacsonyabb lerakási arány gyakran fejlettebb hulladékgazdálkodási rendszerekkel jár együtt, ugyanakkor az újrahasznosítás és az energetikai hasznosítás közötti egyensúly országonként továbbra is élesen eltér."
    },
    spotlight: {
      kicker: "Országfókusz",
      title: "Négy eltérő nemzeti pálya",
      romaniaTitle: "Románia",
      romaniaStat: "75,7% lerakási arány",
      romaniaText:
        "Románia viszonylag alacsony hulladékképződést kombinál rendkívül magas lerakási aránnyal, ami jól mutatja, hogy az alacsony hulladékmennyiség önmagában nem jelent körforgásosabb rendszert.",
      hungaryTitle: "Magyarország",
      hungaryStat: "33,3% újrahasznosítási arány",
      hungaryText:
        "Magyarország továbbra is jelentősen támaszkodik a lerakásra, ugyanakkor érzékelhetően jobban teljesít Romániánál az újrahasznosítás, a körforgásosság és az energetikai hasznosítás terén.",
      germanyTitle: "Németország",
      germanyStat: "68,5% újrahasznosítási arány",
      germanyText:
        "Németország az egyik legerősebb újrahasznosítási teljesítményt mutatja, és jól szemlélteti, hogyan csökkenthető a lerakás egy diverzifikáltabb kezelési mix révén.",
      swedenTitle: "Svédország",
      swedenStat: "62,8% megújuló részarány",
      swedenText:
        "Svédország kevésbé a hulladékképződésével, inkább azzal tűnik ki, hogy az energiatranzíció és az energiavisszanyerés hogyan illeszkedik egy szélesebb, alacsony lerakású modellbe."
    },
    explorer: {
      kicker: "Összehasonlító panel",
      title: "Építs országprofilt több mutató mentén",
      intro:
        "A fenti grafikonok a teljesítmény különböző dimenzióit külön-külön mutatják meg. Ez a panel egyetlen ország köré rendezi őket, hogy integráltabban lehessen összevetni a hulladékképződést, a kezelési szerkezetet, a megújuló energia alakulását, a körforgásosságot és a kibocsátási kontextust.",
      selectLabel: "Ország kiválasztása",
      profileKicker: "Profilösszegzés",
      tableKicker: "Összehasonlító táblázat",
      tableTitle: "Kiválasztott mutatók egymás mellett",
      tableCountry: "Ország",
      tableWaste: "Hulladék",
      tableRecycling: "Újrahasznosítás",
      tableLandfill: "Lerakás",
      tableGhg: "ÜHG"
    },
    methods: {
      kicker: "Módszertan",
      title: "Adatkör, források és korlátok",
      sourcesTitle: "Adatforrások",
      sourcesText:
        "A projekt az Eurostat és a Világbank tisztított adatkivonatait használja. Ahol a forrás támogatja, az oldal a teljes uniós országkört alkalmazza kis minta helyett. A forráslinkek és fájlkapcsolatok a <code>DATA_SOURCES.md</code> fájlban találhatók.",
      comparabilityTitle: "Összehasonlíthatóság",
      comparabilityText:
        "Az ábrák országok közötti összevetésre készültek, de az értelmezésnél továbbra is számítanak a jelentési gyakorlat, a rendszerhatárok és a nemzeti infrastruktúra különbségei. Jó példa erre a 2. ábra, ahol Lettország hiányzik a szükséges 2023-as harmonizált bontás hiánya miatt.",
      cautionTitle: "Értelmezési óvatosság",
      cautionText:
        "Az ábrák leíró jellegűek, nem oksági állításokra szolgálnak. Mintázatok, eltérések és további kérdések azonosítását segítik, nem végső szakpolitikai rangsort adnak."
    },
    sources: {
      kicker: "Adatforrások",
      title: "A portfólióban használt hivatalos adatforrások",
      eurostatTitle: "Eurostat",
      eurostatText:
        "A fő hulladék-, kezelési, megújuló energia- és körforgásossági mutatók az Eurostatból származnak, a weboldalhoz tisztított helyi formában felhasználva.",
      worldBankTitle: "Világbank",
      worldBankText:
        "Az üvegházhatású gázokkal kapcsolatos kontextusmutató a Világbank API-jából származik, hogy friss országközi környezeti összehasonlítást adjon.",
      notesTitle: "Projekt adatjegyzetek",
      notesText:
        "A fájlszintű forráskapcsolatok, mutatójegyzetek és átalakítási részletek a <code>DATA_SOURCES.md</code> fájlban találhatók az átláthatóság és reprodukálhatóság érdekében.",
      visitSource: "Forrás megnyitása",
      openNote: "Adatjegyzet megnyitása"
    },
    contributors: {
      kicker: "Projektközreműködők",
      title: "A projekt mögött álló együttműködők",
      caption: "A projekt közreműködői: Tóth Attila és Szakács Róbert.",
      photoAlt: "A projekt közreműködői, Tóth Attila és Szakács Róbert",
      text1:
        "Ez a weboldal közös egyetemi projektként készült, amely az európai hulladékrendszerekre, energetikai hasznosításra és fenntarthatóságra összpontosít. A projekt a nyilvános adatelemzést gondos vizuális történetmeséléssel ötvözi egy olyan formában, amely olvasható, átlátható és könnyen karbantartható marad.",
      text2:
        "A közös fotó itt projekt-assetként jelenik meg, nem dekorációként. Célja, hogy a portfólió személyesebb és egyértelműbben szerzőhöz kötött legyen, miközben megőrzi a professzionális akadémiai hangnemet."
    },
    dashboard: {
      kicker: "Interaktív irányítópult",
      title: "Állíts össze saját országközi összehasonlítást",
      intro:
        "Ez a záró irányítópult nyitott feltáró eszközzé alakítja a projektet. Az országok, mutatók és évek kiválasztásával szabadon összehasonlíthatók a mintázatok. A grafikon a szerkezetet mutatja, a mellette lévő tábla pedig a pontos numerikus értékeket adja vissza.",
      insightKicker: "Elemző összegzés",
      insightTitle: "Mi emelkedik ki ebben a kiválasztásban",
      insightIntro:
        "Az irányítópult a látható sorokat rövid, összehasonlító értelmezéssé alakítja.",
      controlsTitle: "Válaszd ki, mit szeretnél összevetni",
      reset: "Irányítópult alaphelyzet",
      countries: "Országok",
      countriesHelp: "Nyisd meg a választót, és jelölj ki egy vagy több országot.",
      indicators: "Mutatók",
      indicatorsHelp:
        "Egy mutató letisztultabb összehasonlítást ad, több mutató pedig facetelt nézetet eredményez.",
      startYear: "Kezdőév",
      endYear: "Záróév",
      noteDefault: "Az irányítópult a szűrők módosításakor automatikusan frissül.",
      currentView: "Aktuális nézet",
      currentViewLoading: "Az irányítópult nézete betöltés alatt.",
      exactValues: "Pontos értékek",
      tableLoading: "A táblázat betöltés alatt.",
      tableCountry: "Ország",
      tableIndicator: "Mutató",
      tableYear: "Év",
      tableValue: "Érték",
      noteSparse:
        "Néhány kiválasztott mutató csak egy friss évre érhető el, ezért csak ott jelenik meg, ahol a forrásadat rendelkezésre áll.",
      noteNeedSelection: "Válassz ki legalább egy országot és egy mutatót.",
      noteAutoUpdate:
        "A grafikon és a táblázat automatikusan frissül, amikor módosítod a szűrőket.",
      summary: "{countries} ország, {indicators} mutató, {startYear}–{endYear} közötti évek.",
      summaryEmpty: "A jelenlegi irányítópult-választásnak nincs megfelelő adata.",
      tableRows: "{count} sor látható.",
      tableRowsEmpty: "0 sor látható.",
      tableEmpty: "A jelenlegi irányítópult-választásnak nincs megfelelő értéke.",
      chartTrendTitle: "Irányítópult trendnézet",
      chartSnapshotTitle: "Irányítópult pillanatkép: {year}",
      chartDenseTitle: "Ez az irányítópult-nézet túl sűrű a jól olvasható megjelenítéshez.",
      chartDenseText: "Próbálj kevesebb országot, kevesebb mutatót vagy rövidebb idősávot választani.",
      chartErrorTitle: "Az irányítópult grafikonja nem tölthető be.",
      chartErrorText: "Ellenőrizd az aktuális szűrőbeállításokat és a grafikon konfigurációját.",
      insightHeadlineSingleIndicator:
        "{country} vezeti a jelenlegi {indicator} összehasonlítást, és {gap} látható különbséget nyit {laggard} előtt.",
      insightHeadlineBalanced:
        "{country} mutatja a legerősebb összképet a jelenleg kiválasztott mutatók mentén.",
      insightHeadlineSingleCountry:
        "{country} ebben a nézetben inkább fókuszált országprofilként, mint országközi rangsorként olvasható.",
      cardTopPerformer: "Éllovas",
      cardTopPerformerNote: "{indicator}: {value}",
      cardBiggestGap: "Legnagyobb rés",
      cardBiggestGapNote: "{indicator}: {leader} és {laggard}",
      cardStandoutCountry: "Kiemelkedő ország",
      cardStandoutCountryNote: "{count} látható mutatóban áll az élen.",
      cardBalancedProfile: "Legkiegyensúlyozottabb profil",
      cardBalancedProfileNote: "A legerősebb átlagos helyezés {count} mutatóban.",
      cardProfileType: "Profiltípus",
      cardProfileTypeNote: "Értelmezés a látható mutatók kombinációja alapján.",
      cardNeedsImprovement: "Fejlesztendő terület",
      cardCoverage: "Lefedettség",
      cardCoverageValue: "{indicators} mutató, {years} év",
      cardCoverageNote: "{count} látható megfigyelés az aktuális nézetben.",
      narrativeLeader:
        "{country} vezeti a(z) {indicator} mutatót {value} értékkel, miközben {laggard} adja a leggyengébb látható eredményt {laggardValue} mellett.",
      narrativeGap:
        "A legszélesebb eltérés a(z) {indicator} esetében látszik, ahol az éllovas {gap} távolságra van a leggyengébb látható eredménytől, és {avgGapPercent} előnnyel áll a kiválasztott csoportátlag felett.",
      narrativeTrendImprovement:
        "{country} mutatja a legmarkánsabb tartományon belüli javulást a(z) {indicator} esetében: {delta} változás {startYear} és {endYear} között.",
      narrativeTrendRank:
        "Ugyanebben az összehasonlításban {country} a(z) {startRank}. helyről a(z) {endRank}. helyre mozdul el.",
      narrativePairRecyclingLandfill:
        "{country} átlag feletti újrahasznosítást kapcsol átlag alatti lerakással, ami a jelenlegi kiválasztásban viszonylag érettebb kezelési mixre utal.",
      narrativePairCircularity:
        "{country} úgy vezeti a körforgásos anyagfelhasználást, hogy közben a települési újrahasznosításban csak középmezőnyös, ami arra utal, hogy a tágabb anyaghatékonyság túlmutat a hulladékgyűjtésen.",
      narrativePairEnergyLandfill:
        "{country} erős energetikai hasznosítást párosít továbbra is magas lerakással, ami olyan átmeneti modellt jelez, amely még nem szorította ki teljesen az ártalmatlanítást.",
      narrativeSingleCountryStrength:
        "{country} leginkább látható erőssége a(z) {indicator}, {value} értékkel.",
      narrativeSingleCountryWeakness:
        "{country} legnyilvánvalóbb nyomáspontja a(z) {indicator}, {value} értékkel.",
      narrativeCoverage:
        "Ez a nézet {count} látható megfigyelésre épül, {countries} ország és {indicators} mutató mentén.",
      profileMixed: "vegyes átmeneti profil",
      profileLandfill: "lerakásfüggő profil",
      profileRecycling: "újrahasznosítás-vezérelt profil",
      profileLowLandfill: "alacsony lerakású, hasznosítás-orientált profil",
      profileRecovery: "hasznosítás-vezérelt átmeneti profil"
    },
    dashboardInsights: {
      excellence: {
        municipal_waste_per_capita: "hulladéknyomás kezelése",
        recycling_share: "újrahasznosítási teljesítmény",
        landfill_share: "lerakás visszaszorítása",
        energy_recovery_share: "hasznosítási rendszer mélysége",
        renewable_energy_share: "megújulóenergia-átmenet",
        circular_material_use_rate: "körforgásos anyaghatékonyság",
        ghg_per_capita: "alacsony kibocsátású profil",
        energy_recovery_level: "energetikai hasznosítási kapacitás"
      }
    },
    dashboardIndicators: {
      municipal_waste_per_capita: "Települési hulladék egy főre vetítve",
      recycling_share: "Újrahasznosítási arány",
      landfill_share: "Lerakási arány",
      energy_recovery_share: "Energetikai hasznosítás aránya",
      renewable_energy_share: "Megújuló energia részaránya",
      circular_material_use_rate: "Körforgásos anyagfelhasználási arány",
      ghg_per_capita: "ÜHG-kibocsátás egy főre vetítve",
      energy_recovery_level: "Energetikai hasznosítás szintje"
    },
    units: {
      kgPerCapita: "kg/fő",
      percent: "%",
      ghgPerCapita: "tCO2e/fő"
    },
    conclusion: {
      kicker: "Következtetés",
      title: "Mit mutat meg végső soron ez a portfólió",
      text1:
        "Az ábrák együtt azt sugallják, hogy a települési hulladékgazdálkodást Európában nem önálló technikai ágazatként, hanem egy szélesebb fenntarthatósági rendszer részeként érdemes értelmezni. A lerakás csökkentése, az újrahasznosítás ereje, az energetikai hasznosítás, a megújuló energia és a klímakontextus nem mozog tökéletesen együtt, de jól láthatóan kapcsolódnak egymáshoz.",
      text2:
        "Ezért a hulladékból energia analitikailag hasznos, de önmagában nem elégséges nézőpont: igazán akkor értelmezhető, ha a szélesebb kezelési döntésekkel és átmeneti mutatókkal együtt olvassuk. Románia és Magyarország ezt különösen jól szemlélteti: ugyanazon uniós szakpolitikai térben helyezkednek el, mégis érdemben eltérő kezelési mixet és fenntarthatósági pozíciót mutatnak."
    },
    footer: {
      noteKicker: "Projektmegjegyzés",
      noteTitle: "Hulladékból energia és fenntarthatóság Európában",
      noteText:
        "Egyetemi adatvizualizációs portfólióprojektként készült, az összehasonlító hulladékrendszerekre, energetikai hasznosításra és a szélesebb fenntarthatósági kontextusra összpontosítva. Az oldal szándékosan könnyű, szerkeszthető és GitHub Pages statikus közzétételre alkalmas.",
      text1:
        "Statikus portfólióoldal egyetemi adatvizualizációs projekthez, HTML, CSS, JavaScript és Vega-Lite használatával.",
      text2:
        "Kezdőbarát, teljesen szerkeszthető GitHub Pages projekt átlátható nyilvános adatforrásokkal."
    },
    dynamic: {
      highestWasteLabel: "Legmagasabb hulladékszint",
      strongestRecyclingLabel: "Legerősebb újrahasznosítási arány",
      highestRenewableLabel: "Legmagasabb megújuló részarány",
      focusLabel: "Románia és Magyarország",
      landfillNote: "A keletkezett települési hulladék lerakási aránya 2023-ban.",
      explorerProfileSummary: "Profilösszegzés",
      rankingTableTitle: "Kiválasztott mutatók egymás mellett",
      wasteGeneration: "Hulladékképződés",
      wasteGenerationNote: "Egy főre jutó települési hulladék {year}-ban",
      recyclingShare: "Újrahasznosítási arány",
      recyclingShareNote: "A keletkezett települési hulladék aránya",
      landfillShare: "Lerakási arány",
      landfillShareNote: "Az alacsonyabb érték általában kisebb lerakófüggést jelez",
      energyRecovery: "Energetikai hasznosítás",
      energyRecoveryNote: "Energetikai hasznosításba kerülő települési hulladék {year}-ban",
      circularity: "Körforgásosság",
      circularityNote: "Körforgásos anyagfelhasználási arány {year}-ban",
      circularityUnavailable: "A jelenlegi részhalmazban nem elérhető",
      ghgContext: "ÜHG-kontextus",
      ghgContextNote: "Egy főre jutó üvegházhatásúgáz-kibocsátás {year}-ban",
      ghgUnavailable: "A jelenlegi részhalmazban nem elérhető",
      mixedSystem: "vegyes rendszer",
      lowLandfillSystem: "alacsony lerakású, magas hasznosítású rendszer",
      recyclingLedSystem: "újrahasznosítás-vezérelt rendszer",
      landfillReliantSystem: "viszonylag lerakásfüggő rendszer",
      renewableSentence: "{country} {year}-ban {value} megújuló részarányt ért el.",
      renewableUnavailable:
        "{country} nem rendelkezik illeszkedő megújulóenergia-értékkel a jelenlegi helyi adatkivonatban.",
      profileParagraph1:
        "A jelenlegi adatkiválasztásban <strong>{country}</strong> {systemType} benyomását kelti. A 2023-as kezelési mix <strong>{recycling}</strong> újrahasznosítást, <strong>{landfill}</strong> lerakást és <strong>{energy}</strong> energetikai hasznosítást mutat.",
      noChartDataTitle: "A jelenlegi szűrőkhöz nem tartozik megjeleníthető adat.",
      noChartDataText: "Módosítsd a kiválasztott országokat vagy szűrőket az adatok újbóli megjelenítéséhez.",
      chartLoadErrorTitle: "A grafikon nem tölthető be.",
      chartLoadErrorText: "Ellenőrizd a(z) {id} aktuális specifikációját vagy szűrőállapotát.",
      filterDefaults: "A szűrők használata opcionális. Az alapnézet a teljes elérhető adatkört mutatja.",
      resetFilters: "Szűrők alaphelyzet",
      allSelected: "Az összes {noun} ki van választva",
      noneSelected: "Nincs kiválasztott {noun}",
      selectedCount: "{selected} / {total} {noun} kiválasztva",
      selectAll: "Összes",
      clearAll: "Törlés",
      enabled: "Bekapcsolva",
      disabled: "Kikapcsolva",
      checkboxDefault: "Az opció alapértelmezés szerint aktív.",
      openPicker: "Megnyitás",
      closePicker: "Bezárás",
      allOptionsDefault: "Minden elérhető opció alapértelmezés szerint be van kapcsolva.",
      notAvailable: "Nem elérhető",
      countriesNoun: "ország",
      indicatorsNoun: "mutató",
      optionsNoun: "opció"
    },
    charts: {
      wasteTitle: "Települési hulladékképződés egy főre vetítve az uniós országokban",
      wasteAxis: "Kilogramm / fő",
      wasteTooltip: "Hulladék / fő (kg)",
      treatmentTitle: "A hulladékkezelési profilok erős lerakási választóvonalat mutatnak",
      treatmentAxis: "A keletkezett települési hulladék aránya (%)",
      treatmentLegend: "Kezelési útvonal",
      treatmentTooltip: "Arány (%)",
      renewableTitle: "A megújuló energia részaránya nő az EU-ban, de egyenetlenül",
      renewableAxis: "Megújuló energia részaránya (%)",
      renewableTooltip: "Részarány (%)",
      circularTitle: "Az újrahasznosítási vezető szerep nem mindig jelent körforgásossági vezetést",
      circularXAxis: "A települési hulladék újrahasznosítási aránya (%)",
      circularYAxis: "Körforgásos anyagfelhasználási arány (%)",
      circularTooltip: "Körforgásos arány (%)",
      ghgTitle: "Az üvegházhatású gázok kontextusa is élesen eltér az EU-ban",
      ghgAxis: "Tonna CO2-egyenérték / fő",
      ghgTooltip: "ÜHG-kibocsátás / fő (tCO2e)",
      energyTitle: "A települési hulladék energetikai hasznosítása továbbra is nagyon egyenetlen",
      energyAxis: "Kilogramm / fő",
      energyTooltip: "Energetikai hasznosítás (kg/fő)",
      benchmarkToggle: "EU-átlag megjelenítése",
      yearAxis: "Év",
      countryLegend: "Ország",
      countryTooltip: "Ország",
      indicatorTooltip: "Mutató",
      valueTooltip: "Érték",
      yearTooltip: "Év",
      treatment: {
        recycling: "Újrahasznosítás",
        landfill: "Lerakás",
        energy: "Energetikai hasznosítással járó égetés"
      }
    },
    countries: {
      Austria: "Ausztria",
      Belgium: "Belgium",
      Bulgaria: "Bulgária",
      Croatia: "Horvátország",
      Cyprus: "Ciprus",
      Czechia: "Csehország",
      Denmark: "Dánia",
      Estonia: "Észtország",
      "EU average": "EU-átlag",
      Finland: "Finnország",
      France: "Franciaország",
      Germany: "Németország",
      Greece: "Görögország",
      Hungary: "Magyarország",
      Ireland: "Írország",
      Italy: "Olaszország",
      Latvia: "Lettország",
      Lithuania: "Litvánia",
      Luxembourg: "Luxemburg",
      Malta: "Málta",
      Netherlands: "Hollandia",
      Poland: "Lengyelország",
      Portugal: "Portugália",
      Romania: "Románia",
      Slovakia: "Szlovákia",
      Slovenia: "Szlovénia",
      Spain: "Spanyolország",
      Sweden: "Svédország"
    }
  },
  ro: {
    meta: {
      title: "Valorificarea energetică a deșeurilor și sustenabilitatea în Europa",
      description:
        "Proiect universitar de portofoliu de vizualizare a datelor despre deșeurile municipale, recuperarea energetică și indicatorii de sustenabilitate din Europa."
    },
    language: {
      selector: "Selector de limbă",
      keyFacts: "Idei-cheie",
      dashboardFilters: "Filtrele tabloului de bord"
    },
    hero: {
      eyebrow: "Portofoliu de vizualizare a datelor",
      title: "Valorificarea energetică a deșeurilor și sustenabilitatea în Europa",
      subtitle:
        "Un studiu vizual concis despre modul în care țările europene generează deșeuri, le distribuie între diferite căi de tratare și le conectează cu tranziția energetică și performanța de sustenabilitate.",
      intro:
        "Gestionarea deșeurilor nu este doar o problemă de mediu. Ea reflectă și modul în care societățile consumă, cum este organizată infrastructura și cum echilibrează sistemele de politici reciclarea, reducerea depozitării, recuperarea energetică și obiectivele climatice. Acest proiect folosește indicatori publici europeni pentru a explora această relație, cu atenție specială acordată României și Ungariei în contextul mai larg al Uniunii Europene.",
      note:
        "Site-ul este construit ca un proiect GitHub Pages ușor, folosind HTML, CSS, JavaScript și Vega-Lite. Toate figurile se bazează pe extrase locale curate din surse publice oficiale, în principal Eurostat și Banca Mondială.",
      panelKicker: "Întrebare de pornire",
      panelText:
        "Țările care depind mai puțin de depozitare și au sisteme de recuperare mai puternice arată și performanțe mai bune în indicatorii mai largi de sustenabilitate?",
      navWaste: "Sistemul de deșeuri",
      navCircularity: "Circularitate",
      navClimate: "Context climatic",
      navMethods: "Metodologie"
    },
    overview: {
      kicker: "Cadrul proiectului",
      title: "Cum poate fi citit acest proiect",
      researchTitle: "Întrebarea de cercetare",
      researchText:
        "Întrebarea centrală este cum variază generarea și tratarea deșeurilor în Europa și dacă sistemele mai puternice de reciclare și recuperare sunt asociate cu o performanță mai bună în indicatorii mai largi de sustenabilitate.",
      storyTitle: "Structura narativă",
      storyText:
        "Pagina pornește de la presiunea generată de deșeuri, continuă cu alegerile de tratare și ajunge la contextul mai larg al sustenabilității. Această ordine este gândită pentru ca figurile să funcționeze împreună ca un argument, nu ca grafice izolate.",
      dataTitle: "Integrarea datelor",
      dataText:
        "Dosarul <code>data/</code> reflectă deja fluxul de lucru dorit: graficele folosesc fișiere locale curate derivate din seturi publice oficiale, iar maparea surselor este documentată transparent în <code>DATA_SOURCES.md</code>."
    },
    insights: {
      kicker: "Principalele constatări",
      title: "Ce sugerează dovezile actuale",
      card1Title: "Generarea deșeurilor rămâne inegală",
      card1Text:
        "Acoperirea la nivelul UE arată că deșeurile municipale generate pe cap de locuitor diferă puternic între statele membre, ceea ce sugerează că modelele de consum, sistemele de servicii și practicile de raportare rămân diferite.",
      card2Title: "Depozitarea redusă coincide adesea cu o capacitate de sistem mai puternică",
      card2Text:
        "Țările cu depozitare minimă tind să combine reciclarea și recuperarea energetică, nu să se bazeze pe o singură soluție dominantă.",
      card3Title: "Reciclarea și circularitatea sunt legate, dar nu identice",
      card3Text:
        "Un nivel ridicat al reciclării municipale nu înseamnă automat și cea mai mare rată de utilizare circulară a materialelor, deoarece contează și structura mai largă a economiei.",
      card4Title: "România și Ungaria ilustrează două poziții diferite în tranziție",
      card4Text:
        "România rămâne mult mai dependentă de depozitare, în timp ce Ungaria înregistrează valori mai bune pentru reciclare, circularitate și recuperare energetică. Ambele sunt puncte de referință importante în comparația central- și est-europeană din interiorul UE."
    },
    purpose: {
      kicker: "Scopul proiectului",
      title: "De ce contează această temă",
      text1:
        "Politica privind deșeurile se află la intersecția dintre protecția mediului, gestionarea resurselor și strategia energetică. Acest site este conceput ca un portofoliu compact pentru un proiect universitar și introduce indicatori cheie despre generarea deșeurilor, căile de tratare, energia regenerabilă, circularitate și performanța de sustenabilitate în Europa.",
      text2:
        "Scopul este de a combina o structură vizuală clară cu utilizarea transparentă a datelor publice, pentru a produce o poveste analitică academică concisă fără complexitate tehnică inutilă.",
      lensLabel: "Lentilă analitică",
      lensText:
        "Proiectul nu pornește de la presupunerea că valorificarea energetică a deșeurilor este în mod intrinsec pozitivă sau negativă. În schimb, analizează modul în care recuperarea energetică se încadrează în tiparele mai largi ale reducerii depozitării, performanței reciclării și tranziției de sustenabilitate."
    },
    chapters: {
      part1Label: "Partea I",
      part1Title: "Presiunea deșeurilor și alegerile de tratare",
      part1Text:
        "Primul pas este stabilirea cantității de deșeuri municipale generate și apoi examinarea a ceea ce se întâmplă cu aceste deșeuri după colectare. Împreună, figurile conturează presiunea structurală exercitată asupra sistemelor naționale de deșeuri.",
      part2Label: "Partea a II-a",
      part2Title: "Circularitate și tranziția mai largă",
      part2Text:
        "Următoarele două figuri depășesc operațiunile de gestionare a deșeurilor și întreabă dacă țările care par mai puternice în acest domeniu arată și performanțe mai bune în indicatorii energiei regenerabile și ai economiei circulare.",
      part3Label: "Partea a III-a",
      part3Title: "Context climatic și recuperare energetică",
      part3Text:
        "Secțiunea finală plasează sistemele de deșeuri într-un context mai larg al emisiilor și revine apoi direct la tema valorificării energetice printr-o comparație interactivă a tendințelor de recuperare energetică."
    },
    figures: {
      fig1Kicker: "Figura 1",
      fig1Heading: "Câte deșeuri municipale se generează pe cap de locuitor?",
      fig1Caption:
        "Această figură compară cantitatea de deșeuri municipale generate pe cap de locuitor în țările UE în 2023. Vizualizarea de bază arată clasamentul complet cu tratament egal pentru toate țările, iar filtrele permit izolarea unui grup mai restrâns pentru comparații mai atente.",
      fig2Kicker: "Figura 2",
      fig2Heading: "Unde ajung deșeurile municipale după colectare?",
      fig2Caption:
        "Această figură compară trei căi esențiale de tratare în 2023: reciclarea, depozitarea și incinerarea cu recuperare energetică. Vizualizarea implicită menține toate țările disponibile, iar filtrele permit restrângerea atât a setului de țări, cât și a căilor de tratare afișate. Letonia este absentă deoarece descompunerea armonizată necesară pentru 2023 nu este completă.",
      fig3Kicker: "Figura 3",
      fig3Heading: "Cât de rapid se extinde ponderea energiei regenerabile?",
      fig3Caption:
        "Această figură plasează tema valorificării energetice a deșeurilor în contextul tranziției energetice mai largi. Vizualizarea implicită include toate țările disponibile din UE, iar filtrele ajută la reducerea densității vizuale atunci când o comparație mai mică este mai utilă.",
      fig4Kicker: "Figura 4",
      fig4Heading: "Ratele mai mari de reciclare implică o circularitate mai puternică?",
      fig4Caption:
        "Această figură compară rata de reciclare a deșeurilor municipale cu rata de utilizare circulară a materialelor în cel mai recent an comun disponibil. Vizualizarea implicită arată dispersia la nivelul UE, iar filtrele permit focalizarea pe grupuri mai mici de țări.",
      fig5Kicker: "Figura 5",
      fig5Heading: "Cât de diferit este contextul climatic între țări?",
      fig5Caption:
        "Această figură adaugă context prin emisiile de gaze cu efect de seră pe cap de locuitor. Deși indicatorul reflectă mai multe sectoare ale economiei, nu doar gestionarea deșeurilor, el ajută la plasarea tiparelor naționale într-un cadru climatic mai larg.",
      fig6Kicker: "Figura 6",
      fig6Heading: "Cum s-a schimbat în timp recuperarea energetică a deșeurilor?",
      fig6Caption:
        "Această figură interactivă urmărește în timp deșeurile municipale trimise către recuperare energetică. Ea funcționează ca un proxy armonizat pentru comparația valorificării energetice și poate fi analizată atât pe țări, cât și în raport cu media UE."
    },
    highlight: {
      label: "Concluzie intermediară",
      text:
        "Datele despre tratare sugerează că dependența mai redusă de depozitare este adesea asociată cu sisteme de gestionare a deșeurilor mai dezvoltate, dar echilibrul dintre reciclare și recuperare energetică diferă în continuare puternic între țări."
    },
    spotlight: {
      kicker: "Țări în prim-plan",
      title: "Patru trasee naționale contrastante",
      romaniaTitle: "România",
      romaniaStat: "75,7% pondere a depozitării",
      romaniaText:
        "România combină un nivel relativ scăzut al deșeurilor municipale generate cu o dependență foarte ridicată de depozitare, arătând că volumele reduse de deșeuri nu înseamnă automat un sistem mai circular.",
      hungaryTitle: "Ungaria",
      hungaryStat: "33,3% pondere a reciclării",
      hungaryText:
        "Ungaria depinde încă semnificativ de depozitare, dar performează vizibil mai bine decât România la reciclare, circularitate și recuperare energetică.",
      germanyTitle: "Germania",
      germanyStat: "68,5% pondere a reciclării",
      germanyText:
        "Germania rămâne una dintre cele mai puternice performere la reciclare și ilustrează modul în care depozitarea poate fi redusă printr-un mix mai diversificat de căi de tratare.",
      swedenTitle: "Suedia",
      swedenStat: "62,8% pondere a energiei regenerabile",
      swedenText:
        "Suedia se remarcă mai puțin prin nivelul de deșeuri generate și mai mult prin modul în care tranziția energetică și recuperarea energetică sunt integrate într-un model mai larg cu depozitare redusă."
    },
    explorer: {
      kicker: "Explorer comparativ",
      title: "Construiește un profil de țară pe mai mulți indicatori",
      intro:
        "Graficele de mai sus arată dimensiuni separate ale performanței. Acest panou le reunește astfel încât o țară să poată fi analizată într-un mod mai integrat, comparând generarea de deșeuri, structura tratării, extinderea energiei regenerabile, circularitatea și contextul emisiilor.",
      selectLabel: "Selectează țara",
      profileKicker: "Rezumatul profilului",
      tableKicker: "Tabel comparativ",
      tableTitle: "Indicatori selectați, comparați direct",
      tableCountry: "Țară",
      tableWaste: "Deșeuri",
      tableRecycling: "Reciclare",
      tableLandfill: "Depozitare",
      tableGhg: "GES"
    },
    methods: {
      kicker: "Metodologie",
      title: "Acoperirea datelor, surse și limitări",
      sourcesTitle: "Surse de date",
      sourcesText:
        "Proiectul folosește extrase curate din Eurostat și Banca Mondială. Acolo unde sursa o permite, site-ul utilizează acoperire completă la nivelul statelor UE, nu un eșantion restrâns. Legăturile către surse și mapările fișierelor sunt documentate în <code>DATA_SOURCES.md</code>.",
      comparabilityTitle: "Comparabilitate",
      comparabilityText:
        "Figurile sunt construite pentru comparații între țări, dar diferențele de practică de raportare, limite de sistem și infrastructură națională contează încă în interpretare. Un exemplu este Figura 2, unde Letonia este exclusă deoarece descompunerea armonizată necesară pentru 2023 nu este completă.",
      cautionTitle: "Prudență interpretativă",
      cautionText:
        "Graficele sunt descriptive, nu cauzale. Ele sunt menite să identifice tipare, contraste și întrebări utile pentru analize ulterioare, nu să ofere clasamente definitive de politică publică."
    },
    sources: {
      kicker: "Surse de date",
      title: "Seturile oficiale de date folosite în acest portofoliu",
      eurostatTitle: "Eurostat",
      eurostatText:
        "Indicatorii principali despre deșeuri, tratare, energie regenerabilă și circularitate provin din Eurostat, în formă locală curățată pentru acest site.",
      worldBankTitle: "Banca Mondială",
      worldBankText:
        "Indicatorul contextual privind gazele cu efect de seră este extras din API-ul Băncii Mondiale pentru a oferi o comparație recentă între țări.",
      notesTitle: "Notele de date ale proiectului",
      notesText:
        "Maparea surselor la nivel de fișier, notele privind indicatorii și detaliile de transformare sunt documentate în <code>DATA_SOURCES.md</code> pentru transparență și reproductibilitate.",
      visitSource: "Deschide sursa",
      openNote: "Deschide nota de date"
    },
    contributors: {
      kicker: "Contribuitorii proiectului",
      title: "Despre colaboratorii din spatele proiectului",
      caption: "Colaboratorii proiectului: Tóth Attila și Szakács Róbert.",
      photoAlt: "Colaboratorii proiectului, Tóth Attila și Szakács Róbert",
      text1:
        "Acest site a fost dezvoltat ca proiect universitar colaborativ, axat pe sistemele de deșeuri, recuperarea energetică și sustenabilitatea în Europa. Proiectul combină analiza datelor publice cu o prezentare vizuală atentă, într-un format conceput să rămână lizibil, transparent și ușor de întreținut.",
      text2:
        "Fotografia colaboratorilor este folosită aici ca asset de proiect, nu ca element decorativ. Scopul ei este să ofere portofoliului o identitate mai clară și mai personală, păstrând în același timp un ton academic profesionist."
    },
    dashboard: {
      kicker: "Tablou de bord interactiv",
      title: "Construiește propria comparație între țări",
      intro:
        "Acest tablou de bord final transformă proiectul într-un instrument deschis de explorare. Poți selecta țări, indicatori și ani pentru a compara vizual tiparele, iar tabelul alăturat afișează valorile numerice exacte folosite în vizualizare.",
      controlsTitle: "Alege ce vrei să compari",
      reset: "Resetează tabloul de bord",
      countries: "Țări",
      countriesHelp: "Deschide selectorul și bifează una sau mai multe țări.",
      indicators: "Indicatori",
      indicatorsHelp:
        "Un singur indicator produce o comparație mai curată, iar mai mulți indicatori generează o vedere facettată.",
      startYear: "An de început",
      endYear: "An de sfârșit",
      noteDefault: "Tabloul de bord se actualizează automat când filtrele se schimbă.",
      currentView: "Vizualizarea curentă",
      currentViewLoading: "Vizualizarea tabloului de bord se încarcă.",
      exactValues: "Valori exacte",
      tableLoading: "Tabelul se încarcă.",
      tableCountry: "Țară",
      tableIndicator: "Indicator",
      tableYear: "An",
      tableValue: "Valoare",
      noteSparse:
        "Unii indicatori selectați sunt disponibili doar pentru un an recent, astfel că apar doar acolo unde există date în sursă.",
      noteNeedSelection: "Selectează cel puțin o țară și un indicator.",
      noteAutoUpdate:
        "Graficul și tabelul se actualizează automat atunci când modifici filtrele.",
      summary: "{countries} țări, {indicators} indicatori, ani între {startYear} și {endYear}.",
      summaryEmpty: "Nu există date care să corespundă selecției curente din tabloul de bord.",
      tableRows: "{count} rânduri afișate.",
      tableRowsEmpty: "0 rânduri afișate.",
      tableEmpty: "Nu există valori care să corespundă selecției curente din tabloul de bord.",
      chartTrendTitle: "Vizualizare de trend pentru tabloul de bord",
      chartSnapshotTitle: "Instantaneu pentru tabloul de bord: {year}",
      chartDenseTitle: "Această vizualizare a tabloului de bord este prea densă pentru a rămâne clară.",
      chartDenseText: "Încearcă mai puține țări, mai puțini indicatori sau un interval de ani mai scurt.",
      chartErrorTitle: "Graficul tabloului de bord nu poate fi încărcat.",
      chartErrorText: "Verifică selecția curentă și configurația graficului."
    },
    dashboardIndicators: {
      municipal_waste_per_capita: "Deșeuri municipale pe cap de locuitor",
      recycling_share: "Ponderea reciclării",
      landfill_share: "Ponderea depozitării",
      energy_recovery_share: "Ponderea recuperării energetice",
      renewable_energy_share: "Ponderea energiei regenerabile",
      circular_material_use_rate: "Rata utilizării circulare a materialelor",
      ghg_per_capita: "Emisii GES pe cap de locuitor",
      energy_recovery_level: "Nivelul recuperării energetice"
    },
    units: {
      kgPerCapita: "kg/capita",
      percent: "%",
      ghgPerCapita: "tCO2e/capita"
    },
    conclusion: {
      kicker: "Concluzie",
      title: "Ce arată, în esență, acest portofoliu",
      text1:
        "Luate împreună, figurile sugerează că gestionarea deșeurilor municipale în Europa este cel mai bine înțeleasă ca parte a unui sistem mai larg de sustenabilitate, nu ca sector tehnic izolat. Reducerea depozitării, forța reciclării, recuperarea energetică, tranziția regenerabilă și contextul climatic nu evoluează perfect la unison, dar sunt clar conectate.",
      text2:
        "Astfel, valorificarea energetică a deșeurilor este o lentilă analitică utilă, dar incompletă: devine cu adevărat relevantă atunci când este citită alături de alegerile mai largi de tratare și de indicatorii tranziției. România și Ungaria ilustrează acest lucru în mod deosebit de clar: deși se află în același spațiu de politici al UE, ele prezintă mixuri de tratare și poziții de sustenabilitate semnificativ diferite."
    },
    footer: {
      noteKicker: "Notă de proiect",
      noteTitle: "Valorificarea energetică a deșeurilor și sustenabilitatea în Europa",
      noteText:
        "Realizat ca proiect universitar de portofoliu de vizualizare a datelor, cu accent pe compararea sistemelor de deșeuri, recuperarea energetică și contextul mai larg al sustenabilității. Site-ul este intenționat ușor, editabil și compatibil cu publicarea statică prin GitHub Pages.",
      text1:
        "Site static de portofoliu construit pentru un proiect universitar de vizualizare a datelor folosind HTML, CSS, JavaScript și Vega-Lite.",
      text2:
        "Proiect GitHub Pages prietenos pentru începători, complet editabil și bazat pe surse publice transparente."
    },
    dynamic: {
      highestWasteLabel: "Cel mai ridicat nivel al deșeurilor",
      strongestRecyclingLabel: "Cea mai puternică rată a reciclării",
      highestRenewableLabel: "Cea mai mare pondere regenerabilă",
      focusLabel: "România și Ungaria",
      landfillNote: "Ponderea depozitării în deșeurile municipale generate în 2023.",
      explorerProfileSummary: "Rezumatul profilului",
      rankingTableTitle: "Indicatori selectați, comparați direct",
      wasteGeneration: "Generarea de deșeuri",
      wasteGenerationNote: "Deșeuri municipale pe cap de locuitor în {year}",
      recyclingShare: "Ponderea reciclării",
      recyclingShareNote: "Pondere din deșeurile municipale generate",
      landfillShare: "Ponderea depozitării",
      landfillShareNote: "Valorile mai mici indică, de regulă, o dependență mai redusă de depozitare",
      energyRecovery: "Recuperare energetică",
      energyRecoveryNote: "Deșeuri municipale trimise către recuperare energetică în {year}",
      circularity: "Circularitate",
      circularityNote: "Rata de utilizare circulară a materialelor în {year}",
      circularityUnavailable: "Indisponibil în subsetul curent",
      ghgContext: "Contextul GES",
      ghgContextNote: "Emisii de gaze cu efect de seră pe cap de locuitor în {year}",
      ghgUnavailable: "Indisponibil în subsetul curent",
      mixedSystem: "un sistem mixt",
      lowLandfillSystem: "un sistem cu depozitare redusă și recuperare ridicată",
      recyclingLedSystem: "un sistem condus de reciclare",
      landfillReliantSystem: "un sistem comparativ dependent de depozitare",
      renewableSentence: "{country} a atins o pondere a energiei regenerabile de {value} în {year}.",
      renewableUnavailable:
        "{country} nu are o valoare compatibilă pentru energia regenerabilă în extrasul local curent.",
      profileParagraph1:
        "În selecția curentă de date, <strong>{country}</strong> pare {systemType}. Mixul de tratare din 2023 combină <strong>{recycling}</strong> reciclare, <strong>{landfill}</strong> depozitare și <strong>{energy}</strong> recuperare energetică.",
      noChartDataTitle: "Nu există date afișabile pentru filtrele curente.",
      noChartDataText: "Modifică țările sau filtrele selectate pentru a afișa din nou datele.",
      chartLoadErrorTitle: "Graficul nu poate fi încărcat.",
      chartLoadErrorText: "Verifică specificația sau starea curentă a filtrelor pentru {id}.",
      filterDefaults: "Filtrele sunt opționale. Vizualizarea implicită arată întregul set de date disponibil.",
      resetFilters: "Resetează filtrele",
      allSelected: "Toate {noun} sunt selectate",
      noneSelected: "Niciun {noun} selectat",
      selectedCount: "{selected} din {total} {noun} selectate",
      selectAll: "Selectează tot",
      clearAll: "Șterge tot",
      enabled: "Activat",
      disabled: "Dezactivat",
      checkboxDefault: "Opțiunea este activă implicit.",
      openPicker: "Deschide",
      closePicker: "Închide",
      allOptionsDefault: "Toate opțiunile disponibile sunt incluse implicit.",
      notAvailable: "Indisponibil",
      countriesNoun: "țări",
      indicatorsNoun: "indicatori",
      optionsNoun: "opțiuni"
    },
    charts: {
      wasteTitle: "Generarea deșeurilor municipale pe cap de locuitor în țările UE",
      wasteAxis: "Kilograme pe cap de locuitor",
      wasteTooltip: "Deșeuri pe cap de locuitor (kg)",
      treatmentTitle: "Profilele de tratare a deșeurilor evidențiază o puternică ruptură în funcție de depozitare",
      treatmentAxis: "Pondere din deșeurile municipale generate (%)",
      treatmentLegend: "Cale de tratare",
      treatmentTooltip: "Pondere (%)",
      renewableTitle: "Ponderea energiei regenerabile a crescut în UE, dar inegal",
      renewableAxis: "Ponderea energiei regenerabile (%)",
      renewableTooltip: "Pondere (%)",
      circularTitle: "Liderii reciclării nu sunt automat și lideri ai circularității",
      circularXAxis: "Rata de reciclare a deșeurilor municipale (%)",
      circularYAxis: "Rata de utilizare circulară a materialelor (%)",
      circularTooltip: "Rata de utilizare circulară (%)",
      ghgTitle: "Contextul gazelor cu efect de seră variază puternic în UE",
      ghgAxis: "Tone CO2 echivalent pe cap de locuitor",
      ghgTooltip: "Emisii GES pe cap de locuitor (tCO2e)",
      energyTitle: "Recuperarea energetică a deșeurilor municipale rămâne puternic inegală",
      energyAxis: "Kilograme pe cap de locuitor",
      energyTooltip: "Recuperare energetică (kg/capita)",
      benchmarkToggle: "Afișează media UE",
      yearAxis: "An",
      countryLegend: "Țară",
      countryTooltip: "Țară",
      indicatorTooltip: "Indicator",
      valueTooltip: "Valoare",
      yearTooltip: "An",
      treatment: {
        recycling: "Reciclare",
        landfill: "Depozitare",
        energy: "Incinerare cu recuperare energetică"
      }
    },
    countries: {
      Austria: "Austria",
      Belgium: "Belgia",
      Bulgaria: "Bulgaria",
      Croatia: "Croația",
      Cyprus: "Cipru",
      Czechia: "Cehia",
      Denmark: "Danemarca",
      Estonia: "Estonia",
      "EU average": "Media UE",
      Finland: "Finlanda",
      France: "Franța",
      Germany: "Germania",
      Greece: "Grecia",
      Hungary: "Ungaria",
      Ireland: "Irlanda",
      Italy: "Italia",
      Latvia: "Letonia",
      Lithuania: "Lituania",
      Luxembourg: "Luxemburg",
      Malta: "Malta",
      Netherlands: "Țările de Jos",
      Poland: "Polonia",
      Portugal: "Portugalia",
      Romania: "România",
      Slovakia: "Slovacia",
      Slovenia: "Slovenia",
      Spain: "Spania",
      Sweden: "Suedia"
    }
  }
};

function getNestedValue(source, path) {
  return path.split(".").reduce((current, key) => current?.[key], source);
}

function interpolate(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
}

const languageListeners = [];
const fallbackLanguage = "en";
const defaultLanguage = "en";

function detectInitialLanguage() {
  const stored = localStorage.getItem("portfolio-language");
  if (stored && translations[stored]) {
    return stored;
  }

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith("ro")) {
    return "ro";
  }

  if (browserLanguage.startsWith("hu")) {
    return "hu";
  }

  if (browserLanguage.startsWith("en")) {
    return "en";
  }

  return fallbackLanguage;
}

function storeDefaultTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    if (!element.dataset.i18nDefaultText) {
      element.dataset.i18nDefaultText = element.textContent;
    }
  });

  root.querySelectorAll("[data-i18n-html]").forEach((element) => {
    if (!element.dataset.i18nDefaultHtml) {
      element.dataset.i18nDefaultHtml = element.innerHTML;
    }
  });

  root.querySelectorAll("[data-i18n-content]").forEach((element) => {
    if (!element.dataset.i18nDefaultContent) {
      element.dataset.i18nDefaultContent = element.getAttribute("content") || "";
    }
  });

  root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    if (!element.dataset.i18nDefaultAriaLabel) {
      element.dataset.i18nDefaultAriaLabel = element.getAttribute("aria-label") || "";
    }
  });

  root.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    if (!element.dataset.i18nDefaultAlt) {
      element.dataset.i18nDefaultAlt = element.getAttribute("alt") || "";
    }
  });
}

const siteI18n = {
  currentLanguage: detectInitialLanguage(),
  t(path, params = {}) {
    const raw =
      getNestedValue(translations[this.currentLanguage], path) ??
      getNestedValue(translations[fallbackLanguage], path) ??
      path;
    return typeof raw === "string" ? interpolate(raw, params) : raw;
  },
  country(name) {
    return (
      getNestedValue(translations[this.currentLanguage], `countries.${name}`) ??
      getNestedValue(translations[fallbackLanguage], `countries.${name}`) ??
      name
    );
  },
  setLanguage(language) {
    if (!translations[language]) {
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem("portfolio-language", language);
    document.documentElement.lang = language;
    this.applyTranslations();
    this.refreshLanguageSelector();
    languageListeners.forEach((listener) => listener(language));
  },
  applyTranslations(root = document) {
    storeDefaultTranslations(root);

    root.querySelectorAll("[data-i18n]").forEach((element) => {
      if (this.currentLanguage === defaultLanguage && element.dataset.i18nDefaultText) {
        element.textContent = element.dataset.i18nDefaultText;
      } else {
        element.textContent = this.t(element.dataset.i18n);
      }
    });

    root.querySelectorAll("[data-i18n-html]").forEach((element) => {
      if (this.currentLanguage === defaultLanguage && element.dataset.i18nDefaultHtml) {
        element.innerHTML = element.dataset.i18nDefaultHtml;
      } else {
        element.innerHTML = this.t(element.dataset.i18nHtml);
      }
    });

    root.querySelectorAll("[data-i18n-content]").forEach((element) => {
      if (this.currentLanguage === defaultLanguage && element.dataset.i18nDefaultContent) {
        element.setAttribute("content", element.dataset.i18nDefaultContent);
      } else {
        element.setAttribute("content", this.t(element.dataset.i18nContent));
      }
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      if (
        this.currentLanguage === defaultLanguage &&
        element.dataset.i18nDefaultAriaLabel !== undefined
      ) {
        element.setAttribute("aria-label", element.dataset.i18nDefaultAriaLabel);
      } else {
        element.setAttribute("aria-label", this.t(element.dataset.i18nAriaLabel));
      }
    });

    root.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      if (this.currentLanguage === defaultLanguage && element.dataset.i18nDefaultAlt) {
        element.setAttribute("alt", element.dataset.i18nDefaultAlt);
      } else {
        element.setAttribute("alt", this.t(element.dataset.i18nAlt));
      }
    });
  },
  refreshLanguageSelector() {
    document.querySelectorAll("[data-language-button]").forEach((button) => {
      const isActive = button.dataset.languageButton === this.currentLanguage;
      button.classList.toggle("language-switch__button--active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  },
  subscribe(listener) {
    languageListeners.push(listener);
  }
};

window.siteI18n = siteI18n;

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.lang = siteI18n.currentLanguage;
  siteI18n.applyTranslations();
  siteI18n.refreshLanguageSelector();

  document.querySelectorAll("[data-language-button]").forEach((button) => {
    button.addEventListener("click", () => {
      siteI18n.setLanguage(button.dataset.languageButton);
    });
  });
});
