import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  private dataLocation = 'assets/data.xlsx';

  public loadDataFile() {
    return new Promise<any>(resolve => {
      const oReq = new XMLHttpRequest();
      let workBook: any;
      oReq.open('GET', this.dataLocation, true);
      oReq.responseType = 'arraybuffer';
      oReq.onload = e => {
        if (oReq.status >= 200 && oReq.status < 300) {
          const arrayBuffer = oReq.response;
          const data = new Uint8Array(arrayBuffer);
          const arr = new Array();
          for (let i = 0; i !== data.length; ++i) {
            arr[i] = String.fromCharCode(data[i]);
          }
          const bstr = arr.join('');
          workBook = XLSX.read(bstr, { type: 'binary' });

          const jsonSheetArr = this.sheetsAsJSONArr(workBook);

          resolve(jsonSheetArr);
        }
      };
      oReq.send();
    });
  }

  // the xlsx javascript library used for this purpose includes sheet names with spaces
  // in order to make iterating the array easier, I trim the sheet name before it's added
  private sheetsAsJSONArr(workbook) {
    const result = [];
    workbook.SheetNames.forEach(sheetName => {
      const sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        raw: true,
      });
      if (sheetJson.length > 0) {
        const trimmedSheetName = sheetName.replace(/\s+/g, '');
        result[trimmedSheetName] = sheetJson;
      }
    });

    return result;
  }

  // just an array of fun facts about space
  getFacts(): Observable<any[]> {
    return this.http.get<any[]>('/assets/facts.json').pipe(
      catchError((error: any) => {
        return this.handleError(error);
      }),
    );
  }

  protected handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
