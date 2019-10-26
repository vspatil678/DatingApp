/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpeechRecognizationService } from './speech-recognization.service';

describe('Service: SpeechRecognization', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechRecognizationService]
    });
  });

  it('should ...', inject([SpeechRecognizationService], (service: SpeechRecognizationService) => {
    expect(service).toBeTruthy();
  }));
});
