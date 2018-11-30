import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  constructor(public lgnServ: LoginService) { }

  @Input()
  tabIndex: number;

  @Output()
  tabChange = new EventEmitter<number>();
  ngOnInit() {
    this.tabClick(this.tabIndex);
  }

  tabClick(e: number) {
    this.tabIndex = e;
    this.tabChange.emit(this.tabIndex);
  }
}
