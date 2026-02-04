/**
 * React-PDF styles for InvoicePdf
 * Mapped from Tailwind/px values in InvoicePreview for layout parity.
 * Tailwind approx: text-sm ~10–11, text-base ~12, font-semibold 600.
 * px → pt: 1px ≈ 0.75pt at 96dpi.
 */

import { StyleSheet } from '@react-pdf/renderer'

const PAD_H = 17 // px 22.79
const PAD_TOP_HEADER = 34 // pt 45.58
const PAD_BLOCK = 22 // pb 30
const GAP_20 = 15 // 20px
const GAP_40 = 30 // 40px

export const invoicePdfStyles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: PAD_H,
        paddingRight: PAD_H,
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: '#0a2540',
        flexDirection: 'column',
    },
    /** Spacer to push footer to end of page */
    pageFooterSpacer: {
        flexGrow: 1,
        minHeight: 20,
    },

    // --- Header section ---
    headerSection: {
        paddingTop: PAD_TOP_HEADER,
        paddingBottom: PAD_BLOCK,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    invoiceTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#0a2540',
        textAlign: 'right',
    },
    metaBlock: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: GAP_20,
        gap: GAP_20,
    },
    metaLabel: {
        fontSize: 8.5,
        color: '#0a2540',
        textAlign: 'right',
    },
    metaValue: {
        fontSize: 8.5,
        color: '#0a2540',
        textAlign: 'right',
    },

    // --- Address section ---
    addressSection: {
        paddingBottom: PAD_BLOCK,
    },
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: GAP_40,
    },
    billedFrom: {
        flex: 1,
        maxWidth: '33%',
    },
    billedTo: {
        flex: 1,
        maxWidth: '33%',
        textAlign: 'right',
    },
    companyName: {
        fontSize: 10,
        fontWeight: 700,
        color: '#0a2540',
        marginBottom: 6,
    },
    addressText: {
        fontSize: 8.5,
        color: '#0a2540',
        marginBottom: 2,
    },
    clientEmail: {
        fontSize: 5.7,
        color: '#0a2540',
        marginTop: 6,
    },

    // --- Items table ---
    itemsSection: {
        paddingBottom: PAD_BLOCK,
    },
    tableBorder: {
        borderWidth: 0.95,
        borderColor: '#dfe4ea',
        borderRadius: 2.8,
    },
    tableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.95,
        borderBottomColor: '#dfe4ea',
        paddingVertical: 9,
        paddingHorizontal: 6,
    },
    tableHeaderDesc: {
        flex: 1,
        fontSize: 7,
        fontWeight: 700,
        color: '#0a2540',
    },
    tableHeaderQty: {
        width: 45,
        fontSize: 7,
        fontWeight: 700,
        color: '#0a2540',
        textAlign: 'center',
    },
    tableHeaderUnit: {
        width: 75,
        fontSize: 7,
        fontWeight: 700,
        color: '#0a2540',
        textAlign: 'center',
    },
    tableHeaderVat: {
        width: 60,
        fontSize: 7,
        fontWeight: 700,
        color: '#0a2540',
        textAlign: 'center',
    },
    tableHeaderAmount: {
        width: 75,
        fontSize: 7,
        fontWeight: 700,
        color: '#0a2540',
        textAlign: 'right',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderBottomWidth: 0.95,
        borderBottomColor: '#dfe4ea',
        paddingVertical: 9,
        paddingHorizontal: 6,
    },
    tableRowLast: {
        borderBottomWidth: 0,
    },
    tableCellDesc: {
        flex: 1,
        fontSize: 7,
        color: '#0a2540',
        paddingRight: 6,
    },
    tableCellQty: {
        width: 45,
        fontSize: 7,
        color: '#0a2540',
        textAlign: 'center',
    },
    tableCellUnit: {
        width: 75,
        fontSize: 7,
        color: '#0a2540',
        textAlign: 'center',
    },
    tableCellVat: {
        width: 60,
        fontSize: 7,
        color: '#0a2540',
        textAlign: 'center',
    },
    tableCellAmount: {
        width: 75,
        fontSize: 7,
        color: '#0a2540',
        textAlign: 'right',
    },
    tableEmpty: {
        paddingVertical: 15,
        fontSize: 7,
        color: '#0a2540',
        textAlign: 'center',
    },
    footnote: {
        fontSize: 7,
        fontWeight: 700,
        color: '#0a2540',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 20,
    },

    // --- Totals ---
    totalsSection: {
        paddingBottom: PAD_BLOCK,
        marginTop: 4,
    },
    totalsBox: {
        backgroundColor: '#f9f9fa',
        borderWidth: 0.95,
        borderColor: '#dfe4ea',
        borderRadius: 2.8,
        width: 227,
        marginLeft: 'auto',
        padding: 12,
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 9,
    },
    totalsLabel: {
        fontSize: 8.5,
        color: '#0a2540',
    },
    totalsValue: {
        fontSize: 8.5,
        color: '#0a2540',
    },
    totalsDivider: {
        borderTopWidth: 0.95,
        borderTopColor: '#dfe4ea',
        marginTop: 9,
        paddingTop: 9,
    },
    totalsTotalLabel: {
        fontSize: 8.5,
        fontWeight: 700,
        color: '#0a2540',
    },
    totalsTotalValue: {
        fontSize: 8.5,
        fontWeight: 700,
        color: '#0a2540',
    },

    // --- Notes ---
    notesSection: {
        paddingBottom: PAD_BLOCK,
    },
    notesText: {
        fontSize: 8.5,
        color: '#0a2540',
        lineHeight: 1.4,
    },

    // --- Payment instructions ---
    paymentSection: {
        backgroundColor: '#f9f9fa',
        paddingVertical: 18,
        paddingHorizontal: PAD_H,
        marginTop: GAP_20,
    },
    paymentTitle: {
        fontSize: 8.5,
        fontWeight: 700,
        color: '#635bff',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    paymentContent: {
        fontSize: 8.5,
        color: '#0a2540',
        lineHeight: 1.4,
    },

    // Logo placeholder (no image in PDF without registration)
    logoPlaceholder: {
        position: 'absolute',
        left: PAD_H,
        top: PAD_TOP_HEADER,
        width: 101,
        height: 20,
        backgroundColor: '#e0e0e0',
    },
})
