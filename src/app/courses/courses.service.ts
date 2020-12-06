import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient) {}

  getCourses() {
    this.http.get('http://localhost:3000/api/courses')
      .subscribe((courseData) => {
        console.log(courseData);
      })
  }
}
