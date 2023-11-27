package com.finalProject.togOther.placeReview;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finalProject.togOther.dto.PlaceReviewDTO;

@RestController
@RequestMapping("api/placeReview")
public class PlaceReviewController {

	private PlaceReviewService placeReviewService;

	public PlaceReviewController(PlaceReviewService placeReviewService) {
		this.placeReviewService = placeReviewService;
	}
	
	//리뷰 작성
	@PostMapping(path = "addPlaceReview")
	public ResponseEntity<?> addPlaceReview(@RequestBody PlaceReviewDTO placeReviewDTO) {
		
		System.out.println(placeReviewDTO);
		
		System.out.println(placeReviewDTO.getUser().getName());
		
		return placeReviewService.addPlaceReview(placeReviewDTO);
	}
		
	//리뷰 불러오기
	@GetMapping(path = "getPlaceReviewList/{placeSeq}")
	public ResponseEntity<?> getPlaceReviewByPlaceSeq(@PathVariable int placeSeq) {
		return placeReviewService.getPlaceReviewByPlaceSeq(placeSeq);
	}	

}
