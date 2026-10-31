'use client';

import { pdf } from '@react-pdf/renderer';
import { PdfFechamento } from '@/components/pdf-fechamento';
import type { fechamentoType } from '@/models/fechamento';
import type { iFechamentoEntradaItem } from '@/models/fechamento';
import JSZip from 'jszip';

interface FechamentoDownloadItem {
  type: fechamentoType;
  nome: string;
  itens: iFechamentoEntradaItem[];
  sumEntradas: number;
  desconto?: number[];
  observacao?: string;
  fechamentoData?: string | Date | null;
}

const formatReferenceDate = (rawDate?: string | Date | null) => {
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const dateToUse =
    parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : new Date();

  return dateToUse
    .toLocaleString('pt-BR', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .replace(' de ', '/')
    .replace(/^\w/, (c) => c.toUpperCase());
};

export const downloadFechamentoPdfs = async (
  entradas: FechamentoDownloadItem[]
) => {
  try {
    const zip = new JSZip();
    const defaultReferenceDate = formatReferenceDate(
      entradas.find((item) => item.fechamentoData)?.fechamentoData
    );

    // Generate PDF for each entry
    for (let i = 0; i < entradas.length; i++) {
      const entrada = entradas[i];

      // Calculate discount sum
      const descontoArray = entrada.desconto || [];
      const desconto = descontoArray.reduce<number>((acc, cur) => acc + cur, 0);

      const referenceDate = entrada.fechamentoData
        ? formatReferenceDate(entrada.fechamentoData)
        : defaultReferenceDate;

      // Generate PDF blob
      const pdfBlob = await pdf(
        <PdfFechamento
          type={entrada.type}
          nome={entrada.nome}
          itens={entrada.itens}
          sumEntradas={entrada.sumEntradas}
          desconto={desconto}
          descontos={descontoArray}
          observacao={entrada.observacao}
          referenceDate={referenceDate}
        />
      ).toBlob();

      // Generate filename
      const sanitizedNome = entrada.nome
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const fileName = `${i + 1}_${sanitizedNome}.pdf`;

      // Add PDF to ZIP
      zip.file(fileName, pdfBlob);
    }

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fechamentos_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar ZIP de PDFs:', error);
    throw error;
  }
};
