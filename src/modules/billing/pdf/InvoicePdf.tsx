/**
 * Invoice PDF document using @react-pdf/renderer.
 * Layout and typography match InvoicePreview (Tailwind) for visual parity.
 * Consumes the same InvoicePreviewData as the UI preview.
 */

import { Document, Page, Text, View, pdf } from '@react-pdf/renderer'
import { invoicePdfStyles as s } from './styles'
import type {
    InvoicePreviewData,
    InvoicePreviewItem,
} from '../types/invoice.types'

const ROWS_FIRST_PAGE = 12

function formatDate(dateString: string): string {
    try {
        return new Date(dateString).toISOString().split('T')[0]
    } catch {
        return dateString
    }
}

function formatCurrency(amount: number, symbol: string): string {
    return `${symbol}${amount.toFixed(2)}`
}

function chunk<T>(arr: Array<T>, size: number): Array<Array<T>> {
    const out: Array<Array<T>> = []
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size))
    }
    return out
}

/** Table header row (repeated on each page when paginating) */
function TableHeader() {
    return (
        <View style={s.tableHeader} wrap={false}>
            <Text style={s.tableHeaderDesc}>Description</Text>
            <Text style={s.tableHeaderQty}>Qty</Text>
            <Text style={s.tableHeaderUnit}>Unit Price</Text>
            <Text style={s.tableHeaderVat}>VAT rate</Text>
            <Text style={s.tableHeaderAmount}>Amount</Text>
        </View>
    )
}

/** Single item row; wrap={false} so the row never breaks in the middle */
function TableRow({
    item,
    symbol,
    isLast,
}: {
    item: InvoicePreviewItem
    symbol: string
    isLast: boolean
}) {
    return (
        <View
            style={isLast ? [s.tableRow, s.tableRowLast] : s.tableRow}
            wrap={false}
        >
            <Text style={s.tableCellDesc}>{item.description}</Text>
            <Text style={s.tableCellQty}>{String(item.quantity)}</Text>
            <Text style={s.tableCellUnit}>
                {formatCurrency(item.unit_price, symbol)}
            </Text>
            <Text style={s.tableCellVat}>{item.vat_rate}%</Text>
            <Text style={s.tableCellAmount}>
                {formatCurrency(item.total, symbol)}
            </Text>
        </View>
    )
}

/** Default payment instructions when none provided */
const DEFAULT_PAYMENT = `Wise USA
Account No: 8310157707
SWIFT: CMFGUS33
ACH Routing No: 084009519
Wire Routing No: 026073008
19 W 24th Street, 10010, New York, NY, United States

For any questions please contact us at accounts@clickdee.com`

export interface InvoicePdfProps {
    invoice: InvoicePreviewData
}

/**
 * Renders the invoice as a PDF document.
 * Same section order and layout as InvoicePreview; styles from styles.ts.
 */
