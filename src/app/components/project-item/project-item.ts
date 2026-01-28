import { Component, input } from '@angular/core';
import { Project } from '../../models/project';

@Component({
  selector: 'app-project-item',
  imports: [],
  templateUrl: './project-item.html',
  styleUrl: './project-item.css',
})
export class ProjectItem {
project = input<Project>();
}
