import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateParqueousuarioComponent } from './add-update-parqueousuario.component';

describe('AddUpdateParqueousuarioComponent', () => {
  let component: AddUpdateParqueousuarioComponent;
  let fixture: ComponentFixture<AddUpdateParqueousuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateParqueousuarioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateParqueousuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
