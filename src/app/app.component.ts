import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { DataService } from './data.service';
import { Post, PostComment, User } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, CardModule, PanelModule, ButtonModule, TooltipModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chartEl!: ElementRef<HTMLCanvasElement>;
  private readonly dataService = inject(DataService);
  posts: Post[] = [];
  users: User[] = [];
  comments: PostComment[] = [];
  chart!: Chart;

  ngOnInit(): void {
    this.dataService.getPosts().subscribe((posts) => {
      this.posts = posts;
      this.chart.data.datasets[0].data[0] = posts.length;
      this.chart.update();
    });

    this.dataService.getUsers().subscribe((users) => {
      this.users = users;
      this.chart.data.datasets[0].data[1] = users.length;
      this.chart.update();
    });

    this.dataService.getComments().subscribe((comments) => {
      this.comments = comments;
      this.chart.data.datasets[0].data[2] = comments.length;
      this.chart.update();
    });

    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.initiateChart();
  }

  getUserById(userId: number): User {
    const user = this.users.find((u) => u.id === userId);
    return user ? user : ({} as User);
  }

  getUserByEmail(email: string): User {
    const user = this.users.find((u) => u.email === email);
    return user ? user : ({} as User);
  }

  getPostComments(postId: number): PostComment[] {
    return this.comments.filter((c) => c.postId === postId);
  }

  deletePost(postId: number): void {
    this.posts = this.posts.filter((p) => p.id !== postId);
    this.chart.data.datasets[0].data[0] = this.posts.length;
    this.chart.update();
  }

  private initiateChart(): void {
    this.chart = new Chart(this.chartEl.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Posts', 'Users', 'Comments'],
        datasets: [
          {
            label: 'Post Stats',
            data: [this.posts.length, this.users.length, this.comments.length],
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
            borderColor: ['#42A5F5', '#66BB6A', '#FFA726'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
