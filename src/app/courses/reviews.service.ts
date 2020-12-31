import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Review } from "./review.model";

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private reviews: Review[] = [];
  private reviewsUpdated = new Subject<Review[]>();

  constructor(private http: HttpClient) {}

  addReview(author: string, title: string, content: string) {
    const review: Review = {
      id: "",
      author: author,
      title: title,
      content: content,
    };
    this.http.post<{message: string, revId: string}>('http://localhost:3000/api/review', review)
      .subscribe((responseData) => {
        console.log(responseData.message);
        review.id = responseData.revId;
        this.reviews.push(review);
        this.reviewsUpdated.next([...this.reviews]);
      });
  }

  getReviews() {
    this.http.get<{message: string, reviews: any}>('http://localhost:3000/api/review')
      .pipe( map((revData) => {
        return revData.reviews.map((rev: { _id: string; author: string; title: string; content: string; flag: boolean; }) => {
          return {
            id: rev._id,
            author: rev.author,
            title: rev.title,
            content: rev.content,
            flag: rev.flag
          }
        });
      }))
      .subscribe((modReviews) => {
        this.reviews = modReviews;
        this.reviewsUpdated.next([...this.reviews]);
      });
  }

  getReviewsListener() {
    return this.reviewsUpdated.asObservable();
  }
}
