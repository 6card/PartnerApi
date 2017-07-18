interface JQuery {
    calendar: SemanticUI.Calendar;
}
declare namespace SemanticUI {
    interface Calendar {
        settings: CalendarSettings;

        (settings?: CalendarSettings.Param): JQuery;
    }

    interface CalendarSettings extends Pick<CalendarSettings._Impl, keyof CalendarSettings._Impl> { }

    namespace CalendarSettings {
        type Param = CalendarSettings | object;
        interface _Impl {
            type: string;
            ampm: boolean;
            firstDayOfWeek: number;
            text: Array<any>;

            formatter: Calendar.FormatterSettings;

            onChange(this: JQuery, date: any, text: string, mode: string): void;
        }
    }

    namespace Calendar {
        interface FormatterSettings extends Pick<FormatterSettings._Impl, keyof FormatterSettings._Impl> { }

        namespace FormatterSettings {
            type Param = FormatterSettings | object;

            interface _Impl {

                datetime(this: JQuery, date: any): string;
            }
        }

    }

}