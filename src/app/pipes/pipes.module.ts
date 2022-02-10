import { NgModule } from '@angular/core';
import { FromNowPipe } from './from-now.pipe';
import { TruncatePipe } from './truncate.pipe';
import { DateFormatPipe } from './date-format.pipe';

@NgModule({
  declarations: [FromNowPipe, TruncatePipe, DateFormatPipe],
  imports: [],
  exports: [FromNowPipe, TruncatePipe, DateFormatPipe]
})
export class PipesModule {}
