import { Component } from '@angular/core';
import { TextEditorComponent} from '../../components/text-editor/text-editor';

@Component({
  selector: 'app-notes-page',
  imports: [
    TextEditorComponent
  ],
  templateUrl: './notes-page.html',
  styleUrl: './notes-page.less'
})
export class NotesPage {

}
