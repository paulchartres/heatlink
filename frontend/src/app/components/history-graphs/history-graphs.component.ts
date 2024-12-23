import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgIcon} from "@ng-icons/core";
import {CommonModule} from "@angular/common";
import {Color, LineChartModule, ScaleType, Series} from "@swimlane/ngx-charts";
import {TemperatureHistory} from "../../services/api/models/temperature-history";
import {HumidityHistory} from "../../services/api/models/humidity-history";
import {DateTime} from "luxon";
import {HistoryInterval} from "../../enums/history-interval";
import {MinMax} from "../../models/min-max";
import {HistoryWsService} from "../../services/ws/history/history-ws.service";
import {TranslocoDirective} from "@jsverse/transloco";
import {LocaleService} from "../../services/locale/locale.service";
import {WeatherHistory} from "../../services/api/models/weather-history";

@Component({
  selector: 'app-history-graphs',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    LineChartModule,
    TranslocoDirective
  ],
  templateUrl: './history-graphs.component.html',
  styleUrl: './history-graphs.component.scss'
})
export class HistoryGraphsComponent implements OnChanges, OnInit {

  /**
   * Temperature time series data, provided by the parent.
   */
  @Input({ required: true }) temperatureData!: TemperatureHistory[];
  /**
   * Humidity time series data, provided by the parent.
   */
  @Input({ required: true }) humidityData!: HumidityHistory[];
  /**
   * Optional external data fetched from OpenMeteo, provided by the parent.
   */
  @Input({ required: false }) externalData?: WeatherHistory[];
  /**
   * Device name, to display it in the widget title.
   */
  @Input({ required: true }) deviceName!: string;

  /**
   * Event emitter for when the history interval is changed. This allows the parent to start a new history data request.
   */
  @Output() intervalChange: EventEmitter<MinMax> = new EventEmitter<MinMax>();
  /**
   * Event emitter for when the widget should be closed. The parent uses it to remove the history widget from the DOM.
   */
  @Output() close: EventEmitter<void> = new EventEmitter();

  /**
   * Formatting function defined later in the file, used to localize dates properly in the graphs.
   */
  dateFormatFunction!: (value: Date) => string;

  /**
   * Currently selected history interval for the data.
   */
  selectedInterval: HistoryInterval = HistoryInterval.ONE_DAY;
  /**
   * Current interval for the history, in timestamps (seconds).
   */
  currentIntervalBounds!: MinMax;

  /**
   * Custom color scheme to make the graphs match the overall Heatlink aesthetic.
   * Orange is Heatzy data, blue is external data from OpenMeteo.
   */
  colorScheme: Color = {
    name: 'heatlink',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['orange', 'cornflowerblue']
  };

  /**
   * Data structure for the temperature chart. The datasets won't change, so all we need is to fill in the series.
   */
  temperatureChartData: Series[] = [
    {
      name: 'Temperature',
      series: []
    },
    {
      name: 'External temperature',
      series: []
    }
  ];

  /**
   * Data structure for the humidity chart. The datasets won't change, so all we need is to fill in the series.
   */
  humidityChartData: Series[] = [
    {
      name: 'Humidity',
      series: []
    },
    {
      name: 'External humidity',
      series: []
    }
  ];

  constructor(private _historyWs: HistoryWsService,
              public locale: LocaleService) {
    /**
     * As soon as we initialize the component, we start by defining the date format function to use in the graphs.
     * This allows for dynamic localization of the date labels.
     * @param value The date that should be displayed as a label.
     */
    this.dateFormatFunction = (value: Date): string => {
      const date: DateTime = DateTime.fromJSDate(value);
      // We create a custom date format, so that it doesn't take too much space.
      const DATE_MED_WITHOUT_YEAR = { month: "short", day: "numeric" };
      if (date.hour == 0) {
        // @ts-ignore - If the hour is exactly zero (midnight), we display the day instead.
        return date.toLocaleString(DATE_MED_WITHOUT_YEAR, { locale: this.locale.getCurrentLocale() });
      } else {
        // Else, we only display the hour.
        return date.toLocaleString(DateTime.TIME_SIMPLE, { locale: this.locale.getCurrentLocale() });
      }
    }
  }

  /**
   * Initialization function.
   * We start by calling the "onSetInterval" function, to request history data. Since the latter is requested as soon
   * as the device card is created, we need to re-fetch it when opening the widget to ensure we have the latest
   * available data.
   * We also subscribe to the history websocket, to auto-refresh data when needed.
   */
  ngOnInit() {
    this.onSetInterval(this.selectedInterval);
    this._getHistoryUpdateEvents();
  }

