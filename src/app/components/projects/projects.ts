import { Component, inject, input, signal, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/projects/projects';
import { ProjectItem } from '../project-item/project-item';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatMenuContent } from "@angular/material/menu";
import { finalize } from 'rxjs/internal/operators/finalize';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ProjectItem,
    MatButtonModule,
    MatDialogModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatIcon,
    ReactiveFormsModule,
    MatError,
    MatProgressSpinner
],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  isLoading = signal<boolean>(false);
  isCreating = signal<boolean>(false);
  projectService = inject(ProjectService);
  private snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  router = inject(Router);  
  teamId = input<string>('');
  projects = toSignal(this.projectService.projects$, { initialValue: [] });
  createProjectErrorMessage = signal<string>('');

  addProjectForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.maxLength(500)]),
  });

  @ViewChild('createProjectDialog') createProjectTpl!: TemplateRef<any>;

  ngOnInit() {
    this.isLoading.set(true)
    this.projectService.getProjects(this.teamId()).subscribe(
      error => {
        this.snackBar.open('An error occurred while loading projects.', 'Close', { duration: 3000 });
      }
    );
    this.isLoading.set(false)
  }

  createProject() {
    this.createProjectErrorMessage.set('');
    this.addProjectForm.reset();
    this.dialog.open(this.createProjectTpl, {
      width: '300px'
    });
  }

  closeCreateProjectDialog() {
    this.dialog.closeAll();
  }

  confirmCreateProject() {
    if (this.addProjectForm.invalid) {
      return;
    }
    this.isCreating.set(true);
    const { name, description } = this.addProjectForm.value;
    
    this.projectService.createProject({ 
      name: name || '', 
      description: description || '', 
      teamId: this.teamId()
    })
    .pipe(finalize(() => this.isCreating.set(false)))
    .subscribe({
      next: () => {
        this.closeCreateProjectDialog();
      },
      error: () => {
        this.createProjectErrorMessage.set('An error occurred while creating the project.');
      }
    });
  }
  chooseProject(project: Project) {
    this.router.navigate(['/tasks', project.id]);
  }
}