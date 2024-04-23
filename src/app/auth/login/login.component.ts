import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm: FormGroup = this.fb.group({
    email: [ localStorage.getItem('email') || '' , [ Validators.required, Validators.email ] ],
    password: ['', Validators.required ],
    remember: [false]
  });


  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) { }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '226032303992-ep1k6hqau01rira1mdgnipvuvp4mc6u6.apps.googleusercontent.com',
      callback:( resp: any) => this.handleLogin( resp )
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_blue',
      size: 'large',
      shaped: 'rectangle',
      with: 350
    })

  }

  handleLogin(response: any){
    this.usuarioService.loginGoogle( response.credential )
      .subscribe( resp => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/dashboard/medicos');
      })
      })
  }


  login() {
    this.usuarioService.login( this.loginForm.value )
      .subscribe( resp => {

        if ( this.loginForm.get('remember')!.value ){
          localStorage.setItem('email', this.loginForm.get('email')!.value );
        } else {
          localStorage.removeItem('email');
        }

        // Navegar al Dashboard
        this.router.navigateByUrl('/dashboard/medicos');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error' );
      });

  }


}
