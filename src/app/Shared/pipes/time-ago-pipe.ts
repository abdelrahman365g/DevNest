import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const now = Date.now();
    const past = new Date(value).getTime();

    const diffInSeconds = Math.floor((now - past) / 1000);

    const days = Math.floor(diffInSeconds / 86400);
    if (days > 0) return `${days}d`;

    const hours = Math.floor(diffInSeconds / 3600);
    if (hours > 0) return `${hours}h`;

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes > 0) return `${minutes}m`;

    return `${diffInSeconds}s`;
  }

}
