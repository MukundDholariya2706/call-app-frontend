import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Input() contacts: any[] = [];
  @Input() activeUser: any;

  constructor(
    public sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {

  }

}
