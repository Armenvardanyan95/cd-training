import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Post, PostComment, User } from './types';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { GetUserByEmailPipe } from './get-user-by-email.pipe';

@Component({
  selector: 'app-post',
  template: `
    @if (postVM()) {
    <p-card
      [subheader]="
        postVM().user.name +
        ' (' +
        postVM().user.email +
        ')'
      "
    >
      <p-header>
        <div class="post-header">
          <h3>{{ post()!.title }}</h3>
          <button
            pButton
            type="button"
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-outline"
            pTooltip="Delete post"
            (click)="deletePost(post()!.id)"
            tooltipPosition="bottom"
          ></button>
        </div>
      </p-header>
      <p class="m-0">
        {{ post()!.body }}
      </p>
      <p-panel [toggleable]="true" header="Comments" [collapsed]="true">
        @for (comment of getPostComments(post()!.id); track comment.id) {
        <p class="m-0">
          <b>{{ (comment.email | getUserByEmail : users())?.name ?? 'Anonymous' }}</b> ({{
            comment.email
          }})<br />
          {{ comment.body }}
        </p>
        }
      </p-panel>
    </p-card>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, PanelModule, ButtonModule, GetUserByEmailPipe],
})
export class PostComponent {
  @Input({ required: true, alias: 'post' })
  set _post(post: Post) {
    this.post.set(post);
  }
  @Input({ required: true, alias: 'comments' }) set _comments(comments: PostComment[]) {
    this.comments.set(comments);
  };
  @Input({ required: true, alias: 'users' }) set _users(users: User[]) {
    this.users.set(users);
  };
  @Output() postDeleted = new EventEmitter<number>();

  post = signal<Post | null>(null);
  comments = signal<PostComment[]>([]);
  users = signal<User[]>([]);
  postVM = computed(() => {
    return ({
        ...this.post(),
        user: this.getUserById(this.post()!.userId),
        comments: this.getPostComments(this.post()!.id),
    });
  });

  getUserById(userId: number): User {
    const user = this.users().find((u) => u.id === userId);
    return user ? user : ({} as User);
  }

  getPostComments(postId: number): PostComment[] {
    return this.comments().filter((c) => c.postId === postId);
  }

  deletePost(postId: number): void {
    this.postDeleted.emit(postId);
  }
}
