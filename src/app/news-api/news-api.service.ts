import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '454e66fd1bb44fa4b7901db0d749a967';
  private country = 'au';

  // pagesInput is the selected page number in pagination
  pagesInput: Subject<number>; // Subject is a generic type, requires 1 type arg (number)
  // pagesOutput observable will emit article list
  pagesOutput: Observable<any>; // Observable is a generic type, requires 1 type arg (type arg from response)
  // total number of pages in pagination
  numberOfPages: Observable<number>;

  constructor() {
    this.pagesInput = new Subject();
    // by chaining .pipe(), "pagesInput" Subject will become Observable (cold and unicast)
    this.pagesOutput = this.pagesInput.pipe(
      // "page" is what is thrown into the "pagesInput" Subject
      map((page) => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', String(this.pageSize))
          .set('page', String(page));
      })
    );
  }
}
