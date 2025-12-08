import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet,
  Font
} from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';

// Register fonts if needed (optional)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf' }, // regular
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 700 }, // bold
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 10
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 5
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
    color: '#1f2937'
  },
  table: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 30
  },
  tableCell: {
    fontSize: 9,
    color: '#374151'
  },
  headerCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151'
  },
  cellTitle: {
    width: '25%'
  },
  cellScreen: {
    width: '15%'
  },
  cellWorker: {
    width: '15%'
  },
  cellServiceType: {
    width: '15%'
  },
  cellDate: {
    width: '15%'
  },
  cellStatus: {
    width: '15%'
  },
  statusBadge: {
    fontSize: 8,
    padding: 2,
    borderRadius: 2,
    textAlign: 'center'
  },
  statusOpen: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  statusInProgress: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  statusClosed: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10
  },
  emptyState: {
    textAlign: 'center',
    padding: 20,
    color: '#9ca3af',
    fontSize: 10
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4
  },
  summaryItem: {
    width: '30%'
  },
  summaryLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 5
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937'
  }
});

// PDF Document Component for Report List
const ReportListDocument = ({ reports, formatDate, t }) => {
  const formatDateString = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return formatDate ? formatDate(dateString) : new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN':
        return [styles.statusBadge, styles.statusOpen];
      case 'IN_PROGRESS':
        return [styles.statusBadge, styles.statusInProgress];
      case 'CLOSED':
        return [styles.statusBadge, styles.statusClosed];
      default:
        return styles.statusBadge;
    }
  };

  const totalReports = reports.length;
  const openReports = reports.filter(r => r.status === 'OPEN').length;
  const closedReports = reports.filter(r => r.status === 'CLOSED').length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Worker Reports</Text>
          <Text style={styles.subtitle}>
            Generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        {/* Summary Statistics */}
        <View style={styles.section}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Reports</Text>
              <Text style={styles.summaryValue}>{totalReports}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Open Reports</Text>
              <Text style={styles.summaryValue}>{openReports}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Closed Reports</Text>
              <Text style={styles.summaryValue}>{closedReports}</Text>
            </View>
          </View>
        </View>

        {/* Reports Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Details</Text>
          {reports && reports.length > 0 ? (
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.cellTitle]}>Title</Text>
                <Text style={[styles.headerCell, styles.cellScreen]}>Screen</Text>
                <Text style={[styles.headerCell, styles.cellWorker]}>Worker</Text>
                <Text style={[styles.headerCell, styles.cellServiceType]}>Service Type</Text>
                <Text style={[styles.headerCell, styles.cellDate]}>Report Date</Text>
                <Text style={[styles.headerCell, styles.cellStatus]}>Status</Text>
              </View>
              {/* Table Rows */}
              {reports.map((report, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.cellTitle]}>
                    {report.title || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellScreen]}>
                    {report.screenName || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellWorker]}>
                    {report.assignedToWorkerName || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellServiceType]}>
                    {report.serviceTypeDisplayName || report.serviceType || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellDate]}>
                    {formatDateString(report.workerReport?.reportDate || report.workerReport?.createdAt)}
                  </Text>
                  <View style={[styles.cellStatus, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={getStatusStyle(report.status)}>
                      {report.status || 'N/A'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text>No reports found</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is an official worker reports document</Text>
          <Text render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </View>
      </Page>
    </Document>
  );
};

// Function to generate and download PDF
export const generateReportListPDF = async (reports, formatDate, t) => {
  try {
    const doc = (
      <ReportListDocument 
        reports={reports}
        formatDate={formatDate}
        t={t}
      />
    );
    
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `worker_reports_${new Date().toISOString().split('T')[0]}.pdf`;
    
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

export default ReportListDocument;







