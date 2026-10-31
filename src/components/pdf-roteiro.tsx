import { GroupedData, iPdfRoteiroProps } from '@/models/pdf-roteiro';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

const PAGE_PADDING = 20;

const styles = StyleSheet.create({
  page: {
    padding: PAGE_PADDING,
  },
  header: {
    marginBottom: 15,
    padding: 8,
    border: '1pt solid #ccc',
  },
  headerRow: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  headerLabel: {
    width: 80,
    fontSize: 9,
    fontWeight: 'bold',
  },
  headerValue: {
    flex: 1,
    fontSize: 9,
  },
  consultorioBlock: {
    width: '100%',
    border: '1pt solid #ccc',
    padding: 8,
    marginBottom: 12,
  },
  consultorioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1pt solid #e0e0e0',
  },
  consultorioTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 8,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  dentistaSection: {
    marginTop: 8,
    marginLeft: 10,
    padding: 6,
    border: '1pt solid #ccc',
  },
  dentistaTitleRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dentistaLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  dentistaValue: {
    fontSize: 9,
    marginLeft: 4,
  },
  pacienteSection: {},
  pacienteTitleRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  pacienteLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  pacienteValue: {
    fontSize: 9,
    marginLeft: 4,
  },
  servicoItem: {
    marginLeft: 10,
    marginBottom: 2,
  },
  servicoName: {
    fontSize: 8,
  },
});

export const PdfRoteiro = ({
  blocksData,
}: {
  blocksData: iPdfRoteiroProps;
}) => {
  // Group items by consultorio
  const groupedByConsultorio = blocksData.items.reduce<GroupedData>(
    (acc, item) => {
      const key = item.consultorio;

      if (!acc[key]) {
        acc[key] = {
          nome: item.consultorio,
          endereco: item.endereco,
          numero: item.numero,
          complemento: item.complemento,
          bairro: item.bairro,
          cep: item.cep,
          dentistas: {},
        };
      }

      const dentistaKey = item.dentista;
      if (!acc[key].dentistas[dentistaKey]) {
        acc[key].dentistas[dentistaKey] = {
          nome: item.dentista,
          pacientes: {},
        };
      }

      const pacienteKey = item.paciente;
      if (!acc[key].dentistas[dentistaKey].pacientes[pacienteKey]) {
        acc[key].dentistas[dentistaKey].pacientes[pacienteKey] = {
          nome: item.paciente,
          servicos: [],
        };
      }

      acc[key].dentistas[dentistaKey].pacientes[pacienteKey].servicos.push(
        ...item.servicos
      );

      return acc;
    },
    {}
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Main header with data and observacao */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerLabel}>Roteiro:</Text>
            <Text style={styles.headerValue}>{blocksData.data}</Text>
          </View>
          {blocksData.observacao && (
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>Observação:</Text>
              <Text style={styles.headerValue}>{blocksData.observacao}</Text>
            </View>
          )}
        </View>

        {/* Render each consultorio block */}
        {Object.values(groupedByConsultorio).map((consultorio) => {
          const formattedAddress = `${consultorio.endereco}, ${consultorio.numero} - ${consultorio.bairro}${consultorio.complemento ? `, ${consultorio.complemento}` : ''} - CEP: ${consultorio.cep}`;

          return (
            <View key={consultorio.nome} style={styles.consultorioBlock}>
              <View style={styles.consultorioHeader}>
                <Text style={styles.consultorioTitle}>{consultorio.nome}</Text>
              </View>

              <Text style={styles.addressText}>{formattedAddress}</Text>

              {Object.values(consultorio.dentistas).map((dentista) => (
                <View key={dentista.nome} style={styles.dentistaSection}>
                  <View style={styles.dentistaTitleRow}>
                    <Text style={styles.dentistaLabel}>Dentista:</Text>
                    <Text style={styles.dentistaValue}>{dentista.nome}</Text>
                  </View>

                  {Object.values(dentista.pacientes).map((paciente) => (
                    <View key={paciente.nome} style={styles.pacienteSection}>
                      <View style={styles.pacienteTitleRow}>
                        <Text style={styles.pacienteLabel}>Paciente:</Text>
                        <Text style={styles.pacienteValue}>
                          {paciente.nome}
                        </Text>
                      </View>

                      {paciente.servicos.map((servico) => (
                        <View key={servico.id} style={styles.servicoItem}>
                          <Text style={styles.servicoName}>
                            • {servico.nome}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
