import {InjectionToken} from "@angular/core";

export interface GridDateFormat {
    format: string;
}

export const AM_GRID_DATE_FORMAT =
  new InjectionToken<GridDateFormat>('am.grid.date.format');

export const AM_GRID_DATE_DEFAULT: GridDateFormat = {
  format: 'fullDate'
};
