import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <main>
      <header><h1>ToDo's</h1></header>
      <form (ngSubmit)="addNote()" class="create-note">
        <input
          [(ngModel)]="newNoteTitle"
          name="title"
          placeholder="Title"
          required
        />
        <textarea
          [(ngModel)]="newNoteContent"
          name="content"
          placeholder="Add your todos here"
        ></textarea>
        <button type="submit">Add</button>
      </form>
      <div id="notes-container">
        <div *ngFor="let note of notes; let i = index" class="note">
          <h1>{{ note.title }}</h1>
          <p>{{ note.content }}</p>
          <button disabled>#{{ note.id }}</button>
        </div>
      </div>
      <footer>
        <p>Copyright © {{ currentYear }}</p>
      </footer>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  currentYear = new Date().getFullYear();
  notes: { title: string; content: string; id: number}[] = [];
  newNoteTitle = '';
  newNoteContent = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(): void {
    this.http
      .get<any[]>('https://66e57dd95cc7f9b6273d7ae1.mockapi.io/api/v1/todo/posts')
      .subscribe(
        (data) => {
          // Mapping the data received from api.
          this.notes = data.map((todo) => ({
            title: todo.title,
            content: todo.body,
            id: todo.id 
          }));
        },
        (error) => {
          console.error('There was an error!', error);
        }
      );
  }

  addNote(): void {
    if (this.newNoteTitle && this.newNoteContent) {
      const newNote = {
        title: this.newNoteTitle,
        body: this.newNoteContent,
      };

      this.http
        .post<any>('https://66e57dd95cc7f9b6273d7ae1.mockapi.io/api/v1/todo/posts', newNote)
        .subscribe(
          (data) => {
            console.log('Success sending note!')
            window.location.reload()
          },
          (error) => {
            console.error('There was an error posting the note!', error);
          }
        );
    }
  }

}
