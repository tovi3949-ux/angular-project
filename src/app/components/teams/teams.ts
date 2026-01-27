import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { Team } from '../../models/team';
import { TeamsService } from '../../services/teams/teams';
import { TeamItem } from '../team-item/team-item';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [TeamItem, MatButtonModule, MatDialogModule, MatFormField, MatLabel, FormsModule, MatInputModule],
  templateUrl: './teams.html',
  styleUrls: ['./teams.css'],
})
export class Teams {
  teams = signal<Team[]>([]);
  teamService = inject(TeamsService);
  ngOnInit() {
    this.teamService.getTeams().subscribe((teams) => {
      this.teams.set(teams);
    });
  }
  @ViewChild('createTeamDialog') createTeamTpl!: TemplateRef<any>;
  @ViewChild('addMemberDialog') addMemberTpl!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);

  newMemberId: number = 0;
  newTeamName: string = '';
  createTeam() {
    console.log('Creating team...' + this.createTeamTpl);
    const dialogRef = this.dialog.open(this.createTeamTpl, {
      width: '250px'
    });
  }

  closeCreateTeamDialog() {
    this.dialog.closeAll();
  }

  confirmCreateTeam() {

    this.teamService.createTeam({ name: this.newTeamName }).subscribe(() => {
      this.closeCreateTeamDialog();
    });
  }
  addMember(teamId: number) {
    console.log('Adding member to team...' + this.addMemberTpl);
    const dialogRef = this.dialog.open(this.addMemberTpl, {
        width: '250px',
      data: { teamId: teamId }
    });
  }
  closeAddMemberDialog() {
    this.dialog.closeAll();
  }
  confirmAddMember(teamId: number) {
    if (this.newMemberId !== null) {
      this.teamService.addMember(teamId.toString(), this.newMemberId.toString()).subscribe(() => {
        this.closeAddMemberDialog();
      });
    }
  }
}