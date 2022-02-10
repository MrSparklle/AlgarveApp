import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-truncated-text',
  templateUrl: './truncated-text.component.html',
  styleUrls: ['./truncated-text.component.scss'],
})
export class TruncatedTextComponent implements OnInit {
  @Input()
  text: string;
  @Input()
  limit: any = 40;

  public truncating = true;

  ngOnInit() {}
}
