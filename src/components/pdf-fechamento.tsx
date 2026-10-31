import {
  fechamentoType,
  iFechamentoEntradaItem,
  iFechamentoEntradaProps,
} from '@/models/fechamento';
import {
  Document,
  Image as PdfImage,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

interface iPdfFechamentoProps extends iFechamentoEntradaProps {
  descontos?: number[];
  referenceDate: string;
}

const PAGE_PADDING = 20;

const styles = StyleSheet.create({
  page: {
    padding: PAGE_PADDING,
    fontSize: 10,
    color: '#1f2937',
  },
  header: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottom: '1pt solid #e5e7eb',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  brandText: {
    fontSize: 11,
    color: '#172554',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: -4,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    marginBottom: 8,
    borderBottom: '1pt solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'medium',
  },
  sectionTotal: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 12,
    padding: 10,
    border: '1pt solid #e5e7eb',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    width: '78%',
  },
  mutedText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  smallText: {
    fontSize: 8,
    color: '#4b5563',
  },
  monoText: {
    fontSize: 8,
    color: '#6b7280',
  },
  dividerText: {
    fontSize: 8,
    color: '#d1d5db',
    marginHorizontal: 4,
  },
  cardTotal: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#374151',
  },
  serviceRow: {
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#f9fafb',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  serviceCell: {
    width: '16.66%',
    paddingRight: 6,
  },
  serviceCellWide: {
    width: '22%',
    paddingRight: 6,
  },
  serviceCellNarrow: {
    width: '11.2%',
    paddingRight: 6,
  },
  serviceLabel: {
    fontSize: 7,
    color: '#9ca3af',
    marginBottom: 2,
  },
  serviceValue: {
    fontSize: 8,
    color: '#4b5563',
  },
  serviceSubtotal: {
    fontSize: 8,
    fontWeight: 'medium',
    color: '#374151',
  },
  totalsContainer: {
    marginTop: -10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4b5563',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  discountedValue: {
    fontSize: 12,
    color: '#dc2626',
    textDecoration: 'line-through',
  },
  discountsList: {
    marginTop: 0,
    paddingTop: 8,
    borderTop: '1pt solid #f3f4f6',
    gap: 4,
  },
  discountsListTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4b5563',
    textTransform: 'uppercase',
    marginBottom: 2,
    borderBottom: '1pt solid #f3f4f6',
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  discountValue: {
    fontSize: 9,
    color: '#374151',
    fontWeight: 'medium',
  },
  observation: {
    marginTop: 0,
    paddingTop: 12,
    borderTop: '1pt solid #f3f4f6',
  },
  observationTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  observationText: {
    fontSize: 9,
    color: '#1f2937',
    lineHeight: 1.35,
  },
});

const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;

