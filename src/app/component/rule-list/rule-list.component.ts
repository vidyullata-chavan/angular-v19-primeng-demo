import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RulesAPIService } from '../../api/rules.service';
import { SharedImports } from '../../shared/imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Rule, Column, ExportColumn } from '../../model/model';
import { Table } from 'primeng/table';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { RuleSessionService } from '../../services/rule-session.service';

@Component({
  selector: 'app-rule-list',
  imports: [SharedImports],
  providers: [MessageService, ConfirmationService],
  templateUrl: './rule-list.component.html',
  styleUrl: './rule-list.component.scss',
})
export class RuleListComponent implements OnInit {
  @Input() ruleList!: Rule[];
  @ViewChild('dt') dt!: Table;
  searchTerm: string = '';
  ruleDialog: boolean = false;
  submitted: boolean = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];

  ruleItem!: Rule;
  selectedRules!: Rule[] | null;

  expandedRows = {};

  constructor(
    private service: RulesAPIService,
    private ruleSessionService: RuleSessionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRules();
  }

  onRowExpand(event: TableRowExpandEvent) {
    this.messageService.add({
      severity: 'info',
      summary: 'Product Expanded',
      detail: event.data.ruleName,
      life: 3000,
    });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    this.messageService.add({
      severity: 'success',
      summary: 'Product Collapsed',
      detail: event.data.ruleName,
      life: 3000,
    });
  }

  expandAll() {
    this.expandedRows = this.ruleList.reduce(
      (acc: { [key: string]: boolean }, p) => {
        if (p.ruleId !== undefined && p.ruleId !== null) {
          acc[p.ruleId] = true;
        }
        return acc;
      },
      {} as { [key: string]: boolean }
    );
  }

  collapseAll() {
    this.expandedRows = {};
  }

  loadRules() {
    // this.service.getAllRules().subscribe((data) => {
    //   this.ruleList = data;
    //   this.cd.markForCheck();
    // });

    this.cols = [
      { field: 'id', header: 'Rule ID', customExportHeader: 'Rule Id' },
      { field: 'name', header: 'Rule Name' },
      { field: 'isActive', header: 'Status' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  exportCSV(e: Event) {
    this.dt.exportCSV();
  }

  openNew() {
    this.ruleItem = {};
    this.submitted = false;
    this.ruleDialog = true;
  }

  editRule(rule: Rule) {
    this.ruleItem = { ...rule };
    this.ruleDialog = true;
  }

  hideDialog() {
    this.ruleDialog = false;
    this.submitted = false;
  }

  markAsDeleted(rule: Rule, trueDelete = true) {
    this.confirmationService.confirm({
      message: trueDelete ? 'Are you sure you want to mark "' + rule.ruleName + '" as deleted?' :
        'Are you sure you want to restore "' + rule.ruleName + '"?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.markRuleAsDeleted(rule, trueDelete);
      },
    });
  }

  markRuleAsDeleted(rule: Rule, trueDelete = true) {
    this.service
      .updateSelectedRule({ ...rule, isDeleted: trueDelete })
      .subscribe((data) => {
        rule.isDeleted = trueDelete;
        this.updateListPostSuccess();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Rule ${rule.isDeleted ? 'Marked as Deleted' : 'Restored'}`,
          life: 3000,
        });
      });
  }

  permanentlyDeleteRule(rule: Rule) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to permanently delete ' + rule.ruleName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.permanentlyDeleteRuleById(rule.ruleId!);
      },
    });
  }

  permanentlyDeleteRuleById(id: string) {
    this.service.permanentlyDeleteRuleById(id).subscribe((data) => {
      this.ruleList = this.ruleList.filter((val) => val.ruleId !== id);
      this.ruleItem = {};
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Rule Deleted',
        life: 3000,
      });
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.ruleList.length; i++) {
      if (this.ruleList[i].ruleId === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  getStatusClass(status: string) {
    return status ? 'success' : 'secondary';
  }

  getApprovedClass(status: string) {
    return status ? 'success' : 'warn';
  }

  saveRule() {
    this.submitted = true;
    this.ruleDialog = false;

    if (this.ruleItem.ruleName?.trim()) {
      if (this.ruleItem.ruleId) {
        this.editSelectedRule();
      } else {
        this.createNewRule();
      }
    }
  }

  getRuleById(rule: Rule) {
    this.service.getRuleById(rule.ruleId!).subscribe((data) => {
      console.log('API data for id', rule.ruleId, ':', data);
      // this.ruleItem = data;
      // this.ruleDialog = true;
      // this.cd.markForCheck();
    });
  }

  createNewRule() {
    this.service.createRule(this.ruleItem).subscribe((data) => {
      this.ruleList.push(this.ruleItem);
      this.updateListPostSuccess();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Rule Created',
        life: 3000,
      });
      this.cd.markForCheck();
    });
  }

  updateListPostSuccess() {
    this.ruleList = [...this.ruleList];
    this.ruleItem = {};
    this.ruleSessionService.loadRules();
  }

  approveRule(rule: Rule) {
    this.service
      .updateSelectedRule({ ...rule, isApproved: true })
      .subscribe((data) => {
        rule.isApproved = true;
        this.updateListPostSuccess();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `${rule.ruleName} is approved.`,
          life: 3000,
        });
      });
  }

  toggleRuleStatus(rule: Rule) {
    this.service
      .updateSelectedRule({ ...rule, isActive: !rule.isActive })
      .subscribe((data) => {
        rule.isActive = !rule.isActive;
        this.updateListPostSuccess();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: `Rule ${rule.isActive ? 'Activated' : 'Deactivated'}`,
          life: 3000,
        });
      });
  }

  toggleRuleStatusByBtn(rule: Rule) {
    this.service.updateSelectedRule({ ...rule }).subscribe((data) => {
      rule.isActive = !rule.isActive;
      this.updateListPostSuccess();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Rule ${rule.isActive ? 'Activated' : 'Deactivated'}`,
        life: 3000,
      });
    });
  }

  editSelectedRule() {
    this.service.updateSelectedRule(this.ruleItem).subscribe((data) => {
      this.ruleList[this.findIndexById(this.ruleItem.ruleId!)] = this.ruleItem;
      this.updateListPostSuccess();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Rule Updated',
        life: 3000,
      });
      this.cd.markForCheck();
    });
  }
}
