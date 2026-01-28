import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/projects/projects';
import { ProjectItem } from '../project-item/project-item';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-projects',
  imports: [ProjectItem, MatButtonModule, MatDialogModule, MatFormField, MatLabel, FormsModule, MatInputModule, MatIcon],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  projects = signal<Project[]>([]);
  projectService = inject(ProjectService);
  createProjectErrorMassage = signal<string>('');
  newProjectName: string = '';
  dialog = inject(MatDialog);
  @ViewChild('createProjectDialog') createProjectTpl!: TemplateRef<any>;
  ngOnInit() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects.set(projects || []);
    });
  }
  createProject() { 
    const dialogRef = this.dialog.open(this.createProjectTpl, { 
      width: '250px' 
    }); 
  }
    closeCreateProjectDialog() {
    this.dialog.closeAll();
  }
  confirmCreateProject(){
    if (this.newProjectName.trim() === '') {
      this.createProjectErrorMassage.set('Project name cannot be empty.');
      return;
    }
    try {
    this.projectService.createProject({ name: this.newProjectName, description: '' }).subscribe(() => {
      this.closeCreateProjectDialog();
    });}
    catch (error) {
      this.createProjectErrorMassage.set('An error occurred while creating the project.');
    }
  }
}

