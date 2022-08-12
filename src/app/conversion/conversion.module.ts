import { NgModule } from '@angular/core';

import { CurrencyComponent } from './components/currency/currency.component';
import { HistoryComponent } from './components/history/history.component';
import { ConversionComponent } from './conversion.component';
import { SharedModule } from '../shared/shared.module';
import { ConversionService } from './services/conversion.service';
import { HttpService } from '../shared/http.service';
import { StorageService } from './services/storage.service';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CurrencyComponent,
    HistoryComponent,
    ConversionComponent
  ],
  exports: [ConversionComponent, CurrencyComponent, HistoryComponent],
  providers: [ConversionService, HttpService, StorageService]
})
export class ConversionModule {}
