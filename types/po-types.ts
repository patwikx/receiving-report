// app/purchase-order/types.ts
export interface PurchaseOrderHeader {
  docNum: number;
  status: string;
  postingDate: string;
  deliveryDate: string;
  documentDate: string;
  vendorCode: string;
  vendorName: string;
  vendorRefNo: string;
  localCurrency: string;
  remarks: string;
}

export interface PurchaseOrderLine {
  lineNum: number;
  itemServiceType: string;
  description: string;
  uom: string;
  quantity: number;
  glAccountName: string;
  taxCode: string;
  unitPrice: number;
  totalLC: number;
  mrNo: string;
}

export interface PurchaseOrder {
  header: PurchaseOrderHeader;
  lines: PurchaseOrderLine[];
}

export interface PurchaseOrderListItem {
  docNum: number;
  status: string;
  postingDate: string;
  vendorName: string;
  totalAmount: number;
  remarks: string;
}