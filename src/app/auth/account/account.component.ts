import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './account.component.html'
})
export class AccountComponent {

  onUpdatePassword(form: NgForm) {
    console.log("Updating Password.");
  }
}
