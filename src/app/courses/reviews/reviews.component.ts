import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { reverse } from "dns";
import { Subscription } from "rxjs";
import { Review } from "../review.model";
import { ReviewsService } from '../reviews.service';

@Component ({
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  reviewsUpdatedSub: Subscription | undefined;

  constructor(private reviewsService: ReviewsService) {}

  ngOnInit() {
    this.reviewsUpdatedSub = this.reviewsService.getReviewsListener()
      .subscribe((reviews: Review[]) => {
        this.reviews = reviews;
        console.log(this.reviews);
      });
  }

  onAddReview(form: NgForm) {
    const title = form.value.title;
    const content = form.value.content;
    this.reviewsService.addReview(localStorage.getItem('username')!, title, content);
  }
}
