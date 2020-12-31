import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Review } from "../review.model";
import { ReviewsService } from '../reviews.service';

@Component ({
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  courseReviews: Review[] = [];
  reviewsUpdatedSub: Subscription | undefined;
  courseInfo: {id: string, subject: string, catalog_nbr: string} | undefined;

  constructor(private reviewsService: ReviewsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('courseId') && paramMap.has('subject') && paramMap.has('catalog_nbr')) {
        console.log("Course Page.")
        const data = { id: paramMap.get('courseId')!, subject: paramMap.get('subject')!, catalog_nbr: paramMap.get('catalog_nbr')!};
        if (data !== null) {
          this.courseInfo = data;
          console.log(this.courseInfo);
        }
      }
    });

    this.reviewsService.getReviews(this.courseInfo!.id);
    this.reviewsUpdatedSub = this.reviewsService.getReviewsListener()
      .subscribe((reviews: Review[]) => {
        this.reviews = reviews;
        while(this.courseReviews.length > 0) {
          this.courseReviews.pop();
        }
        this.reviews.forEach(element => {
          if (element.courseId == this.courseInfo!.id)
            this.courseReviews.push(element);
        });
      });
  }

  onAddReview(form: NgForm) {
    if (form.invalid)
      return;
    const title = form.value.title;
    const content = form.value.content;
    this.reviewsService.addReview(localStorage.getItem('username')!, title, content, this.courseInfo!.id);
  }
}
