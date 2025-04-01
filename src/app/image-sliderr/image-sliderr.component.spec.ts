import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSliderrComponent } from './image-sliderr.component';

describe('ImageSliderrComponent', () => {
  let component: ImageSliderrComponent;
  let fixture: ComponentFixture<ImageSliderrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageSliderrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageSliderrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
