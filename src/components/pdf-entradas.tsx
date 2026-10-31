import { iPdfEntradasProps } from '@/models/pdf-entradas';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';

const PAGE_PADDING = 20;
const BLOCK_HEIGHT = 100;

const styles = StyleSheet.create({
  page: {
    padding: PAGE_PADDING,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '48%',
  },
  rightColumn: {
    width: '48%',
  },
  block: {
    width: '100%',
    minHeight: BLOCK_HEIGHT,
    border: '1pt solid #ccc',
    padding: 8,
    marginBottom: 12,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 5,
    borderBottom: '1pt solid #e0e0e0',
  },
  blockGroup: {
    marginTop: 4,
    paddingBottom: 4,
    marginBottom: 6,
    borderBottom: '1pt solid #e0e0e0',
  },
  blockTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  blockId: {
    fontSize: 8,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 2,
  },
  label: {
    width: 60,
    fontSize: 8,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: 8,
  },
  servicoTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
  },
  servicoItem: {
    marginBottom: 4,
  },
});

const Block = ({ data }: { data: iPdfEntradasProps }) => (
  <View style={styles.block}>
    <View style={styles.blockHeader}>
      <Text style={styles.blockTitle}>ENTRADA</Text>
      <Text style={styles.blockId}>#{data.id}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Consultório:</Text>
      <Text style={styles.value}>{data.consultorio}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Dentista:</Text>
      <Text style={styles.value}>{data.dentista}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Paciente:</Text>
      <Text style={styles.value}>{data.paciente}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Funcionário:</Text>
      <Text style={styles.value}>{data.funcionario}</Text>
    </View>

    <View style={styles.blockGroup}>
      <Text style={styles.blockTitle}>Serviço(s)</Text>
    </View>
    {data.servico.map((item, index) => (
      <View key={index} style={styles.servicoItem}>
        <View style={styles.row}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{item.nome}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Quantidade:</Text>
          <Text style={styles.value}>{item.quantidade}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Data Prevista:</Text>
          <Text style={styles.value}>
            {format(
              parseISO(item.data_previsao.toISOString().split('T')[0]),
              'dd/MM/yyyy'
            )}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

export const PdfEntradas = ({
  blocksData,
}: {
  blocksData: iPdfEntradasProps[];
}) => {
  const leftColumnBlocks = blocksData.filter((_, index) => index % 2 === 0);
  const rightColumnBlocks = blocksData.filter((_, index) => index % 2 === 1);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.columnsContainer}>
          <View style={styles.leftColumn}>
            {leftColumnBlocks.map((block) => (
              <Block key={block.id} data={block} />
            ))}
          </View>

          <View style={styles.rightColumn}>
            {rightColumnBlocks.map((block) => (
              <Block key={block.id} data={block} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
