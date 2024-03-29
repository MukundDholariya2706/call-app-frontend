import { Response } from 'src/app/interface/response';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { User } from 'src/app/interface/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isSubmit: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private localstorageService: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.isSubmit = true;

    if (this.loginForm.invalid) return;

    this.authService.loginUser(this.loginForm.value as {email: string, password: string}).subscribe((res: Response) => {
      if (res.status) {
        this.localstorageService.setLocalStore('auth_token', res.data.token);
        this.localstorageService.setLocalStore('user', res.data.userData);

        this.router.navigate(['..']);
        this._snackBar.open(res.message, 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }
}
