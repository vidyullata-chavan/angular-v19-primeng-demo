import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/app.constants';
import { Rule } from '../model/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RulesAPIService {
  constructor(private http: HttpClient) {}

  getAllRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${API_BASE_URL}/getAllRules`);
  }

  getRuleById(id: string): Observable<Rule> {
    return this.http.get<Rule>(`${API_BASE_URL}/getRuleById?id=${id}`);
  }

  permanentlyDeleteRuleById(id: string): Observable<string> {
    return this.http.delete<string>(`${API_BASE_URL}/deleteRuleById?id=${id}`);
  }

  markRuleAsDeleted(id: string): Observable<string> {
    return this.http.delete<string>(`${API_BASE_URL}/markRuleAsDeleted?id=${id}`);
  }

  createRule(rule: Rule): Observable<Rule> {
    return this.http.post<Rule>(`${API_BASE_URL}/createNewRule`, rule);
  }

  updateSelectedRule(rule: Rule): Observable<Rule> {
    return this.http.put<Rule>(`${API_BASE_URL}/updateSelectedRule`, rule);
  }
}
