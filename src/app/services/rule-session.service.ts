import { Injectable } from '@angular/core';
import { Rule } from '../model/model';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import { RulesAPIService } from '../api/rules.service';

@Injectable({
  providedIn: 'root',
})
export class RuleSessionService {
  private subject = new BehaviorSubject<Rule[]>([]);
  allRules$: Observable<Rule[]> = this.subject.asObservable();
  constructor(private service: RulesAPIService) {}

  loadRules() {
    this.service
      .getAllRules()
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map((res) => Object.values(res))
      )
      .subscribe((allRules) => this.subject.next(allRules));
  }

  getAllRules(): Observable<Rule[]> {
    return this.allRules$.pipe(
      map((rules) => rules.filter((rule) => !rule.isDeleted))
    );
  }

  getActiveApprovedRules(): Observable<Rule[]> {
    return this.allRules$.pipe(
      map((rules) => rules.filter((rule) => rule.isActive && rule.isApproved && !rule.isDeleted))
    );
  }

  getActivePendingApprovalRules(): Observable<Rule[]> {
    return this.allRules$.pipe(
      map((rules) => rules.filter((rule) => !rule.isApproved))
    );
  }

  getInactiveRules(): Observable<Rule[]> {
    return this.allRules$.pipe(
      map((rules) => rules.filter((rule) => !rule.isActive))
    );
  }

  getDeletedRules(): Observable<Rule[]> {
    return this.allRules$.pipe(
      map((rules) => rules.filter((rule) => rule.isDeleted))
    );
  }

  selectRuleById(id: string) {
    return this.allRules$.pipe(
      map((rules) => rules.find((rule) => rule.ruleId == id)),
      filter((rule) => !!rule)
    );
  }
}
