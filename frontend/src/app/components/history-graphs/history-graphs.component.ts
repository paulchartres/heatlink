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

  @Input({ required: true }) temperatureData!: TemperatureHistory[];
  @Input({ required: true }) humidityData!: HumidityHistory[];
  @Input({ required: false }) externalData?: WeatherHistory[];
  @Input({ required: true }) deviceName!: string;

  @Output() intervalChange: EventEmitter<MinMax> = new EventEmitter<MinMax>();
  @Output() close: EventEmitter<void> = new EventEmitter();

  dateFormatFunction!: (value: Date) => string;

  selectedInterval: HistoryInterval = HistoryInterval.ONE_DAY;
  currentIntervalBounds!: MinMax;

  colorScheme: Color = {
    name: 'heatlink',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['orange', 'cornflowerblue']
  };

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
    this.dateFormatFunction = (value: Date): string => {
      const date: DateTime = DateTime.fromJSDate(value);
      const DATE_MED_WITHOUT_YEAR = { month: "short", day: "numeric" };
      if (date.hour == 0) {
        // @ts-ignore
        return date.toLocaleString(DATE_MED_WITHOUT_YEAR, { locale: this.locale.getCurrentLocale() });
      } else {
        return date.toLocaleString(DateTime.TIME_SIMPLE, { locale: this.locale.getCurrentLocale() });
      }
    }
  }

  ngOnInit() {
    // To auto update data when we open the widget
    this.onSetInterval(this.selectedInterval);
    this._getHistoryUpdateEvents();
  }

  private _getHistoryUpdateEvents(): void {
    this._historyWs.getHistoryUpdateBus().subscribe(() => {
        this.onSetInterval(this.selectedInterval);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('temperatureData')) {
      this.temperatureChartData[0].series = this.temperatureData.map((item) => ({
        value: item.temperature,
        name: DateTime.fromSeconds(item.timestamp).toJSDate()
      }));
      this.temperatureChartData = Object.assign([], this.temperatureChartData);
    }
    if (changes.hasOwnProperty('humidityData')) {
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

  onSetInterval(interval: HistoryInterval): void {
    this.selectedInterval = interval;

    let minDate: DateTime = DateTime.now();

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

    this.intervalChange.emit(newBounds);
  }

  formatTemperature(label: string): string {
    return `${label}°C`;
  }

  formatHumidity(label: string): string {
    return `${label}%`;
  }

  onCloseHistory(): void {
    this.close.emit();
  }

  protected readonly HistoryInterval = HistoryInterval;
  protected readonly DateTime = DateTime;
}
