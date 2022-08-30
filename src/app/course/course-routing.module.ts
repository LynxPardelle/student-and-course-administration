import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { CoursesComponent } from 'src/app/course/components/courses/courses.component';
import { CourseComponent } from 'src/app/course/components/course/course.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CourseComponent },
      { path: 'id/:id', component: CourseComponent },
      { path: 'list', component: CoursesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
