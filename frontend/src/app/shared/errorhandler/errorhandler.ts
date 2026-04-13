import { Component } from '@angular/core';
import { UserService } from '../../Customer/user-service';
import { SharedService } from '../shared-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-errorhandler',
  imports: [AsyncPipe],
  templateUrl: './errorhandler.html',
  styleUrl: './errorhandler.css',
})
export class Errorhandler {

  constructor(public shareServ:SharedService){}
}
