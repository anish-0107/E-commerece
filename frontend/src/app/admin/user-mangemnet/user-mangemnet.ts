import { ChangeDetectorRef, Component, DoCheck, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Adminservice } from '../adminservice';
import { User } from '../../models/user-model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-mangemnet',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-mangemnet.html',
  styleUrl: './user-mangemnet.css',
})
export class UserMangemnet implements OnInit {

  ngOnInit(): void {
    this.getallUsers()
    this.filtereditems = this.allUsers

    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(
      query => {
        console.log(query);
        this.filterData(query || '');
      }
    )
  }

  private admserv = inject(Adminservice)
  private cdr = inject(ChangeDetectorRef)

  allUsers: User[] = []
  filtereditems: User[] = []

  searchControl = new FormControl('');


  getallUsers() {
    this.admserv.getAllUser().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allUsers = data.Allusers
        this.filtereditems = data.Allusers
        this.cdr.detectChanges()
      }
    })
  }

  lockUser(id: number) {
    this.admserv.lockUser(id).subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }

  filterData(query: string) {
    if (!this.allUsers) {
      return;
    }

    const lowerQuery = query.toLowerCase();

    this.filtereditems = this.allUsers.filter(item => {
      // 2. Safety Check: If a user record is missing an email, skip it.
      return item.email?.toLowerCase().includes(lowerQuery);
    });
  }

  unlockUser(id: number) {
    this.admserv.unlockUser(id).subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }

  toggleUserLock(user: User) {
    if (user.isLocked) {
      this.unlockUser(user.id);
    } else {
      this.lockUser(user.id);
    }
  }

}
