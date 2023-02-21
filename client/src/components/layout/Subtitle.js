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

    return <h2 style={styles.title}>{msg}</h2>
}

export default Subtitle