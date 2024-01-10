import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { ChartComponent } from './chart.component';
import { DataService } from './data.service';
import { FeedComponent } from './feed.component';
import { Post } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CardModule,
    PanelModule,
    ButtonModule,
    TooltipModule,
    ChartComponent,
    FeedComponent,
  ],
  template: `
    <app-chart [posts]="posts()" [comments]="comments()" [users]="users()" />
    <app-feed [posts]="posts()" [comments]="comments()" [users]="users()" (postDeleted)="deletePost($event)" />
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly dataService = inject(DataService);
  posts = signal<Post[]>([]);
  users = toSignal(this.dataService.getUsers(), {initialValue: []});
  comments = toSignal(this.dataService.getComments(), {initialValue: []});

  ngOnInit(): void {
    this.dataService.getPosts().subscribe((posts) => {
      this.posts.set(posts);
    });
  }

  deletePost(postId: number): void {
    this.posts.set(this.posts().filter((p) => p.id !== postId));
  }
}
