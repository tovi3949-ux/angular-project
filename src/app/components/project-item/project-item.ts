import { Component, input } from '@angular/core';
import { Project } from '../../models/project';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
@Component({
  selector: 'app-project-item',
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardHeader, MatCardContent],
  templateUrl: './project-item.html',
  styleUrl: './project-item.css',
})
export class ProjectItem {
project = input<Project>();
}
