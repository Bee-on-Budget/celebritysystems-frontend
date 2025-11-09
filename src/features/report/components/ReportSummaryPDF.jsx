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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    flexWrap: 'wrap'
  },
  statBox: {
    width: '30%',
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    marginBottom: 10
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 5
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
    borderBottomColor: '#e5e7eb'
  },
  tableCell: {
    fontSize: 9,
    color: '#374151'
  },
  tableCellName: {
    width: '40%',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  tableCellChanges: {
    width: '30%',
    fontSize: 9,
    textAlign: 'center',
    color: '#3b82f6',
    fontWeight: 'bold'
  },
  tableCellScreens: {
    width: '30%',
    fontSize: 9,
    textAlign: 'center',
    color: '#6b7280'
  },
  headerCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151'
  },
  headerCellName: {
    width: '40%'
  },
  headerCellChanges: {
    width: '30%',
    textAlign: 'center'
  },
  headerCellScreens: {
    width: '30%',
    textAlign: 'center'
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
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 5,
    fontSize: 9
  },
  metadataLabel: {
    width: '40%',
    fontWeight: 'bold',
    color: '#374151'
  },
  metadataValue: {
    width: '60%',
    color: '#6b7280'
  },
  emptyState: {
    textAlign: 'center',
    padding: 20,
    color: '#9ca3af',
    fontSize: 10
  }
});

// PDF Document Component for Report Summary
const ReportSummaryDocument = ({ reportData, filteredComponents, startDate, endDate, formatDate }) => {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Report Summary</Text>
          <Text style={styles.subtitle}>
            Monitoring Period: {formatDateString(reportData.startDate || startDate)} - {formatDateString(reportData.endDate || endDate)}
          </Text>
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

        {/* Metadata Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Information</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Report Type:</Text>
            <Text style={styles.metadataValue}>{reportData.reportType || 'Component Summary'}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Start Date:</Text>
            <Text style={styles.metadataValue}>{formatDateString(reportData.startDate || startDate)}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>End Date:</Text>
            <Text style={styles.metadataValue}>{formatDateString(reportData.endDate || endDate)}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Overall Total Changes:</Text>
            <Text style={styles.metadataValue}>{reportData.totalCounts?.overallTotal ?? 0}</Text>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Components</Text>
              <Text style={styles.statValue}>{reportData.componentSummaries.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Overall Total Changes</Text>
              <Text style={styles.statValue}>{reportData.totalCounts?.overallTotal ?? 0}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Active Components</Text>
              <Text style={styles.statValue}>
                {reportData.componentSummaries.filter(c => c.totalChanges > 0).length}
              </Text>
            </View>
          </View>
        </View>

        {/* Component Details Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Component Details</Text>
          {filteredComponents && filteredComponents.length > 0 ? (
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.headerCellName]}>Component Name</Text>
                <Text style={[styles.headerCell, styles.headerCellChanges]}>Total Changes</Text>
                <Text style={[styles.headerCell, styles.headerCellScreens]}>Screens Monitored</Text>
              </View>
              {/* Table Rows */}
              {filteredComponents.map((component, index) => {
                const screensMonitored = Object.keys(component.changesPerScreen || {}).length;
                return (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellName}>{component.componentName || 'N/A'}</Text>
                    <Text style={styles.tableCellChanges}>{component.totalChanges ?? 0}</Text>
                    <Text style={styles.tableCellScreens}>{screensMonitored}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text>No components found</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is an official report summary document</Text>
          <Text render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </View>
      </Page>
    </Document>
  );
};

// Function to generate and download PDF
export const generateReportSummaryPDF = async (reportData, filteredComponents, startDate, endDate, formatDate) => {
  try {
    const doc = (
      <ReportSummaryDocument 
        reportData={reportData}
        filteredComponents={filteredComponents}
        startDate={startDate}
        endDate={endDate}
        formatDate={formatDate}
      />
    );
    
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const start = (reportData.startDate || startDate || '').toString().replace(/\s+/g, '_');
    const end = (reportData.endDate || endDate || '').toString().replace(/\s+/g, '_');
    const fileName = `report_summary_${start}_${end}.pdf`;
    
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

export default ReportSummaryDocument;


