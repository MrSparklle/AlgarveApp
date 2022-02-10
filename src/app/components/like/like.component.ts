import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss'],
})
export class LikeComponent implements OnInit {
  @Input() liked: boolean;
  @Input() id: string;
  @Input() likeCount: number;
  @Output() likeChanged = new EventEmitter<boolean>();

  private debouncer: Subject<string> = new Subject<string>();

  like() {
    this.liked = !this.liked;
    this.likeCount = this.liked ? this.likeCount + 1 : this.likeCount - 1;
    this.debouncer.next(null);
  }

  ngOnInit() {
    // com debouncer vai disparar o update no firebase somente depois de 3 segundos.
    // evita erros no app quando usuário clica freneticamente no like/dislike.
    this.debouncer.pipe(debounceTime(3000)).subscribe(() => {
      this.likeChanged.emit(this.liked);
    });
  }
}
