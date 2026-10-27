
import * as XLSX from 'xlsx-js-style';

type ExportFileds={
    key:string,
    excelName:string
}[]


function setCellStyle(worksheet: Record<string, any>, rowIndex: number, colIndex: number, style: Record<string, any>) {
    const ref = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
    if (!worksheet[ref]) worksheet[ref] = { t: 's', v: '' }
    worksheet[ref].s = style
}

export const exportUtils=(data:any[],exportFields:ExportFileds,onSuccess?:Function,onError?:Function,file_name?:string)=> {

    if (data.length === 0) return

    try {
        const headerRow = exportFields.map(field => field.excelName)

        const dataRows = data.map(item =>
            exportFields.map(field => (item as any)[field.key] ?? ''),
        )

        const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows])

        worksheet['!cols'] = exportFields.map(field => ({ wch: Math.max(field.excelName.length + 3, 15) }))
        worksheet['!rows'] = [{ hpx: 28 }]

        // Header style aligned with the app's import template (primary green, white bold text)
        exportFields.forEach((field, colIndex) => {
            setCellStyle(worksheet, 0, colIndex, {
                fill: { patternType: 'solid', fgColor: { rgb: '0F9D58' } },
                font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: {
                    top: { style: 'thin', color: { rgb: 'FFFFFF' } },
                    bottom: { style: 'thin', color: { rgb: 'FFFFFF' } },
                    left: { style: 'thin', color: { rgb: 'FFFFFF' } },
                    right: { style: 'thin', color: { rgb: 'FFFFFF' } },
                },
            })
        })

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registre de formation')

        const timestamp = new Date().toISOString().slice(0, 10)
        XLSX.writeFile(workbook, file_name ? `${file_name}_${timestamp}.xlsx` : `export_${timestamp}.xlsx`)
        onSuccess?onSuccess():null
    } catch (error) {
       onError?onError():null
    }

}