import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as crypto from 'crypto';

@Injectable()
export class UtilService {
  KEY = "";
  public NODE_ENVIRONMENT = "production";
  public DB_HOST = "";
  public DB_USER = "";
  public DB_PORT = 0;
  public DB_PASSWORD = "";
  public DB_DATABASE = "";
  public CASE_BASE_DIR = "/var/www/html/ats_api/cases/";
  public UPLOAD_DIR = "/var/www/html/ats_api/uploads/";

  constructor() {
    this.NODE_ENVIRONMENT = "local";
    if (this.NODE_ENVIRONMENT == "local") {
      this.NODE_ENVIRONMENT = "local";
      this.DB_HOST = "localhost";
      this.DB_USER = "postgres";
      this.DB_PORT = 5432;
      this.DB_PASSWORD = "india@12345";
      this.DB_DATABASE = "ats";
      this.CASE_BASE_DIR = "/Applications/XAMPP/xamppfiles/htdocs/test/cases/";
      this.UPLOAD_DIR = "/Applications/XAMPP/xamppfiles/htdocs/test/uploads/";
    } 

    //production configuration file
  if (this.NODE_ENVIRONMENT == "production") {
      this.NODE_ENVIRONMENT = "production";
      this.DB_HOST = "51.20.181.155";
      this.DB_USER = "postgres";
      this.DB_PORT = 5432;
      this.DB_PASSWORD = "india@12345";
      this.DB_DATABASE = "ats";
      this.CASE_BASE_DIR = "/Applications/XAMPP/xamppfiles/htdocs/test/cases/";
      this.UPLOAD_DIR = "/Applications/XAMPP/xamppfiles/htdocs/test/uploads/";
    }
  }

  successResponse = (result: any, message = "") => {
    return {
      status: true,
      message: message,
      result: result
    };
  };

  failResponse = (message, errorMsg = "") => {
    return {
      status: false,
      message: message,
      error: errorMsg
    };
  };

  getObj = (key, value) => {
    return "`" + key + "` = '" + this.escapeChar(value) + "'";
  };

  getInsertObj = (key, value) => {
    return {
      set: key,
      value: value
    };
  };

  getDTYMDHMSDT = (dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    let dtFormat = d.getFullYear() + "-" + this.properFormatNumber(d.getMonth() + 1) + "-" + this.properFormatNumber(d.getDate()) + " " + this.properFormatNumber(d.getHours()) + ":" + this.properFormatNumber(d.getMinutes()) + ":" + this.properFormatNumber(d.getSeconds());
    return dtFormat;
  };

  getDTYMD = (dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    let dtFormat = d.getFullYear() + "-" + this.properFormatNumber(d.getMonth() + 1) + "-" + this.properFormatNumber(d.getDate());
    return dtFormat;
  };


  getDTDMY = (dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    let dtFormat = this.properFormatNumber(d.getDate()) + "-" + this.properFormatNumber(d.getMonth() + 1) + "-" + d.getFullYear();
    return dtFormat;
  };


  getDTDMY2 = (dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    let dtFormat = this.properFormatNumber(d.getDate()) + "/" + this.properFormatNumber(d.getMonth() + 1) + "/" + d.getFullYear();
    return dtFormat;
  };

  convertDT(dtstr) {
    return dtstr.split("/")[2] + "-" + this.properFormatNumber(dtstr.split("/")[1]) + "-" + this.properFormatNumber(dtstr.split("/")[0]);
  }

  getMinsAfterDT = (mins, dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    d.setMinutes(d.getMinutes() + mins);
    let dtFormat = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    return dtFormat;
  };


  getFullDateFormat = (dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    d.setMinutes(d.getMinutes() + 15);
    let dtFormat = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
    return dtFormat;
  };



  currentDateFileName = () => {
    var d = new Date();
    let dtFormat = d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds();
    return dtFormat;
  };

  convertATDT = (dateStr) => {
    var d = new Date(dateStr);
    let dtFormat = this.properFormatNumber(d.getFullYear()) + "-" + this.properFormatNumber(d.getMonth() + 1) + "-" + this.properFormatNumber(d.getDate());
    return dtFormat;
  };


  properFormatNumber = (number) => {
    let numString = "";
    if (number < 10) {
      numString = "0" + number;
    } else {
      numString = number + "";
    }
    return numString;
  };

  calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat: any = this.toRad(lat2 - lat1);
    var dLon: any = this.toRad(lon2 - lon1);
    var lat1: any = this.toRad(lat1);
    var lat2: any = this.toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  toRad(Value) {
    return Value * Math.PI / 180;
  }

  // Converts numeric degrees to radians
  checkValue(value) {
    if (value != null && value != undefined) {
      return true;
    } else {
      return false;
    }
  }

  checkNUValue(value) {
    if (value != null && value != undefined && value != "null" && value != "undefined" && value.trim() != "") {
      return true;
    } else {
      return false;
    }
  }

  secToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " m, " : " m, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  escapeChar(str) {
    if (str != null && str != undefined) {
      if (typeof str == "string") {
        str = str.replace(/'/g, "\\'");
        return str;
      } else {
        return str;
      }
    } else {
      return str;
    }
    // console.log(str);
  }

  getMomentDT = (dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    let zone = moment().format("Z");
    if (zone != "+05:30") {
      d.setMinutes(d.getMinutes() + 330);
    }
    let dtFormat = d.getFullYear() + "-" + this.properFormatNumber((d.getMonth() + 1)) + "-" + this.properFormatNumber(d.getDate()) + " " + this.properFormatNumber(d.getHours()) + ":" + this.properFormatNumber(d.getMinutes()) + ":" + this.properFormatNumber(d.getSeconds());
    return dtFormat;
  };

  getMomentDate = (dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    let zone = moment().format("Z");
    if (zone != "+05:30") {
      d.setMinutes(d.getMinutes() + 330);
    }
    let dtFormat = d.getFullYear() + "-" + this.properFormatNumber((d.getMonth() + 1)) + "-" + this.properFormatNumber(d.getDate());
    return dtFormat;
  };

  getMomentDTLog = (dt = null) => {
    var d = new Date();
    if (dt != null) {
      d = new Date(dt);
    }
    let zone = moment().format("Z");
    if (zone != "+05:30") {
      d.setMinutes(d.getMinutes() + 330);
    }
    let dtFormat = d.getFullYear() + "-" + this.properFormatNumber((d.getMonth() + 1)) + "-" + this.properFormatNumber(d.getDate()) + "-" + this.properFormatNumber(d.getHours()) + "–" + this.properFormatNumber(d.getMinutes()) + "-" + this.properFormatNumber(d.getSeconds());
    return dtFormat;
  };

  zeroPadNumber(num, places) {
    return String(num).padStart(places, "0");
  }




  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getDiffInDays(date1Str, date2Str) {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(diffTime + " milliseconds");
    // console.log(diffDays + " days");

    return diffDays;
  }

  getDiffInSec(date2Str, date1Str) {
    const date1 = new Date(date2Str);
    const date2 = new Date(date1Str);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

    // Convert milliseconds to seconds
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

    // console.log(differenceInSeconds);
    return differenceInSeconds;
  }

  cleanJSON(s) {
    if (s instanceof String) {
      s = s.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, "\\\"")
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
      s = s.replace(/[\u0000-\u0019]+/g, "");
    }

    return s;
  }

  replaceQuotes(a) {
    a = a.replace(/'/g, "");
    a = a.replace(/"/g, "");
    return a;
  }

  parseHTMLToString(HTMLPart) {
    HTMLPart
      .replace(/\n/ig, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/ig, "")
      .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/ig, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/ig, "")
      .replace(/<\/\s*(?:p|div)>/ig, "\n")
      .replace(/<br[^>]*\/?>/ig, "\n")
      .replace(/<[^>]*>/ig, "")
      .replace("&nbsp;", " ")
      .replace(/[^\S\r\n][^\S\r\n]+/ig, " ");
    return HTMLPart;
  }

 
  validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }

  base64ToString(data) {
    let bufferObj = Buffer.from(data, "base64");
    let string = bufferObj.toString("utf8");

    return string;
  }

  testJSON(text) {
    if (typeof text !== "string") {
      return false;
    }
    try {
      var json = JSON.parse(text);
      return (typeof json === "object");
    } catch (error) {
      return false;
    }
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  getDifferenceBetweenTwoDatesInDays(dateStr2, dateStr1) {
    const date1 = new Date(dateStr2);
    const date2 = new Date(dateStr1);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays + ' days');
    return diffDays;
  }
 generateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto
    .createHmac('sha256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}
  
}

