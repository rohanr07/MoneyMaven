import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { LoginService } from '../../login/login.service';
const initialAccount: Account = {} as Account;
import * as DarkReader from 'darkreader';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  isDarkModeEnabled = false;
  success = false;
  languages = LANGUAGES;

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    langKey: new FormControl(initialAccount.langKey, { nonNullable: true }),

    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
  });

  constructor(
    private accountService: AccountService,

    private translateService: TranslateService,

    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
      }
    });
  }

  save(): void {
    this.success = false;

    const account = this.settingsForm.getRawValue();
    this.accountService.save(account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(account);

      if (account.langKey !== this.translateService.currentLang) {
        this.translateService.use(account.langKey);
      }
    });
  }
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }
  loadChangePassword() {
    this.router.navigate(['/account/password']);
  }

  increaseFontSize(): void {
    // Get the current font size of the root element
    const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);

    // Calculate the new font size
    const newSize = currentSize + 1;

    // Set the new font size on the root element
    document.documentElement.style.fontSize = newSize + 'px';
  }
  decreaseFontSize(): void {
    // Get the current font size of the root element
    const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);

    // Calculate the new font size
    const newSize = currentSize - 1;

    // Set the new font size on the root element
    document.documentElement.style.fontSize = newSize + 'px';
  }

  toggleDarkMode() {
    this.isDarkModeEnabled = !this.isDarkModeEnabled;

    if (this.isDarkModeEnabled) {
      // @ts-ignore
      DarkReader.enable();
    } else {
      DarkReader.disable();
    }
  }
}
