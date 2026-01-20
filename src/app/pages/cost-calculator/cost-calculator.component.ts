import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../../services/subscription.service';
import { Chart } from 'chart.js/auto';



interface PlatformUI {
  id: number;
  name: string;
  iconUrl: string;
  selected: boolean;
  price: number;
  planId?: number;
  IsDelete?: boolean;
}
interface PlanUI {
  id: number;
  name: string;
}
interface HistoryItem {
  platform: string;
  plan: string | null;
  price: number;
  currency: string;
  date: string;
  IsDelete?: boolean;
}


@Component({
  selector: 'app-cost-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cost-calculator.component.html',
  styleUrls: ['./cost-calculator.component.css'],
})
export class CostCalculatorComponent implements OnInit {

  constructor(private subscriptionService: SubscriptionService) { }

  plans: PlanUI[] = [];
  history: HistoryItem[] = [];
  chart: Chart | null = null;



  platforms: PlatformUI[] = [
    { id: 1, name: 'Netflix', iconUrl: '/platform/netflix.svg', selected: false, price: 0 },
    { id: 2, name: 'Disney+ Hotstar', iconUrl: '/platform/disneyplus.jpeg', selected: false, price: 0 },
    { id: 3, name: 'HBO Max', iconUrl: '/platform/hbomax.svg', selected: false, price: 0 },
    { id: 4, name: 'Prime Video', iconUrl: '/platform/primevideo.png', selected: false, price: 0 },
    { id: 5, name: 'Viu', iconUrl: '/platform/viu.svg', selected: false, price: 0 },
    { id: 6, name: 'iQIYI', iconUrl: '/platform/iqiyi.svg', selected: false, price: 0 },
    { id: 7, name: 'WeTV', iconUrl: '/platform/wetv.svg', selected: false, price: 0 },
    { id: 8, name: 'Apple TV+', iconUrl: '/platform/appletv.svg', selected: false, price: 0 },
    { id: 9, name: 'YouTube Premium', iconUrl: '/platform/yt_icon_red_digital.png', selected: false, price: 0 },
    { id: 10, name: 'TrueID', iconUrl: '/platform/microphone.png', selected: false, price: 0 },
    { id: 11, name: 'MONOMAX', iconUrl: '/platform/ticket.png', selected: false, price: 0 },
    { id: 12, name: 'Major Cineplex', iconUrl: '/platform/television.png', selected: false, price: 0 },
    { id: 13, name: 'SF Cinema', iconUrl: '/platform/clapperboard.png', selected: false, price: 0 }
    
  ];
  ngOnInit() {
  this.subscriptionService.getPlans().subscribe(res => {
    this.plans = res;
    this.loadHistory(); 
  });
}



  togglePlatform(p: PlatformUI) {
  p.selected = !p.selected;

  if (!p.selected) {
    this.subscriptionService.calculate({
      platformId: p.id,
      price: 0,
      currency: 'THB',
      isDelete: true
    }).subscribe(() => {
      this.loadHistory();
      this.renderChart();
    });

    p.price = 0;
    p.planId = undefined;
  }
}
deletePlatform(p: PlatformUI) {
  if (!confirm(`ลบ ${p.name} ออกจากรายการใช่ไหม?`)) return;

  this.subscriptionService.calculate({
    platformId: p.id,
    price: 0,
    currency: 'THB',
    isDelete: true
  }).subscribe(() => {
    p.selected = false;
    p.price = 0;
    p.planId = undefined;

    this.loadHistory();
    this.renderChart();
  });
}



  get selectedPlatforms() {
    return this.platforms.filter(p => p.selected);
  }

  get totalPrice() {
    return this.history.reduce(
      (sum, h) => sum + (h.price || 0),
      0
    );
  }



  get chartData() {
    return this.history.map(h => ({
      name: h.platform,
      total: h.price
    }));
  }


  get maxTotal() {
    return Math.max(...this.chartData.map(x => x.total), 1);
  }
  savePlatform(p: PlatformUI) {
  if (!p.price || p.price <= 0 || !p.planId) return;

  this.subscriptionService.calculate({
    platformId: p.id,
    planId: p.planId,
    price: Number(p.price),
    currency: 'THB'
  }).subscribe({
    next: _ => {
      console.log('saved');
      this.loadHistory(); 
      this.renderChart();
    },
    error: err => console.error(err)
  });
}


  loadHistory() {
  this.subscriptionService.getHistory().subscribe(res => {
    this.history = res;

    
    this.platforms.forEach(p => {
      const found = this.history.find(h => h.platform === p.name);
      if (found) {
        p.selected = true;
        p.price = found.price;
        const plan = this.plans.find(pl => pl.name === found.plan);
        p.planId = plan?.id;
      }
    });

    this.renderChart();
  });
}

renderChart() {
  const selected = this.selectedPlatforms;

  if (!selected.length) {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    return;
  }

  setTimeout(() => {   // ⭐ สำคัญมาก
    const canvas = document.getElementById('costChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = selected.map(p => p.name);
    const data = selected.map(p => p.price);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: '#6366f1',
          borderRadius: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#c7d2fe', font: { size: 12 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.08)' },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          }
        }
      }
    });
  });
}

}