import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';

// Updated interface to match the new SQL query structure
export interface JournalEntryRaw {
  "Journal Entry No.": number;
  "Posting Date": string;
  "Remarks": string;
  "G/L Account Code": string;
  "G/L Account Name": string;
  "BP Code": string | null;
  "BP Name": string | null;
  "Debit (LC)": number;
  "Credit (LC)": number;
  "Line Remarks": string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bpNameFilter = searchParams.get('bpName') || '';
    const bpCodeFilter = searchParams.get('bpCode') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const pool = await getConnection();
   
    let query = `
      SELECT
          T0."TransId" AS "Journal Entry No.",
          T0."RefDate" AS "Posting Date",
          T0."Memo" AS "Remarks",
          T1."Account" AS "G/L Account Code",
          T2."AcctName" AS "G/L Account Name",
          T1."ShortName" AS "BP Code",
          T3."CardName" AS "BP Name",
          T1."Debit" AS "Debit (LC)",
          T1."Credit" AS "Credit (LC)",
          T1."LineMemo" AS "Line Remarks"
      FROM
          "OJDT" T0
      INNER JOIN
          "JDT1" T1 ON T0."TransId" = T1."TransId"
      INNER JOIN
          "OACT" T2 ON T1."Account" = T2."AcctCode"
      LEFT JOIN
          "OCRD" T3 ON T1."ShortName" = T3."CardCode"
      WHERE
          T0."RefDate" >= '2024-01-01'
          AND (T1."LineMemo" LIKE '%MANCOM MEALS%' OR
          T1."LineMemo" LIKE '%EXECOM MEALS%' OR
          T1."LineMemo" LIKE '%EXCESS MEALS%' OR
          T1."LineMemo" LIKE '%HMO%' OR
          T1."LineMemo" LIKE '%INSURANCE%')LineMemo" LIKE '%EXECOM MEALS%' OR
          T1."LineMemo" LIKE '%EXCESS MEALS%' OR
          T1."LineMemo" LIKE '%HMO%' OR
          T1."LineMemo" LIKE '%INSURANCE%')
    `;

    // Add filters
    const conditions: string[] = [];
    
    if (bpNameFilter) {
      conditions.push(`T3."CardName" LIKE '%${bpNameFilter}%'`);
    }
    
    if (bpCodeFilter) {
      conditions.push(`T1."ShortName" LIKE '%${bpCodeFilter}%'`);
    }
    
    if (conditions.length > 0) {
      query += ` AND (${conditions.join(' OR ')})`;
    }

    // Get total count for pagination (without pagination)
    let countQuery = `
      SELECT COUNT(*) as total
      FROM
          "OJDT" T0
      INNER JOIN
          "JDT1" T1 ON T0."TransId" = T1."TransId"
      INNER JOIN
          "OACT" T2 ON T1."Account" = T2."AcctCode"
      LEFT JOIN
          "OCRD" T3 ON T1."ShortName" = T3."CardCode"
      WHERE
          T0."RefDate" >= '2025-01-01'
          AND (T1."LineMemo" LIKE '%MANCOM MEALS%' OR
          T1."LineMemo" LIKE '%EXECOM MEALS%' OR
          T1."LineMemo" LIKE '%EXCESS MEALS%' OR
          T1."LineMemo" LIKE '%HMO%' OR
          T1."LineMemo" LIKE '%INSURANCE%')
    `;
    
    if (conditions.length > 0) {
      countQuery += ` AND (${conditions.join(' OR ')})`;
    }

    const countResult = await pool.request().query(countQuery);
    const totalRecords = countResult.recordset[0].total;

    // For older SQL Server versions (like in SAP B1 8.82), use ROW_NUMBER() for pagination
    if (limit > 0) {
      query = `
        WITH PaginatedResults AS (
          SELECT
              T0."TransId" AS "Journal Entry No.",
              T0."RefDate" AS "Posting Date",
              T0."Memo" AS "Remarks",
              T1."Account" AS "G/L Account Code",
              T2."AcctName" AS "G/L Account Name",
              T1."ShortName" AS "BP Code",
              T3."CardName" AS "BP Name",
              T1."Debit" AS "Debit (LC)",
              T1."Credit" AS "Credit (LC)",
              T1."LineMemo" AS "Line Remarks",
              ROW_NUMBER() OVER (ORDER BY T0."TransId", T1."Line_ID") AS RowNum
          FROM
              "OJDT" T0
          INNER JOIN
              "JDT1" T1 ON T0."TransId" = T1."TransId"
          INNER JOIN
              "OACT" T2 ON T1."Account" = T2."AcctCode"
          LEFT JOIN
              "OCRD" T3 ON T1."ShortName" = T3."CardCode"
          WHERE
              T0."RefDate" >= '2025-01-01'
              AND (T1."LineMemo" LIKE '%MANCOM MEALS%' OR
              T1."LineMemo" LIKE '%EXECOM MEALS%' OR
              T1."LineMemo" LIKE '%EXCESS MEALS%' OR
              T1."LineMemo" LIKE '%HMO%' OR
              T1."LineMemo" LIKE '%INSURANCE%')
      `;
      
      if (conditions.length > 0) {
        query += ` AND (${conditions.join(' OR ')})`;
      }
      
      query += `
        )
        SELECT 
            "Journal Entry No.",
            "Posting Date",
            "Remarks",
            "G/L Account Code",
            "G/L Account Name",
            "BP Code",
            "BP Name",
            "Debit (LC)",
            "Credit (LC)",
            "Line Remarks"
        FROM PaginatedResults
        WHERE RowNum > ${offset} AND RowNum <= ${offset + limit}
      `;
    } else {
      // No pagination, just add ORDER BY
      query += ` ORDER BY T0."TransId", T1."Line_ID"`;
    }

    const result = await pool.request().query(query);
    const rawData: JournalEntryRaw[] = result.recordset;

    // Transform the data to match your sap.ts JournalEntry interface
    const transformedData = rawData.map(entry => ({
      transId: String(entry["Journal Entry No."]), // Convert to string to match your interface
      postingDate: entry["Posting Date"],
      remarks: entry["Remarks"] || '',
      glAccountCode: entry["G/L Account Code"],
      glAccountName: entry["G/L Account Name"],
      bpCode: entry["BP Code"] || '',
      bpName: entry["BP Name"] || 'Unknown',
      debitLC: entry["Debit (LC)"] || 0,
      creditLC: entry["Credit (LC)"] || 0,
      lineRemarks: entry["Line Remarks"] || ''
    }));

    return NextResponse.json({
      success: true,
      data: transformedData,
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
        error: 'Failed to fetch data from database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}