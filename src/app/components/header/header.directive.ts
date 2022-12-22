import { Directive, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Directive({
  selector: '[appHideHeader]',
})
export class HideHeaderDirective implements OnInit {
  constructor(private el: ElementRef, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Verifique se a rota atual é a rota de login
        if (event.url === '/login') {
          this.el.nativeElement.classList.add('hide');
        } else {
          this.el.nativeElement.classList.remove('hide');
        }
      }
    });
  }
}
