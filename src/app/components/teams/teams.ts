import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { Team } from '../../models/team';
import { TeamsService } from '../../services/teams/teams';
import { TeamItem } from '../team-item/team-item';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [TeamItem, MatButtonModule, MatDialogModule, MatFormField, MatLabel, FormsModule, MatInputModule, MatIcon, MatError],
  templateUrl: './teams.html',
  styleUrls: ['./teams.css'],
})
export class Teams {
  teams = signal<Team[]>([]);
  teamService = inject(TeamsService);
  addMemberErrorMassage = signal<string>('');
  createTeamErrorMassage = signal<string>('');
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
    const dialogRef = this.dialog.open(this.createTeamTpl, {
      width: '250px'
    });
  }

  closeCreateTeamDialog() {
    this.dialog.closeAll();
  }

  confirmCreateTeam() {
    if (this.newTeamName.trim() === '') {
      this.createTeamErrorMassage.set('Team name cannot be empty.');
      return;
    }
    try {
    this.teamService.createTeam({ name: this.newTeamName }).subscribe(() => {
      this.closeCreateTeamDialog();
    });}
    catch (error) {
      this.createTeamErrorMassage.set('An error occurred while creating the team.');
    }

  }
  addMember(teamId: number) {
    const dialogRef = this.dialog.open(this.addMemberTpl, {
        width: '250px',
      data: { teamId: teamId }
    });
  }
  closeAddMemberDialog() {
    this.dialog.closeAll();
  }
  confirmAddMember(teamId: number) {
    if (this.newMemberId > 0) {
      try{
            this.teamService.addMember(teamId.toString(), this.newMemberId.toString()).subscribe(() => {
        this.closeAddMemberDialog();
      });  
      }
      catch (error) {
        this.addMemberErrorMassage.set('An error occurred while adding the member.');
      }

    }
    else {
      this.addMemberErrorMassage.set('User ID must be a valid number.');
    }
  }
}