import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DexieDbService } from './services/dexie-db.service';
import { PushMessage } from './interfaces';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = '888-hardware';
  apiData: any[] = [];
  message = 'lol';

  messageForm = new FormGroup({
    message: new FormControl('')
  });

  count = 0;

  constructor(private http: HttpClient, private dexieDbService: DexieDbService) {
    this.http.get('https://indigo-caribou-270666.hostingersite.com/api/getNotes').subscribe((res: any) => {
      console.log("this whachu got: ", res);
      this.apiData = res.data;
    });
  }

  backgroundSync(tagName: string) {
    navigator.serviceWorker.ready
      .then((swRegistration: any) => swRegistration.sync.register(tagName))
      .catch(console.log);
  }

  postSync() {
    this.count = this.count + 1;
    this.message = `Hello from yoenuts ${this.count}`;
    this.messageForm.patchValue({
      message: this.message as string
    });

    if (this.messageForm.valid) {
      this.http.post<any>('https://indigo-caribou-270666.hostingersite.com/api/addMessage', this.messageForm.value).subscribe(
        res => {
          console.log('Data has been sent to the server congrats', res);
          if(res.code === 200) {
            this.apiData = [...this.apiData, this.messageForm.value];
          }
        }, 
        err => {
          console.log('Error occurred', err);
          const pushMessage: PushMessage = {
            message: this.message
          };
          console.log("im storing the message first: ", pushMessage)
          this.dexieDbService.addRequestList(pushMessage).then((id) => {
            console.log('Data has been stored in the database', id);
          }).then(() => this.backgroundSync('post-data')).catch(console.log);
          
        }
      );
    }


  }

  deleteSync(messageID: number) {  
    let id = messageID;
    this.http.delete<any>(`https://indigo-caribou-270666.hostingersite.com/api/deleteMessage?id=${id}`).subscribe(
      res => {
        console.log('Data has been deleted from the server ', res);
        if(res.code === 200) {
          this.apiData = this.apiData.filter(item => item.message_ID !== messageID);
        }
      }, 
      err => {
        console.log('Error occurred', err);
        this.backgroundSync('delete-data');
      }
    );
  }

  ngOnInit(): void {

  }
} 

