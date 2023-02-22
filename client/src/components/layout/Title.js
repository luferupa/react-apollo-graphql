const getStyles = () => ({
    title: {
        fontSize: 22,
        padding: '15px',
        marginBottom: '20px'
    }
})

const Title = () => {
    const styles = getStyles()

    return <h1 style={styles.title}>PEOPLE AND THEIR CARS</h1>
}

export default Title