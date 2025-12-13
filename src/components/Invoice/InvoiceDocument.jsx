import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 24,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    label: {
        fontWeight: "bold",
    },
    underline: {
        textDecoration: "underline"
    },
    capitalize: {
        textTransform: "capitalize"
    },
    textCenter: {
        textAlign: "center"
    }
});

const InvoiceDocument = ({ payment, user }) => {
    const paidDate = new Date(payment?.paidAt).toLocaleString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, styles.textCenter]}>Payment Invoice</Text>
                    <Text style={styles.textCenter}>Public Issue Complaint System</Text>
                </View>

                {/* Invoice meta */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Invoice ID:</Text>
                        <Text>{payment._id}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Transaction ID:</Text>
                        <Text>{payment?.transactionId}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Paid At:</Text>
                        <Text>{paidDate}</Text>
                    </View>
                </View>

                {/* Customer info */}
                <View style={styles.section}>
                    <Text style={[styles.label, styles.underline]}>Billed To:</Text>
                    <Text>{payment?.customerName}</Text>
                    <Text>{payment?.customerEmail}</Text>
                </View>

                {/* Payment details */}
                <View style={styles.section}>
                    <Text style={[styles.label, styles.underline]}>Payment Details:</Text>
                    <View style={styles.row}>
                        <Text>Amount:</Text>
                        <Text>
                            {payment?.currency?.toUpperCase()} {payment?.amount} Taka
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Payment Type:</Text>
                        <Text style={styles.capitalize}>
                            {payment?.paymentType?.split("_").join(" ")}
                        </Text>
                    </View>

                    {
                        payment?.paymentType === "boost_issue" && (
                            <View style={styles.row}>
                                <Text>Issue Id:</Text>
                                <Text>{payment?.issueId}</Text>
                            </View>
                        )
                    }

                    {payment.paymentType === "boost_issue" && payment.issueTitle && (
                        <View style={styles.row}>
                            <Text>Issue Title:</Text>
                            <Text>{payment?.issueTitle}</Text>
                        </View>
                    )}

                    <View style={styles.row}>
                        <Text>Payment Status:</Text>
                        <Text style={styles.capitalize}>{payment?.paymentStatus}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.section}>
                    <Text>Thank you for your payment.</Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoiceDocument;
