import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./Auth/login/login";
import { Navbar } from "./shared/navbar/navbar";
import { Sidebar } from "./shared/sidebar/sidebar";
import { Errorhandler } from "./shared/errorhandler/errorhandler";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Errorhandler],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
