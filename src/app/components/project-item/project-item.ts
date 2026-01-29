import { Component, input } from '@angular/core';
import { Project } from '../../models/project';
import { MatCard, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-project-item',
  imports: [MatCard, MatCardTitle, MatCardSubtitle, DatePipe],
  templateUrl: './project-item.html',
  styleUrl: './project-item.css',
})
export class ProjectItem {
project = input<Project>();
}
