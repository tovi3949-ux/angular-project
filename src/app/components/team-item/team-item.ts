import { Component, inject, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Team } from '../../models/team';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-team-item',
  imports: [MatCard, MatCardTitle, DatePipe,MatCard, MatIcon, MatCardContent, MatCardHeader],
  templateUrl: './team-item.html',
  styleUrl: './team-item.css',
})
export class TeamItem {
  team = input<Team>();
  router = inject(Router)
  chooseTeam() {
    this.router.navigate(['projects',this.team()?.id])
  }
}
