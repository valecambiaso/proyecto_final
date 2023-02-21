import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Course } from 'src/app/models/course';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent {
  action!: string;
  courseForm!: FormGroup;
  course!: Course;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private dialogRef: MatDialogRef<CourseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public courseIndex: number
  ){
    if(this.courseIndex != null){
      this.buildFormEdit();
    }else{
      this.buildFormAdd();
    }
  }

  private buildFormEdit(): void{
    this.courseService.getCoursePromise(this.courseIndex).then((course: Course) => {
      this.course = course;

      this.action = 'Editar';

      this.courseForm = this.formBuilder.group({
        commission: [this.course.commission, [Validators.required, Validators.pattern('^[0-9]{4,6}$')]], 
        courseName: [this.course.courseName, [Validators.required, Validators.maxLength(15)]], 
        openRegistrations: [this.course.openRegistrations],
        professorName: [this.course.professorName, [Validators.required, Validators.maxLength(30)]],
      });
    });
  }

  private buildFormAdd(): void{
    this.action = 'Crear';

    this.courseForm = this.formBuilder.group({
        commission: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]], 
        courseName: ['', [Validators.required, Validators.maxLength(15)]], 
        openRegistrations: [false],
        professorName: ['', [Validators.required, Validators.maxLength(30)]],
      });
  }

  addCourse(): void{
    const course: Course = {
      commission: this.courseForm.get('commission')!.value,
      courseName: this.courseForm.get('courseName')!.value,
      openRegistrations: this.courseForm.get('openRegistrations')!.value,
      professorName: this.courseForm.get('professorName')!.value,
    };

    if(this.courseIndex != null){
      this.courseService.editCourses(course, this.courseIndex);
    }else{
      this.courseService.addNewCourse(course);
    }
    this.closeForm();
  }

  closeForm(): void{
    this.dialogRef.close();
  }
}
