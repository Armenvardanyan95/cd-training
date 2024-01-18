import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { GetUserByEmailPipe } from './get-user-by-email.pipe';
import { Post, PostComment, User } from './types';

@Component({
  selector: 'app-post',
  template: `
    @if (post()) {
    <p-card
      [subheader]="
        post().user.name +
        ' (' +
        post().user.email +
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
  postItem = input.required<Post>({alias: 'post'});
  comments = input.required<PostComment[]>();
  users = input.required<User[]>();
  @Output() postDeleted = new EventEmitter<number>();

  post = computed(() => {
    return ({
        ...this.postItem(),
        user: this.getUserById(this.postItem()!.userId),
        comments: this.getPostComments(this.postItem()!.id),
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
