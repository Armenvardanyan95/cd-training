import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    OnChanges,
    OnInit,
    ViewChild,
    inject,
    input,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PanelModule } from 'primeng/panel';
import { Post, PostComment, User } from './types';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `
    <p-panel header="Statistics">
      <div class="chart-wrapper">
        <canvas #chart></canvas>
      </div>
    </p-panel>
  `,
  imports: [PanelModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnChanges, AfterViewInit, OnInit {
  @ViewChild('chart') chartEl!: ElementRef<HTMLCanvasElement>;
  posts = input<Post[]>([]);
  users = input<User[]>([]);
  comments = input<PostComment[]>([]);
  private readonly ngZone = inject(NgZone);
  chart!: Chart;

  ngOnInit(): void {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initiateChart();
    });
  }

  ngOnChanges(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.data.datasets[0].data[0] = this.posts.length;
        this.chart.data.datasets[0].data[1] = this.users.length;
        this.chart.data.datasets[0].data[2] = this.comments.length;
      }
      this.chart?.update();
    });
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
        plugins: {},
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
