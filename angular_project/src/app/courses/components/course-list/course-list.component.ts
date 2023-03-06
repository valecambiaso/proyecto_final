import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Course } from '../../../models/course';
import { CourseService } from '../../services/course.service';
import { CourseFormComponent } from '../course-form/course-form.component';
import { SessionService } from '../../../core/services/session.service';
import { Session } from '../../../models/session';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent {
    dataSource!: MatTableDataSource<Course>;
    dataSource$!: Observable<MatTableDataSource<Course>>; 
    columns: string[] = ['commission','courseName','openRegistration','professorName','actions'];
    suscription!: Subscription;
    courses!: Course[];
    session$!: Observable<Session>;

    constructor(
      private dialog: MatDialog,
      private courseService: CourseService,
      private router: Router,
      private session: SessionService
    ){}

    ngOnInit(): void {
      this.dataSource = new MatTableDataSource<Course>();
      this.suscription = this.courseService.getAllCoursesObservable().subscribe((courses: Course[]) => {
        this.dataSource.data = courses;
      });
      this.dataSource$ = this.courseService.getAllCoursesObservable().pipe(map((courses) => new MatTableDataSource<Course>(courses)));
      this.session$ = this.session.getSession();
    }

    ngOnDestroy(): void {
      this.suscription.unsubscribe();
    }

    removeCourse(courseIndex: number):void{
      this.courseService.removeCourse(courseIndex);
    }

    openModalAdd():void{
      this.openModal(null);
    }

    openModalEdit(courseIndex: number):void{
      this.openModal(courseIndex);
    }

    private openModal(course: any){
      const dialogRef = this.dialog.open(CourseFormComponent, {data: course});
    }

    seeDetails(course: Course){
      this.router.navigate(['courses/details', course]);
    }
}
