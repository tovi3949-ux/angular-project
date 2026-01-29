import { Component, inject, signal, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Team } from '../../models/team';
import { TeamsService } from '../../services/teams/teams';
import { TeamItem } from '../team-item/team-item';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop'; 

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [TeamItem, MatButtonModule, MatDialogModule, MatFormField, MatLabel, FormsModule, MatInputModule, MatIcon, MatError],
  templateUrl: './teams.html',
  styleUrls: ['./teams.css'],
})
export class Teams implements OnInit {
  teamService = inject(TeamsService);
  
  teams = toSignal(this.teamService.teams$, { initialValue: [] });

  addMemberErrorMassage = signal<string>('');
  createTeamErrorMassage = signal<string>('');
  
  ngOnInit() {
        this.teamService.getTeams().subscribe();
  }

  @ViewChild('createTeamDialog') createTeamTpl!: TemplateRef<any>;
  @ViewChild('addMemberDialog') addMemberTpl!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);

  newMemberId: number = 0;
  newTeamName: string = '';

  createTeam() {
    this.createTeamErrorMassage.set('');
    this.dialog.open(this.createTeamTpl, { width: '250px' });
  }

  closeCreateTeamDialog() {
    this.dialog.closeAll();
    this.newTeamName = ''; 
  }

  confirmCreateTeam() {
    if (this.newTeamName.trim() === '') {
      this.createTeamErrorMassage.set('Team name cannot be empty.');
      return;
    }
    
    this.teamService.createTeam({ name: this.newTeamName }).subscribe({
      next: () => {
        this.closeCreateTeamDialog();
      },
      error: () => {
        this.createTeamErrorMassage.set('An error occurred while creating the team.');
      }
    });
  }

  addMember(teamId: number) {
    this.addMemberErrorMassage.set(''); 
    this.dialog.open(this.addMemberTpl, {
        width: '250px',
        data: { teamId: teamId }
    });
  }

  closeAddMemberDialog() {
    this.dialog.closeAll();
    this.newMemberId = 0;
  }

  confirmAddMember(teamId: number) {
    if (this.newMemberId > 0) {
      this.teamService.addMember(teamId.toString(), this.newMemberId.toString()).subscribe({
        next: () => {
          this.closeAddMemberDialog();
        },
        error: () => {
          this.addMemberErrorMassage.set('An error occurred while adding the member.');
        }
      });
    } else {
      this.addMemberErrorMassage.set('User ID must be a valid number.');
    }
  }
} 