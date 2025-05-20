import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-on-construct',
  imports: [],
  templateUrl: './onConstruct.component.html',
})
export class OnConstructComponent implements OnInit, OnDestroy {
  @ViewChild('countdownRef', { static: true })
  countdownElement!: ElementRef<HTMLSpanElement>;
  private countdownInterval!: number;
  private confettiInterval!: number;

  launchDate = new Date();

  ngOnInit(): void {
    // Configuramos la fecha de lanzamiento a 7 días desde hoy
    this.launchDate.setDate(this.launchDate.getDate() + 7);
    this.updateCountdown();
    this.countdownInterval = window.setInterval(
      () => this.updateCountdown(),
      1000
    );
    /// Guardamos el interval del confeti
    this.confettiInterval = window.setInterval(
      () => this.launchConfetti(),
      15000
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
    clearInterval(this.confettiInterval);
  }

  updateCountdown(): void {
    const now = Date.now();
    const diff = this.launchDate.getTime() - now;
    const el = this.countdownElement.nativeElement;

    if (diff < 0) {
      el.textContent = '¡Ya estamos en línea!';
      clearInterval(this.countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    el.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;
  }

  launchConfetti(): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}
