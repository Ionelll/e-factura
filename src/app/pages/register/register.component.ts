import { Component } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/authentication.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private authService:AuthService){}
  registerForm=new FormGroup({
    email:new FormControl(''),
    password:new FormControl(''),
    confirmPassword:new FormControl('')
  });
  register(){
    this.authService.register(this.registerForm.getRawValue());
  }
}
