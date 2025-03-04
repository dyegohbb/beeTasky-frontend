import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { ModalComponent } from './modal/modal.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    NotificationComponent,
    ModalComponent,
    LoadingSpinnerComponent,
    HeaderComponent,
    FooterComponent,
    DateFormatPipe,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class SharedModule { }
