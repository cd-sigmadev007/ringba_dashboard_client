/**
 * Invoice Preview Component
 * Live preview of invoice with flow-based layout to prevent overlap
 */

import React from 'react'
import type { InvoiceItem } from '../types'
import { LightLogo } from '@/assets/svg'

interface InvoicePreviewProps {
    invoice: {
        invoice_number: string
        invoice_date: string
        due_date: string
        billed_by_name?: string
        billed_by_email?: string
        billed_by_address?: string
        billed_by_vat_id?: string
        billed_by_reg_no?: string
        billed_to_name?: string
        billed_to_email?: string
        billed_to_address?: string
        currency_symbol: string
        subtotal: number
        tax_rate: number
        tax_amount: number
        discount_rate: number
        discount_amount: number
        total_amount: number
        payment_instructions?: string | null
        notes?: string | null
        items?: Array<InvoiceItem>
    }
    pdfRef?: React.RefObject<HTMLDivElement | null>
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, pdfRef }) => {
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toISOString().split('T')[0]
        } catch {
            return dateString
        }
    }

    const formatCurrency = (amount: number) => {
        return `${invoice.currency_symbol}${amount.toFixed(2)}`
    }

    return (
        <div className="bg-[#071b2f] border border-[#002b57] border-solid box-border flex items-start justify-center p-[24px] relative rounded-bl-[10px] rounded-br-[10px] w-fit">
            <div 
                ref={pdfRef}
                className="bg-white relative shrink-0 w-[565px] min-h-[799px]"
                id="invoice-preview-content"
            >
                {/* Header Section */}
                <div className="relative px-[22.79px] pt-[45.58px] pb-[30px]">
                    {/* Logo - Top Left */}
                    <div className="absolute h-[26.588px] left-[23.73px] top-[45.58px] w-[134.84px]">
                        <LightLogo />
                    </div>

                    {/* INVOICE Title - Top Right */}
                    <div className="flex justify-end">
                        <p
                            className="font-['Roboto',sans-serif] font-bold leading-[normal] text-[#0a2540] text-[18.992px] text-right"
                            style={{ fontVariationSettings: "'wdth' 100" }}
                        >
                            INVOICE
                        </p>
                    </div>

                    {/* Invoice Details - Right aligned */}
                    <div className="flex justify-end mt-[20px] gap-[20px]">
                        <div className="font-['Inter',sans-serif] font-normal leading-[normal] text-[#0a2540] text-[11.395px] text-right">
                            <p className="mb-0">INVOICE NUMBER:</p>
                            <p className="mb-0">INVOICE DATE:</p>
                            <p>DUE:</p>
                        </div>
                        <div className="font-['Inter',sans-serif] font-normal leading-[normal] text-[#0a2540] text-[11.395px] text-right">
                            <p className="mb-0">{invoice.invoice_number}</p>
                            <p className="mb-0">
                                {formatDate(invoice.invoice_date)}
                            </p>
                            <p>{formatDate(invoice.due_date)}</p>
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="relative px-[22.79px] pb-[30px]">
                    <div className="flex justify-between items-start gap-[40px]">
                        {/* Billed From - Left */}
                        <div className="flex-1 max-w-[33%]">
                            <div className="font-['Inter',sans-serif] font-bold leading-[normal] text-[#0a2540] text-[13.294px] mb-[8px]">
                                {invoice.billed_by_name ||
                                    'Clickdee Mediashare OÜ'}
                            </div>
                            <div className="font-['Inter',sans-serif] font-normal leading-[normal] text-[#0a2540] text-[11.395px] break-words">
                                {invoice.billed_by_vat_id && (
                                    <p className="mb-0">
                                        VAT ID: {invoice.billed_by_vat_id}{' '}
                                    </p>
                                )}
                                {invoice.billed_by_reg_no && (
                                    <p className="mb-0">
                                        Reg. no: {invoice.billed_by_reg_no}{' '}
                                    </p>
                                )}
                                {invoice.billed_by_address ? (
                                    invoice.billed_by_address
                                        .split('\n')
                                        .map((line, i) => (
                                            <p
                                                key={i}
                                                className="mb-0 break-words"
                                            >
                                                {line}
                                            </p>
                                        ))
                                ) : (
                                    <>
                                        <p className="mb-0">Sepapaja tn 6 </p>
                                        <p className="mb-0">15551 Tallinn</p>
                                        <p>Estonia</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Billed To - Right */}
                        <div className="flex-1 max-w-[33%] text-right">
                            <div className="font-['Inter',sans-serif] font-bold leading-[normal] text-[#0a2540] text-[13.294px] mb-[8px]">
                                {invoice.billed_to_name || 'N/A'}
                            </div>
                            {invoice.billed_to_address && (
                                <div className="font-['Inter',sans-serif] font-normal leading-[normal] text-[#0a2540] text-[11.395px] break-words">
                                    {invoice.billed_to_address
                                        .split(',')
                                        .map((line, i) => (
                                            <p
                                                key={i}
                                                className="mb-0 break-words"
                                            >
                                                {line.trim()}
                                            </p>
                                        ))}
                                </div>
                            )}
                            {invoice.billed_to_email && (
                                <div className="font-['Inter',sans-serif] font-normal leading-[normal] text-[#0a2540] text-[7.597px] break-words mt-[8px]">
                                    <p className="mb-0 break-words">
                                        ({invoice.billed_to_email})
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Table Section */}
                <div className="relative px-[22.79px] pb-[30px]">
                    {/* Table Border */}
                    <div className="border-[#dfe4ea] border-[0.95px] border-solid rounded-[2.849px] w-full">
                        {/* Table Headers */}
                        <div className="flex items-center border-b border-[#dfe4ea] py-[12px] px-[8px]">
                            <div className="font-['Inter',sans-serif] font-bold leading-none text-[#0a2540] text-[9.496px] flex-1">
                                Description
                            </div>
                            <div className="font-['Inter',sans-serif] font-bold leading-none text-[#0a2540] text-[9.496px] text-center w-[60px]">
                                Qty
                            </div>
                            <div className="font-['Inter',sans-serif] font-bold leading-none text-[#0a2540] text-[9.496px] text-center w-[100px]">
                                Unit Price
                            </div>
                            <div className="font-['Inter',sans-serif] font-bold leading-none text-[#0a2540] text-[9.496px] text-center w-[80px]">
                                VAT rate
                            </div>
                            <div className="font-['Inter',sans-serif] font-bold leading-none text-[#0a2540] text-[9.496px] text-right w-[100px]">
                                Amount
                            </div>
                        </div>

                        {/* Items */}
                        <div className="px-[8px]">
                            {invoice.items && invoice.items.length > 0 ? (
                                invoice.items.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className="flex items-start border-b border-[#dfe4ea] py-[12px] last:border-b-0"
                                    >
                                        <div className="font-['Inter',sans-serif] font-normal leading-[1.4] text-[#0a2540] text-[9.496px] flex-1 break-words pr-[8px]">
                                            {item.description}
                                        </div>
                                        <div className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[9.496px] text-center w-[60px]">
                                            {item.quantity}
                                        </div>
                                        <div className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[9.496px] text-center w-[100px]">
                                            {formatCurrency(item.unit_price)}
                                        </div>
                                        <div className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[9.496px] text-center w-[80px]">
                                            {item.vat_rate}%
                                        </div>
                                        <div className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[9.496px] text-right w-[100px]">
                                            {formatCurrency(item.total)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-[20px] text-center text-[#0a2540] text-[9.496px]">
                                    No items
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footnote */}
                    <p className="font-['Inter',sans-serif] font-bold leading-none text-[9.496px] text-black text-center mt-[16px]">
                        Value-Added Tax Act § 15 s 4(1).
                    </p>
                </div>

                {/* Totals Section */}
                <div className="relative px-[22.79px] pb-[30px]">
                    <div className="bg-[#f9f9fa] border-[#dfe4ea] border-[0.95px] border-solid rounded-[2.849px] w-[302.916px] ml-auto p-[16px]">
                        <div className="flex justify-between items-center mb-[12px]">
                            <span className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[11.395px]">
                                Subtotal without taxes:
                            </span>
                            <span className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[11.395px]">
                                {formatCurrency(invoice.subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-[12px]">
                            <span className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[11.395px]">
                                VAT {invoice.tax_rate}%:
                            </span>
                            <span className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[11.395px]">
                                {formatCurrency(invoice.tax_amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-[12px]">
                            <span className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[11.395px]">
                                Adjustments
                            </span>
                            <span className="font-['Inter',sans-serif] font-normal leading-none text-[#0a2540] text-[11.395px]">
                                {invoice.discount_amount > 0
                                    ? `-${formatCurrency(invoice.discount_amount)}`
                                    : formatCurrency(0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-[12px] border-t border-[#dfe4ea] mt-[12px]">
                            <span className="font-['Inter',sans-serif] font-bold leading-[normal] text-[#0a2540] text-[11.395px]">
                                Invoice total:
                            </span>
                            <span className="font-['Inter',sans-serif] font-bold leading-none text-[#0a2540] text-[11.395px]">
                                {formatCurrency(invoice.total_amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                {invoice.notes && (
                    <div className="relative px-[22.79px] pb-[30px]">
                        <p className="font-['Inter',sans-serif] font-normal leading-[1.4] text-[#0a2540] text-[11.395px] break-words">
                            {invoice.notes}
                        </p>
                    </div>
                )}

                {/* Payment Instructions Section */}
                <div className="relative bg-[#f9f9fa] px-[22.79px] py-[24px] mt-[20px]">
                    <p className="font-['Inter',sans-serif] font-bold leading-none text-[#635bff] text-[11.395px] uppercase mb-[16px]">
                        PAYMENT INSTRUCTIONS
                    </p>

                    {invoice.payment_instructions ? (
                        <div className="font-['Inter',sans-serif] font-normal leading-[1.4] text-[#0a2540] text-[11.395px] break-words whitespace-pre-line">
                            {invoice.payment_instructions}
                        </div>
                    ) : (
                        <div className="font-['Inter',sans-serif] font-normal leading-[1.4] text-[#0a2540] text-[11.395px]">
                            <p className="mb-[8px]">Wise USA</p>
                            <p className="mb-[8px]">Account No: 8310157707</p>
                            <p className="mb-[8px]">SWIFT: CMFGUS33</p>
                            <p className="mb-[8px]">
                                ACH Routing No: 084009519
                            </p>
                            <p className="mb-[8px]">
                                Wire Routing No: 026073008
                            </p>
                            <p className="mb-[8px]">
                                19 W 24th Street, 10010, New York, NY, United
                                States
                            </p>
                            <p className="mb-0 mt-[12px]">
                                For any questions please contact us at
                                accounts@clickdee.com
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