  /**
   * This function subscribes to the history update bus in the history websocket service. When we receive an event
   * (which is empty, just to notify the webapp that a refresh is necessary), we call the onSetInterval function with
   * our currently selected interval in order to refresh the data.
   * @private
   */
  private _getHistoryUpdateEvents(): void {
    this._historyWs.getHistoryUpdateBus().subscribe(() => {
        this.onSetInterval(this.selectedInterval);
    });
  }

  /**
   * Called when changes are detected in the @Inputs of the component.
   * This is used to ensure we do a deep copy of the new data once we receive it, else the graphs will not update.
   * @param changes The changes detected by Angular.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('temperatureData')) {
      // We need to map the values to the proper format for the graphs.
      this.temperatureChartData[0].series = this.temperatureData.map((item) => ({
        value: item.temperature,
        name: DateTime.fromSeconds(item.timestamp).toJSDate()
      }));
      // We then do a deep copy to ensure the graphs are updated.
      this.temperatureChartData = Object.assign([], this.temperatureChartData);
    }
    if (changes.hasOwnProperty('humidityData')) {
      // Same concept as above for humidity and external data.
      this.humidityChartData[0].series = this.humidityData.map((item) => ({
        value: item.humidity,
        name: DateTime.fromSeconds(item.timestamp).toJSDate()
      }));
      this.humidityChartData = Object.assign([], this.humidityChartData);
    }
    if (changes.hasOwnProperty('externalData')) {
      if (this.externalData) {
        this.temperatureChartData[1].series = this.externalData.map((item) => ({
          value: item.temperature,
          name: DateTime.fromSeconds(item.timestamp).toJSDate()
        }));
        this.temperatureChartData = Object.assign([], this.temperatureChartData);

        this.humidityChartData[1].series = this.externalData.map((item) => ({
          value: item.humidity,
          name: DateTime.fromSeconds(item.timestamp).toJSDate()
        }));
        this.humidityChartData = Object.assign([], this.humidityChartData);
      }
    }
  }

  /**
   * Called when an interval button is pressed.
   * It sets the selected interval and constructs a MinMax object with the start and end date for the history request.
   * @param interval
   */
  onSetInterval(interval: HistoryInterval): void {
    this.selectedInterval = interval;

    let minDate: DateTime = DateTime.now();

    /**
     * Good old switch/case to convert the selected interval to an actual date.
     */
    switch (interval) {
      case HistoryInterval.ALL:
        minDate = minDate.minus({ year: 10 }); // Heatzy probably didn't exist ten years ago, right?
        break;
      case HistoryInterval.ONE_YEAR:
        minDate = minDate.minus({ year: 1 });
        break;
      case HistoryInterval.SIX_MONTHS:
        minDate = minDate.minus({ month: 6 });
        break;
      case HistoryInterval.THREE_MONTHS:
        minDate = minDate.minus({ month: 3 });
        break;
      case HistoryInterval.ONE_MONTH:
        minDate = minDate.minus({ month: 1 });
        break;
      case HistoryInterval.ONE_WEEK:
        minDate = minDate.minus({ week: 1 });
        break;
      case HistoryInterval.THREE_DAYS:
        minDate = minDate.minus({ day: 3 });
        break;
      case HistoryInterval.ONE_DAY:
        minDate = minDate.minus({ day: 1 });
        break;
      case HistoryInterval.TWELVE_HOURS:
        minDate = minDate.minus({ hour: 12 });
        break;
      case HistoryInterval.SIX_HOURS:
        minDate = minDate.minus({ hour: 6 });
        break;
      case HistoryInterval.ONE_HOUR:
        minDate = minDate.minus({ hour: 1 });
        break;
    }

    const newBounds = {
      min: minDate.toSeconds(),
      max: DateTime.now().toSeconds()
    };

    this.currentIntervalBounds = newBounds;

    /**
     * We send the new history bounds to the parent so that it can request new data and update the graphs for us.
     */
    this.intervalChange.emit(newBounds);
  }

  /**
   * Helper formatting function to add the °C prefix to temperature data.
   * @param label The label the prefix should be appended to.
   */
  formatTemperature(label: string): string {
    return `${label}°C`;
  }

  /**
   * Helper formatting function to add the % prefix to humidity data.
   * @param label The label the prefix should be appended to.
   */
  formatHumidity(label: string): string {
    return `${label}%`;
  }

  /**
   * Called when the close button is clicked. Emits an event so that the parent can remove the history widget from the
   * DOM.
   */
  onCloseHistory(): void {
    this.close.emit();
  }

  protected readonly HistoryInterval = HistoryInterval;
  protected readonly DateTime = DateTime;
}
