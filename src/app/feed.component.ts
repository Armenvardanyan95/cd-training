import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { PostComponent } from './post.component';
import { Post, PostComment, User } from './types';

@Component({
  selector: 'app-feed',
  standalone: true,
  template: `
    <p-panel header="Feed">
      @for (post of posts(); track post.id) {
        <app-post [post]="post" [comments]="comments()" [users]="users()" (postDeleted)="deletePost($event)" />
      }
    </p-panel>
  `,
  imports: [PanelModule, PostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent {
  posts = input<Post[]>([]);
  users = input<User[]>([]);
  comments = input<PostComment[]>([]);
  @Output() postDeleted = new EventEmitter<number>();

  deletePost(postId: number): void {
    this.postDeleted.emit(postId);
  }
}
