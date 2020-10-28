import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '454e66fd1bb44fa4b7901db0d749a967';
  private country = 'au';

  constructor() {}
}
