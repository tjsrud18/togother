package com.finalProject.togOther.planner;

import org.springframework.http.ResponseEntity;

import com.finalProject.togOther.dto.PlannerDTO;
import com.finalProject.togOther.dto.PlannerImageDTO;
import com.finalProject.togOther.dto.PlannerTextDTO;
import com.finalProject.togOther.dto.SubItemDTO;

public interface PlannerService {

	public ResponseEntity<Integer> addPlanner(PlannerDTO plannerDTO);

	public ResponseEntity<String> addSubItem(SubItemDTO subItemDTO);

	public ResponseEntity<String> addPlannerText(PlannerTextDTO plannerTextDTO);

	public ResponseEntity<String> addPlannerImage(PlannerImageDTO plannerImageDTO);

}