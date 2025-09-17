import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const docNum = searchParams.get('docNum');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const vendorFilter = searchParams.get('vendor') || '';
    const statusFilter = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    const pool = await getConnection();

    // If docNum is specified, return detailed PO
    if (docNum) {
      const query = `
        SELECT 
            -- Header
            H.DocNum AS [No.],
            H.DocStatus AS [Status],
            H.DocDate AS [Posting Date],
            H.DocDueDate AS [Delivery Date], 
            H.TaxDate AS [Document Date],
            H.CardCode AS [Vendor],
            H.CardName AS [Name],
            H.NumAtCard AS [Vendor Ref No],
            H.DocCur AS [Local Currency],
            H.Comments AS [Remarks],
            
            -- Line Items
            L.LineNum AS [#],
            CASE WHEN L.ItemCode IS NOT NULL THEN 'Item' ELSE 'Service' END AS [Item/Service Type],
            L.Dscription AS [Description],
            L.unitMsr AS [UoM],
            L.Quantity AS [Qty],
            L.AcctCode AS [G/L Account Name],
            L.TaxCode AS [Tax Code],
            L.Price AS [Unit Price],
            L.LineTotal AS [Total (LC)],
            L.VendorNum AS [MR No]
        FROM OPOR H
            INNER JOIN POR1 L ON H.DocEntry = L.DocEntry
        WHERE H.DocNum = ${docNum}
        ORDER BY L.LineNum
      `;

      const result = await pool.request().query(query);
      const rawData = result.recordset;

      if (rawData.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Purchase Order not found'
        }, { status: 404 });
      }

      // Group data by header and lines
      const firstRow = rawData[0];
      const header: PurchaseOrderHeader = {
        docNum: firstRow['No.'],
        status: firstRow['Status'],
        postingDate: firstRow['Posting Date'],
        deliveryDate: firstRow['Delivery Date'],
        documentDate: firstRow['Document Date'],
        vendorCode: firstRow['Vendor'],
        vendorName: firstRow['Name'],
        vendorRefNo: firstRow['Vendor Ref No'] || '',
        localCurrency: firstRow['Local Currency'],
        remarks: firstRow['Remarks'] || ''
      };

      const lines: PurchaseOrderLine[] = rawData.map(row => ({
        lineNum: row['#'],
        itemServiceType: row['Item/Service Type'],
        description: row['Description'],
        uom: row['UoM'] || '',
        quantity: row['Qty'] || 0,
        glAccountName: row['G/L Account Name'] || '',
        taxCode: row['Tax Code'] || '',
        unitPrice: row['Unit Price'] || 0,
        totalLC: row['Total (LC)'] || 0,
        mrNo: row['MR No'] || ''
      }));

      const purchaseOrder: PurchaseOrder = {
        header,
        lines
      };

      return NextResponse.json({
        success: true,
        data: purchaseOrder
      });
    }

    // Otherwise, return list of POs with pagination
    let listQuery = `
      SELECT 
          H.DocNum,
          H.DocStatus,
          H.DocDate,
          H.CardName,
          H.DocTotal,
          H.Comments
      FROM OPOR H
      WHERE 1=1
    `;

    const conditions: string[] = [];
    
    if (vendorFilter) {
      conditions.push(`H.CardName LIKE '%${vendorFilter}%'`);
    }
    
    if (statusFilter) {
      conditions.push(`H.DocStatus = '${statusFilter}'`);
    }
    
    if (conditions.length > 0) {
      listQuery += ` AND (${conditions.join(' AND ')})`;
    }

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM OPOR H
      WHERE 1=1
    `;
    
    if (conditions.length > 0) {
      countQuery += ` AND (${conditions.join(' AND ')})`;
    }

    const countResult = await pool.request().query(countQuery);
    const totalRecords = countResult.recordset[0].total;

    // Add pagination using ROW_NUMBER()
    if (limit > 0) {
      listQuery = `
        WITH PaginatedResults AS (
          SELECT 
              H.DocNum,
              H.DocStatus,
              H.DocDate,
              H.CardName,
              H.DocTotal,
              H.Comments,
              ROW_NUMBER() OVER (ORDER BY H.DocNum DESC) AS RowNum
          FROM OPOR H
          WHERE 1=1
          ${conditions.length > 0 ? ` AND (${conditions.join(' AND ')})` : ''}
        )
        SELECT 
            DocNum,
            DocStatus,
            DocDate,
            CardName,
            DocTotal,
            Comments
        FROM PaginatedResults
        WHERE RowNum > ${offset} AND RowNum <= ${offset + limit}
      `;
    } else {
      listQuery += ` ORDER BY H.DocNum DESC`;
    }

    const listResult = await pool.request().query(listQuery);
    const purchaseOrders: PurchaseOrderListItem[] = listResult.recordset.map(row => ({
      docNum: row.DocNum,
      status: row.DocStatus,
      postingDate: row.DocDate,
      vendorName: row.CardName,
      totalAmount: row.DocTotal || 0,
      remarks: row.Comments || ''
    }));

    return NextResponse.json({
      success: true,
      data: purchaseOrders,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasNextPage: page < Math.ceil(totalRecords / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch purchase order data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}