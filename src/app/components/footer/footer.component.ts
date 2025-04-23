import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  isLogin : boolean = false;


  constructor(private router:Router) {
    this.router.events.subscribe(() => {
      this.isLogin = this.router.url.includes('login')
      console.log(this.isLogin);
    })

  }

  ngOnInit() {
  }

}
