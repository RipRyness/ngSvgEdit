import {NgModule} from '@angular/core';

import {SvgeRectComponent} from './svge-rect/svge-rect.component';

export * from './svge-rect/svge-rect.component'

@NgModule({
  imports: [SvgeRectComponent],
  exports: [SvgeRectComponent],
})
export class NgSvgEditModule {}


