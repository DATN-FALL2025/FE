"use server";

// Mock statistic actions for demo purposes
export async function getStatistics() {
  return {
    totalStudents: 1250,
    totalDocuments: 5400,
    approvalRate: 95.5,
    pendingReviews: 23,
  };
}

export async function getAnalytics(timeRange: string) {
  return {
    views: 1234,
    clicks: 567,
    conversions: 89,
  };
}

export async function getStatisTicServices() {
  return {
    totalServices: 42,
    activeServices: 38,
    pendingServices: 4,
    revenue: 125000,
  };
}

