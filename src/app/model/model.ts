export interface Rule {
  ruleId?: string;
  insightId?: string;
  key?: string;
  ruleName?: string;
  description?: string;
  tags?: string[];
  version?: string;
  category?: string;
  subCategory?: string;
  conditions?: Condition[];
  actions?: RuleAction[];
  severity?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  isActive?: boolean; // status
  isApproved?: boolean;
  isDeleted?: boolean;
  group?: string;
  notes?: string;
  type?: string;
  lastUpdated?: string;
}

export interface Condition {
  id?: string;
  field?: string;
  operator?: string;
  value?: string;
}

export interface RuleAction {
  id?: string;
  type?: string;
  target?: string;
  value?: string;
}

export interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

export interface ExportColumn {
  title: string;
  dataKey: string;
}

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}
