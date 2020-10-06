import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { FantasyRoster, PlayerStatus } from '../models/fantasy-roster';

@Directive({
  selector: '[appPlayerStatus]'
})
export class PlayerStatusDirective implements OnInit {

  @Input('appPlayerStatus') player: FantasyRoster;

  domElement: any;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.domElement = this.elementRef.nativeElement;

  }
  ngOnInit(): void {
    if (this.player) {
      switch (this.player.status) {
        case PlayerStatus.Ext:
          this.renderer.addClass(this.domElement, 'text-danger');
          break;
        case PlayerStatus.Com:
          this.renderer.addClass(this.domElement, 'text-warning');
          break;
        default:
          break;
      }
    }
  }
}
