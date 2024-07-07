import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { PushMessage } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class DexieDbService {
  requestLists!: Table<PushMessage, number>;
  private db: any;

  constructor() { 
    this.connect();
  }

  async connect() {
    this.db = new Dexie('888-Hardware-DB');
    this.db.version(1).stores({
      requestList: '++id',
    });
    this.requestLists = this.db.table('requestList');
  }

  addRequestList(data: PushMessage) {
    return this.requestLists.add(data);
  }

  deleteRequestList(id: number) {
    return this.requestLists.delete(id);
  }

  getRequestLists() {
    return this.requestLists.toArray();
  }

}
