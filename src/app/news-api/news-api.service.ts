import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap, map, switchMap, pluck } from 'rxjs/operators';

// extracted articles from HTTP response (emitted from pluck operator)
export interface Article {
  title: string;
  url: string;
}

// raw HTTP response format (emitted from switchMap operator)
interface NewsApiResponse {
  totalResults: number;
  // articles is an array of objects
  articles: Article[];
}

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '454e66fd1bb44fa4b7901db0d749a967';
  private country = 'au';

  // pagesInput is the selected page number in pagination
  private pagesInput: Subject<number>; // Subject is a generic type, requires 1 type arg (number)
  // pagesOutput observable will emit article list
  pagesOutput: Observable<Article[]>; // Observable is a generic type, requires 1 type arg (array of Article objects)
  // total number of pages in pagination, Subject because pagesInput.pipe(tap()) need to tell it what value to emit (Observable can't do this!)
  numberOfPages: Subject<number>;

  constructor(private http: HttpClient) {
    this.numberOfPages = new Subject();
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
      }),
      // params are the results from map() operator
      switchMap((params) => {
        // .get() is a generic function, need a type arg
        return this.http.get<NewsApiResponse>(this.url, { params });
        // http.get() will return a new observable
      }),
      tap((response) => {
        const totalPages = Math.ceil(response.totalResults / this.pageSize);
        // numberOfPages is a Subject, we can pass totalPages into it by calling .next(totalPages)
        this.numberOfPages.next(totalPages);
      }),
      pluck('articles')
    );
  }

  // pagesInput Subject need a "page" passed into it from outside
  getPage(page: number) {
    this.pagesInput.next(page);
  }
}
