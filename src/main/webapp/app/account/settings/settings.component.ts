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
import { Accessibility } from 'accessibility';
import * as FileSaver from 'file-saver';
import { IncomeService } from 'app/entities/income/service/income.service';
import { ExpensesService } from 'app/entities/expenses/service/expenses.service';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  isDarkModeEnabled = false;
  success = false;
  languages = LANGUAGES;

  accessibility: Accessibility | undefined;

  incomes: any[] = [];

  expenses: any[] = [];

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

    protected incomeService: IncomeService,

    protected expensesService: ExpensesService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.incomeService.getIncome().subscribe(data => {
      this.incomes = data;
    });

    this.expensesService.getExpenses().subscribe(data => {
      this.expenses = data;
    });

    var options = {
      icon: {
        useEmojis: true,
      },
    };

    this.accessibility = new Accessibility(options);
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

  toggleDarkMode() {
    this.isDarkModeEnabled = !this.isDarkModeEnabled;

    if (this.isDarkModeEnabled) {
      // @ts-ignore
      DarkReader.enable();
    } else {
      DarkReader.disable();
    }
  }

  exportToCSV() {
    const csvData = this.convertToCSV(this.incomes);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const fileName = 'income-data.csv';
    FileSaver.saveAs(blob, fileName);
  }

  exportToCSVExp() {
    const csvData = this.convertToCSV(this.expenses);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const fileName = 'expense-data.csv';
    FileSaver.saveAs(blob, fileName);
  }
  convertToCSV(data: any[]) {
    const separator = ',';
    const keys = Object.keys(data[0]);
    const csvHeader = keys.join(separator);
    const csvRows = data.map(item => {
      return keys
        .map(key => {
          return item[key];
        })
        .join(separator);
    });
    return `${csvHeader}\n${csvRows.join('\n')}`;
  }
}
