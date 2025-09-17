'use client';

import { DataTable } from "@/components/data-table";



export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            SAP Business One Data Viewer
          </h1>
          <p className="text-muted-foreground mt-2">
            View and filter journal entries with meal and benefit categorization
          </p>
        </div>
        <DataTable />
      </div>
    </div>
  );
}