export function InvoicePdf({ invoice }: InvoicePdfProps) {
    const symbol = invoice.currency_symbol
    const items = invoice.items ?? []
    const hasItems = items.length > 0

    const billedByName = invoice.billed_by_name ?? 'Clickdee Mediashare OÜ'
    const billedByVatId = invoice.billed_by_vat_id ?? 'EE102168578'
    const billedByRegNo = invoice.billed_by_reg_no ?? '14587434'
    const billedByAddress =
        invoice.billed_by_address ?? 'Sepapaja tn 6\n15551 Tallinn\nEstonia'
    const billedToName = invoice.billed_to_name ?? 'N/A'
    const billedToAddress = invoice.billed_to_address ?? ''
    const paymentContent = invoice.payment_instructions ?? DEFAULT_PAYMENT

    const addressFromLines = billedByAddress.split('\n').filter(Boolean)
    const addressToLines = billedToAddress
        ? billedToAddress
              .split(',')
              .map((l) => l.trim())
              .filter(Boolean)
        : []

    const itemChunks = chunk(items, ROWS_FIRST_PAGE)
    const firstChunk = itemChunks[0] ?? []
    const restChunks = itemChunks.slice(1)

    return (
        <Document>
            {/* First page: header, meta, address, table header + first rows, footnote, totals, notes, payment */}
            <Page size="A4" style={s.page}>
                {/* Header: logo placeholder + INVOICE title + meta */}
                <View style={s.headerSection}>
                    <View style={s.logoPlaceholder} />
                    <View style={s.headerRow}>
                        <Text style={s.invoiceTitle}>INVOICE</Text>
                    </View>
                    <View style={s.metaBlock}>
                        <View>
                            <Text style={s.metaLabel}>INVOICE NUMBER:</Text>
                            <Text style={s.metaLabel}>INVOICE DATE:</Text>
                            <Text style={s.metaLabel}>DUE:</Text>
                        </View>
                        <View>
                            <Text style={s.metaValue}>
                                {invoice.invoice_number || 'INV-XXXX'}
                            </Text>
                            <Text style={s.metaValue}>
                                {formatDate(invoice.invoice_date)}
                            </Text>
                            <Text style={s.metaValue}>
                                {formatDate(invoice.due_date)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Address */}
                <View style={s.addressSection}>
                    <View style={s.addressRow}>
                        <View style={s.billedFrom}>
                            <Text style={s.companyName}>{billedByName}</Text>
                            {billedByVatId ? (
                                <Text style={s.addressText}>
                                    VAT ID: {billedByVatId}
                                </Text>
                            ) : null}
                            {billedByRegNo ? (
                                <Text style={s.addressText}>
                                    Reg. no: {billedByRegNo}
                                </Text>
                            ) : null}
                            {addressFromLines.map((line, i) => (
                                <Text key={i} style={s.addressText}>
                                    {line}
                                </Text>
                            ))}
                        </View>
                        <View style={s.billedTo}>
                            <Text style={s.companyName}>{billedToName}</Text>
                            {addressToLines.map((line, i) => (
                                <Text key={i} style={s.addressText}>
                                    {line}
                                </Text>
                            ))}
                            {invoice.billed_to_email ? (
                                <Text style={s.clientEmail}>
                                    ({invoice.billed_to_email})
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </View>

                {/* Items table: border + header + first chunk of rows */}
                <View style={s.itemsSection}>
                    <View style={s.tableBorder}>
                        <TableHeader />
                        <View style={{ paddingHorizontal: 6 }}>
                            {hasItems ? (
                                firstChunk.map((item, index) => (
                                    <TableRow
                                        key={item.id ?? index}
                                        item={item}
                                        symbol={symbol}
                                        isLast={
                                            index === firstChunk.length - 1 &&
                                            restChunks.length === 0
                                        }
                                    />
                                ))
                            ) : (
                                <Text style={s.tableEmpty}>No items</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Footnote after table on first page */}
                <Text style={s.footnote}>Value-Added Tax Act § 15 s 4(1).</Text>

                {/* Spacer pushes footer (totals, notes, payment) to end of page */}
                {restChunks.length === 0 ? (
                    <View style={s.pageFooterSpacer} />
                ) : null}

                {/* Totals, notes, payment: only on first page when single page; when multi-page they go on last page */}
                {restChunks.length === 0 ? (
                    <>
                        <View style={s.totalsSection}>
                            <View style={s.totalsBox}>
                                <View style={s.totalsRow}>
                                    <Text style={s.totalsLabel}>
                                        Subtotal without taxes:
                                    </Text>
                                    <Text style={s.totalsValue}>
                                        {formatCurrency(
                                            invoice.subtotal ?? 0,
                                            symbol
                                        )}
                                    </Text>
                                </View>
                                <View style={s.totalsRow}>
                                    <Text style={s.totalsLabel}>
                                        VAT {invoice.tax_rate ?? 0}%:
                                    </Text>
                                    <Text style={s.totalsValue}>
                                        {formatCurrency(
                                            invoice.tax_amount ?? 0,
                                            symbol
                                        )}
                                    </Text>
                                </View>
                                <View style={s.totalsRow}>
                                    <Text style={s.totalsLabel}>
                                        Adjustments
                                    </Text>
                                    <Text style={s.totalsValue}>
                                        {(invoice.discount_amount ?? 0) > 0
                                            ? `-${formatCurrency(
                                                  invoice.discount_amount ?? 0,
                                                  symbol
                                              )}`
                                            : formatCurrency(0, symbol)}
                                    </Text>
                                </View>
                                <View style={[s.totalsRow, s.totalsDivider]}>
                                    <Text style={s.totalsTotalLabel}>
                                        Invoice total:
                                    </Text>
                                    <Text style={s.totalsTotalValue}>
                                        {formatCurrency(
                                            invoice.total_amount ?? 0,
                                            symbol
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {invoice.notes ? (
                            <View style={s.notesSection}>
                                <Text style={s.notesText}>{invoice.notes}</Text>
                            </View>
                        ) : null}

                        <View style={s.paymentSection}>
                            <Text style={s.paymentTitle}>
                                PAYMENT INSTRUCTIONS
                            </Text>
                            <Text style={s.paymentContent}>
                                {paymentContent}
                            </Text>
                        </View>
                    </>
                ) : null}
            </Page>

            {/* Continuation pages: table header + chunk of rows */}
            {restChunks.map((chunkRows, pageIndex) => (
                <Page key={pageIndex} size="A4" style={s.page}>
                    <View style={s.itemsSection}>
                        <View style={s.tableBorder}>
                            <TableHeader />
                            <View style={{ paddingHorizontal: 6 }}>
                                {chunkRows.map((item, index) => (
                                    <TableRow
                                        key={item.id ?? `${pageIndex}-${index}`}
                                        item={item}
                                        symbol={symbol}
                                        isLast={
                                            index === chunkRows.length - 1 &&
                                            pageIndex === restChunks.length - 1
                                        }
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* On last continuation page: footnote, spacer, totals, notes, payment */}
                    {pageIndex === restChunks.length - 1 ? (
                        <>
                            <Text style={s.footnote}>
                                Value-Added Tax Act § 15 s 4(1).
                            </Text>
                            <View style={s.pageFooterSpacer} />
                            <View style={s.totalsSection}>
                                <View style={s.totalsBox}>
                                    <View style={s.totalsRow}>
                                        <Text style={s.totalsLabel}>
                                            Subtotal without taxes:
                                        </Text>
                                        <Text style={s.totalsValue}>
                                            {formatCurrency(
                                                invoice.subtotal ?? 0,
                                                symbol
                                            )}
                                        </Text>
                                    </View>
                                    <View style={s.totalsRow}>
                                        <Text style={s.totalsLabel}>
                                            VAT {invoice.tax_rate ?? 0}%:
                                        </Text>
                                        <Text style={s.totalsValue}>
                                            {formatCurrency(
                                                invoice.tax_amount ?? 0,
                                                symbol
                                            )}
                                        </Text>
                                    </View>
                                    <View style={s.totalsRow}>
                                        <Text style={s.totalsLabel}>
                                            Adjustments
                                        </Text>
                                        <Text style={s.totalsValue}>
                                            {(invoice.discount_amount ?? 0) > 0
                                                ? `-${formatCurrency(
                                                      invoice.discount_amount ??
                                                          0,
                                                      symbol
                                                  )}`
                                                : formatCurrency(0, symbol)}
                                        </Text>
                                    </View>
                                    <View
                                        style={[s.totalsRow, s.totalsDivider]}
                                    >
                                        <Text style={s.totalsTotalLabel}>
                                            Invoice total:
                                        </Text>
                                        <Text style={s.totalsTotalValue}>
                                            {formatCurrency(
                                                invoice.total_amount ?? 0,
                                                symbol
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {invoice.notes ? (
                                <View style={s.notesSection}>
                                    <Text style={s.notesText}>
                                        {invoice.notes}
                                    </Text>
                                </View>
                            ) : null}

                            <View style={s.paymentSection}>
                                <Text style={s.paymentTitle}>
                                    PAYMENT INSTRUCTIONS
                                </Text>
                                <Text style={s.paymentContent}>
                                    {paymentContent}
                                </Text>
                            </View>
                        </>
                    ) : null}
                </Page>
            ))}
        </Document>
    )
}

/**
 * Programmatic download API: generates PDF blob from invoice data and triggers download.
 * Call from UI without depending on react-pdf layout internals.
 */
export async function downloadInvoicePdf(
    invoice: InvoicePreviewData,
    filename: string = `invoice-${invoice.invoice_number ?? 'invoice'}.pdf`
): Promise<void> {
    const blob = await pdf(<InvoicePdf invoice={invoice} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
}
