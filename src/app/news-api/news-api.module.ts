import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NaArticleListComponent } from './na-article-list/na-article-list.component';

@NgModule({
  declarations: [NaArticleListComponent],
  imports: [CommonModule],
  exports: [NaArticleListComponent],
})
export class NewsApiModule {}
