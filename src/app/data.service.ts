import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Post, PostComment, User } from './types';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }

  getPosts() {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  }

  getComments() {
    return this.http.get<PostComment[]>('https://jsonplaceholder.typicode.com/comments');
  }
}
