import { Component, inject, signal, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { TeamsService } from '../../services/teams/teams';
import { TeamItem } from '../team-item/team-item';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop'; 
import { finalize } from 'rxjs/internal/operators/finalize';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [TeamItem, MatButtonModule, MatDialogModule, MatFormField, MatLabel, FormsModule, MatInputModule, MatIcon, MatError, MatProgressSpinner],
  templateUrl: './teams.html',
  styleUrls: ['./teams.css'],
})
export class Teams implements OnInit {
  teamService = inject(TeamsService);
  
  teams = toSignal(this.teamService.teams$, { initialValue: [] });
  isLoading = signal<boolean>(false);
  isCreatingTeam = signal<boolean>(false);
    private snackBar = inject(MatSnackBar);
  
  addMemberErrorMassage = signal<string>('');
  createTeamErrorMassage = signal<string>('');
  ngOnInit() {
    this.isLoading.set(true);
        this.teamService.getTeams()
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe(
          error => {
            this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
          }
        );


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
    this.isCreatingTeam.set(true);
    this.teamService.createTeam({ name: this.newTeamName })
    .pipe(finalize(() => this.isCreatingTeam.set(false)))
    .subscribe({
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
    }
    else {
      this.addMemberErrorMassage.set('User ID must be a valid number.');
    }
  }
} 