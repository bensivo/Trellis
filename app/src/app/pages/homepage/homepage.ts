import { Component } from '@angular/core';
import { Texteditor} from '../../components/texteditor/texteditor';

@Component({
  selector: 'app-homepage',
  imports: [
    Texteditor
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.less'
})
export class Homepage {

}
