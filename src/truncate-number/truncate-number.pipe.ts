import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TruncateNumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }

  transformData(value: any, ...args: number[]): any {
    if (value != null && !isNaN(value)) {

      if (args != null && args[0] != null && args[0] != undefined && !isNaN(args[0])) {
        return this.toTruncFixed(value, args[0]);
      } else {
        return value;
      }

    } else {
      return value;
    }
  }

  toTruncFixed(value, n) {
    return this.toTrunc(value, n).toFixed(n);
  }

  toTrunc(value, n) {
    return Math.floor(value * Math.pow(10, n)) / (Math.pow(10, n));
  }


}

