import React, { memo } from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFDownloadLink,
  Font
} from '@react-pdf/renderer';
import { FiDownload } from 'react-icons/fi';
import { Button } from '../../../components';

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
    fontFamily: 'Roboto'
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
    textAlign: 'center'
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
    paddingBottom: 5
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: '40%',
    fontSize: 12,
    fontWeight: 'bold'
  },
  value: {
    width: '60%',
    fontSize: 12
  },
  checklistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 12
  },
  checklistValue: {
    color: '#16a34a' // green for OK by default
  },
  signatureBox: {
    width: '30%',
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#9ca3af'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280'
  }
});

// PDF Document Component
const ReportDocument = ({ report }) => {
  if (!report) {
    return null;
  }

  const getChecklistColor = (value) => {
    if (value === 'OK') return '#16a34a'; // green
    if (value === 'N/A') return '#6b7280'; // gray
    return '#d97706'; // amber for other statuses
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Service Report</Text>
          <Text style={styles.subtitle}>
            Generated on {report.reportDate ? new Date(report.reportDate).toLocaleString() : new Date().toLocaleString()}
          </Text>
        </View>

        {/* Service Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Service Type:</Text>
            <Text style={styles.value}>{report.serviceType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Service Date:</Text>
            <Text style={styles.value}>{new Date(report.dateTime).toLocaleString()}</Text>
          </View>
        </View>

        {/* Checklist */}
        {report.checklist && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Checklist</Text>
            {Object.entries(report.checklist).map(([key, value]) => (
              <View key={key} style={styles.checklistItem}>
                <Text>{key}:</Text>
                <Text style={[styles.checklistValue, { color: getChecklistColor(value) }]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Defects & Solutions */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ width: '48%', marginRight: '4%' }}>
            <Text style={styles.sectionTitle}>Defects Found</Text>
            <Text style={{ fontSize: 12 }}>{report.defectsFound || 'No defects reported'}</Text>
          </View>
          <View style={{ width: '48%' }}>
            <Text style={styles.sectionTitle}>Solutions Provided</Text>
            <Text style={{ fontSize: 12 }}>{report.solutionsProvided || 'No solutions documented'}</Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.signatureBox}>
            <Text>Service Supervisor:</Text>
            <Text style={{ marginTop: 20 }}>{report.serviceSupervisorSignatures || 'Not signed'}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Technician:</Text>
            <Text style={{ marginTop: 20 }}>{report.technicianSignatures || 'Not signed'}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Authorized Person:</Text>
            <Text style={{ marginTop: 20 }}>{report.authorizedPersonSignatures || 'Not signed'}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is an official service report document</Text>
          <Text render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </View>
      </Page>
    </Document>
  );
};

// Export Component
const ReportPDF = memo(({ report }) => {
  if (!report || !report.id) {
    return null;
  }

  try {
    return (
      <PDFDownloadLink 
        document={<ReportDocument report={report} />} 
        fileName={`service_report_${report.id}.pdf`}
      >
        {({ loading, error }) => {
          if (error) {
            console.error('PDF generation error:', error);
            return (
              <Button
                disabled={true}
                variant="secondary"
                icon={<FiDownload />}
              >
                PDF Error
              </Button>
            );
          }
          return (
            <Button
              disabled={loading}
              variant="primary"
              icon={<FiDownload />}
            >
              {loading ? 'Preparing document...' : 'Export as PDF'}
            </Button>
          );
        }}
      </PDFDownloadLink>
    );
  } catch (error) {
    console.error('Error rendering ReportPDF:', error);
    return null;
  }
});

ReportPDF.displayName = 'ReportPDF';

export default ReportPDF;