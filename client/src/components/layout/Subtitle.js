import { Divider } from "antd"

const getStyles = () => ({
    title: {
        fontSize: 22,
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

const Subtitle = ({ msg }) => {
    const styles = getStyles()

    return <Divider style={styles.title}>{msg}</Divider>
}

export default Subtitle