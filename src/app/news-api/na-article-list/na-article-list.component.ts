import { Component, OnInit } from '@angular/core';
import { NewsApiService, Article } from './../news-api.service';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.css'],
})
export class NaArticleListComponent implements OnInit {
  // store the emitted articles list from HTTP request
  articles: Article[];

  constructor(private newsApiService: NewsApiService) {
    // .subscribe() will make "pagesOutput" Observable to emit articles list from HTTP request
    this.newsApiService.pagesOutput.subscribe((articles) => {
      // save the articles list so we can reference it from template
      this.articles = articles;
    });

    // need a page number to kick start the HTTP request
    this.newsApiService.getPage(1);
  }

  ngOnInit(): void {}
}
