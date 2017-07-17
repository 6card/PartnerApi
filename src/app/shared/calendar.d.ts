interface JQuery {
    calendar: SemanticUI.Calendar;
}
declare namespace SemanticUI {
    interface Calendar {
        (settings?: CalendarSettings.Param): JQuery;
    }

    interface CalendarSettings extends Pick<CalendarSettings._Impl, keyof CalendarSettings._Impl> { }

    namespace CalendarSettings {
        type Param = CalendarSettings | object;
        interface _Impl {
            text: Array<any>;
        }
    }

}