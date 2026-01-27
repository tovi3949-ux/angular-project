import { Component, signal } from '@angular/core';
import { Login } from '../login/login';
import { Register } from '../register/register';
@Component({
  selector: 'app-enter',
  imports: [Login, Register],
  templateUrl: './enter.html',
  styleUrl: './enter.css',
  standalone: true,
})
export class Enter {
  mode = signal<'login' | 'register'>('login');
  modeContent = signal<string>("don't have an account?");
  modeToogle = signal<string>('Register');
  toogleSignal() {
    if (this.mode() === 'login') {
      this.mode.set('register');
      this.modeContent.set('already have an account?');
      this.modeToogle.set('Login');
    } else {
      this.mode.set('login');
      this.modeContent.set("don't have an account?");
      this.modeToogle.set('Register');

    }
  }

}