const getGroupedItems = (
  type: fechamentoType,
  itens: iFechamentoEntradaItem[]
) => {
  if (type === 'dentista') {
    return itens.reduce<Record<string, iFechamentoEntradaItem[]>>(
      (acc, item) => {
        const key = item.consultorio || 'Consultório não encontrado';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      },
      {}
    );
  }

  return itens.reduce<Record<string, iFechamentoEntradaItem[]>>((acc, item) => {
    const key = item.dentista || 'Dentista não encontrado';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

const ServiceRow = ({
  data,
  nome,
  quantidade,
  valor,
  repeticao,
  desconto,
  total,
}: iFechamentoEntradaItem['servicos'][number]) => {
  const repeticaoValue = repeticao > 0 ? `${repeticao}%` : '------';
  const descontoValue =
    desconto > 0 ? `-R$ ${(desconto / 100).toFixed(2)}` : '------';

  return (
    <View style={styles.serviceRow}>
      <View style={styles.serviceGrid}>
        <View style={styles.serviceCellWide}>
          <Text style={styles.serviceLabel}>Data</Text>
          <Text style={styles.serviceValue}>{data}</Text>
        </View>
        <View style={styles.serviceCellWide}>
          <Text style={styles.serviceLabel}>Serviço</Text>
          <Text style={styles.serviceValue}>{nome}</Text>
        </View>
        <View style={styles.serviceCellNarrow}>
          <Text style={styles.serviceLabel}>Quantidade</Text>
          <Text style={styles.serviceValue}>{quantidade}</Text>
        </View>
        <View style={styles.serviceCellNarrow}>
          <Text style={styles.serviceLabel}>Valor</Text>
          <Text style={styles.serviceValue}>{formatCurrency(valor / 100)}</Text>
        </View>
        <View style={styles.serviceCellNarrow}>
          <Text style={styles.serviceLabel}>Repetição</Text>
          <Text style={styles.serviceValue}>{repeticaoValue}</Text>
        </View>
        <View style={styles.serviceCellNarrow}>
          <Text style={styles.serviceLabel}>Desconto</Text>
          <Text style={styles.serviceValue}>{descontoValue}</Text>
        </View>
        <View style={styles.serviceCellNarrow}>
          <Text style={styles.serviceLabel}>Subtotal</Text>
          <Text style={styles.serviceSubtotal}>{formatCurrency(total)}</Text>
        </View>
      </View>
    </View>
  );
};

const EntryCard = ({ item }: { item: iFechamentoEntradaItem }) => (
  <View style={styles.card} wrap={false}>
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderLeft}>
        <Text style={styles.mutedText}>Entrada:</Text>
        <Text style={styles.monoText}>{item.id.slice(-6)}</Text>
        {!!item.paciente && (
          <>
            <Text style={styles.dividerText}>|</Text>
            <Text style={styles.mutedText}>Paciente:</Text>
            <Text style={styles.smallText}>{item.paciente}</Text>
          </>
        )}
      </View>
      <Text style={styles.cardTotal}>{formatCurrency(item.sumEntrada)}</Text>
    </View>

    <View>
      {item.servicos.map((servico) => (
        <ServiceRow key={servico.id} {...servico} />
      ))}
    </View>
  </View>
);

export const PdfFechamento = ({
  type,
  nome,
  itens,
  sumEntradas,
  desconto,
  descontos,
  referenceDate,
  observacao,
}: iPdfFechamentoProps) => {
  const groupedItems = getGroupedItems(type, itens);
  const totalComDesconto =
    desconto && desconto > 0 ? sumEntradas - desconto / 100 : null;
  const descontoList = descontos?.filter((item) => item > 0) || [];

  const tituloFechamento = `Fechamento: ${referenceDate}`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <PdfImage src="/lm.png" style={styles.logo} />
            <Text style={styles.brandText}>Laboratório Marcelo</Text>
          </View>
          <Text style={styles.headerSubtitle}>{tituloFechamento}</Text>
          <Text style={styles.headerTitle}>{nome}</Text>
        </View>

        {Object.entries(groupedItems).map(([groupName, groupItems]) => {
          const groupTotal = groupItems.reduce(
            (acc, item) => acc + item.sumEntrada,
            0
          );

          return (
            <View key={groupName} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{groupName}</Text>
                <Text style={styles.sectionTotal}>
                  {formatCurrency(groupTotal)}
                </Text>
              </View>

              {groupItems.map((item) => (
                <EntryCard key={item.id} item={item} />
              ))}
            </View>
          );
        })}

        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total geral</Text>
            <Text style={desconto ? styles.discountedValue : styles.totalValue}>
              {formatCurrency(sumEntradas)}
            </Text>
          </View>

          {descontoList.length > 0 && (
            <View style={styles.discountsList}>
              <Text style={styles.discountsListTitle}>Desconto(s)</Text>
              {descontoList.map((valor, index) => (
                <View key={`${valor}-${index}`} style={styles.discountRow}>
                  <Text
                    style={styles.discountValue}
                  >{`- ${formatCurrency(valor / 100)}`}</Text>
                </View>
              ))}
            </View>
          )}

          {totalComDesconto !== null && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total com desconto(s)</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(totalComDesconto)}
              </Text>
            </View>
          )}

          {!!observacao && (
            <View style={styles.observation}>
              <Text style={styles.observationTitle}>Observação</Text>
              <Text style={styles.observationText}>{observacao}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
