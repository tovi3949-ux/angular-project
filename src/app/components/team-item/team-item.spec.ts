import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamItem } from './team-item';

describe('TeamItem', () => {
  let component: TeamItem;
  let fixture: ComponentFixture<TeamItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
