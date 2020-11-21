import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  editingState: boolean = false;
  changePass: boolean = false;

  form: FormGroup;


  constructor(private userService: UserService,
    private snack: SnackbarService) {
    this.userService.get().subscribe(r => {
      if (!r) {
        return;
      }
      this.user = r;
      this.resetform();
    });



  }


  ngOnInit(): void {


  }

  resetform() {
    this.form = new FormGroup(
      {
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        first_name: new FormControl(this.user.first_name, [Validators.required]),
        last_name: new FormControl(this.user.last_name, [Validators.required]),
        new_password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        new_password_confirm: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      }, [this.passwordConfirming]
    )
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('new_password').value !== c.get('new_password_confirm').value) {
      return { invalid: true };
    }
  }


  startEditing() {
    this.editingState = true;
  }

  cancelEditing() {
    this.resetform();
    this.editingState = false;
  }

  savechanges() {


    //open snackbar

    let updatedUser: User = new User();

    if (this.form.controls.first_name.valid && this.form.controls.first_name.touched) {
      updatedUser.first_name = this.form.controls.first_name.value;
    }

    if (this.form.controls.last_name.valid && this.form.controls.last_name.touched) {
      updatedUser.last_name = this.form.controls.last_name.value;
    }

    if (this.form.controls.email.valid && this.form.controls.email.touched) {
      updatedUser.email = this.form.controls.email.value;
    }


    if (this.changePass) {
      //also update password
      updatedUser.password = this.form.controls.new_password.value;

    } else {
      //make sure password is unset
      updatedUser.password = null;
    }

    console.log(updatedUser);

    this.userService.update(updatedUser).subscribe(r => {
      if (r) {
        this.snack.openSnackBar('Chenges saved!');

      } else {
        this.snack.openSnackBar('Error while updating');

      }
      this.editingState = false;
    });




  }




}
