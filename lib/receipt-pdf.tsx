import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

export type ReceiptData = {
  number: number
  createdAt: Date
  client: { name: string; cedula: string; phone: string }
  technician: { name: string }
  brand: string
  model: string
  serial: string | null
  faultDesc: string
  extras: string | null
}

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  title: { fontSize: 22, fontWeight: 700 },
  subtitle: { fontSize: 12, color: "#4b5563", marginBottom: 24 },
  row: { flexDirection: "row", gap: 16, marginBottom: 16 },
  box: { flex: 1, padding: 12, border: "1 solid #d1d5db", borderRadius: 4 },
  heading: { fontSize: 11, fontWeight: 700, marginBottom: 6 },
  line: { marginBottom: 4 },
  signature: {
    marginTop: 60,
    paddingTop: 8,
    borderTop: "1 solid #374151",
    width: 220,
    textAlign: "center",
  },
})

export function ReceiptDocument({ order }: { order: ReceiptData }) {
  return (
    <Document title={`Comprobante orden ${order.number}`}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Martinez Devices SRL</Text>
        <Text style={styles.subtitle}>
          Comprobante de recepción · Orden #
          {order.number.toString().padStart(5, "0")}
        </Text>
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.heading}>Cliente</Text>
            <Text style={styles.line}>{order.client.name}</Text>
            <Text style={styles.line}>Cédula: {order.client.cedula}</Text>
            <Text>Teléfono: {order.client.phone}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.heading}>Recepción</Text>
            <Text style={styles.line}>
              {new Intl.DateTimeFormat("es-DO", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(order.createdAt)}
            </Text>
            <Text style={styles.line}>Técnico: {order.technician.name}</Text>
            <Text>Estado: RECIBIDO</Text>
          </View>
        </View>
        <View style={styles.box}>
          <Text style={styles.heading}>Equipo</Text>
          <Text style={styles.line}>
            {order.brand} {order.model}
          </Text>
          <Text>Serie: {order.serial || "No indicada"}</Text>
        </View>
        <View style={[styles.box, { marginTop: 16 }]}>
          <Text style={styles.heading}>Falla reportada</Text>
          <Text>{order.faultDesc}</Text>
        </View>
        <View style={[styles.box, { marginTop: 16 }]}>
          <Text style={styles.heading}>Accesorios entregados</Text>
          <Text>{order.extras || "Ninguno"}</Text>
        </View>
        <Text style={styles.signature}>Firma del cliente</Text>
      </Page>
    </Document>
  )
}
