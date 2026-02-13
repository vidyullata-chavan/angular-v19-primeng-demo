import { Component } from '@angular/core';
import { SharedImports } from '../../shared/imports';

import { RuleListComponent } from '../rule-list/rule-list.component';
import { Rule } from '../../model/model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { RuleSessionService } from '../../services/rule-session.service';

@Component({
  selector: 'app-rule-management',
  imports: [SharedImports, RuleListComponent],
  templateUrl: './rule-management.component.html',
  styleUrl: './rule-management.component.scss',
})
export class RuleManagementComponent {
  allRules$!: Observable<Rule[]>; // All rules
  approvedRules$!: Observable<Rule[]>; // isActive = true and isApproved = true
  pendingApprovalRules$!: Observable<Rule[]>; // isApproved = false and isActive = true
  inactiveRules$!: Observable<Rule[]>; // isActive = false
  deletedRules$!: Observable<Rule[]>; // Deleted. Need to include isDeleted in the model


  constructor(private ruleSessionService: RuleSessionService) {}

  ngOnInit(): void {
    // const allRules$ = this.ruleSessionService.allRules$;
    this.ruleSessionService.loadRules();
    this.allRules$ = this.ruleSessionService.getAllRules();
    this.approvedRules$ = this.ruleSessionService.getActiveApprovedRules();
    this.pendingApprovalRules$ = this.ruleSessionService.getActivePendingApprovalRules();
    this.inactiveRules$ = this.ruleSessionService.getInactiveRules();
    this.deletedRules$ = this.ruleSessionService.getDeletedRules();
  }

}
