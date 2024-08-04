import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CustomDateFormatService extends NativeDateAdapter {

  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
        return formatDate(date,'yyyy-MM-dd', this.locale);;
    } else {
        return date.toDateString();
    }
  }
}
