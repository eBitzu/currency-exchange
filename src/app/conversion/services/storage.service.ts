import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { StorageItem } from '../models/conversion.models';

@Injectable()
export class StorageService {
  get currentUser() {
    return this._currentUser;
  }
  set currentStorage(vals: StorageItem[]) {
    localStorage.setItem(this.currentUser, JSON.stringify(vals));
    this._currentStorage = vals;
  }
  get currentStorage(): StorageItem[] {
    return this._currentStorage;
  }
  constructor(private lgnSrv: LoginService) {
    this._currentUser = this.lgnSrv.currentUser;
    this.currentStorage = this.getFromLocalStorage();
  }
  private _currentStorage: StorageItem[] = [];
  private _currentUser = '';

  setToStorage(item: StorageItem) {
    const storageItems = this.getFromLocalStorage(this.currentUser);
    this.currentStorage = [...storageItems, item];
  }

  deleteItem(e: number) {
    const storageItems = this.getFromLocalStorage(this.currentUser);
    const found = storageItems.findIndex((el) => el.unixDate === e);
    if (found > -1) {
      storageItems.splice(found, 1);
      this.currentStorage = [...storageItems];
    }
  }

  private getFromLocalStorage(id = this.currentUser): StorageItem[] {
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(id)) || [];
    } catch (error) {
      // do some stuff here
      items = [];
    }
    return items;
  }
}
