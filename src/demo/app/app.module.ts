import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SvgeRectComponent } from 'ng-svg-edit';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule, SvgeRectComponent],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
