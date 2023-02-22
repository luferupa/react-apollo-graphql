import { Card, Divider, Table } from "antd"
import { Link, useLoaderData } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { GET_PERSON_WITH_CARS } from "../../queries"
import { useEffect, useState } from "react"

const getStyles = () => ({
    card: {
        width: '900px',
        margin: 'auto',
        alignSelf: 'center',
        justifySelf: 'center',
        marginTop: '3rem'
    }
})

export const loader = ({params}) => {
    return params.personId;
}

const PersonDetails = () => {
    const id = useLoaderData()

    const [, forceUpdate] = useState()

    useEffect(() => {
        forceUpdate([])
    }, [])

    const {loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {variables: {id}})

    if(loading) return 'Loading...'
    if(error) return `Error! ${error.message}`

    const styles = getStyles()
    const columns = [
        {
            title: "Year",
            dataIndex: "year",
            key: "year"
        },
        {
            title: "Make",
            dataIndex: "make",
            key: "make"
        },
        {
            title: "Model",
            dataIndex: "model",
            key: "model"
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price"
        }
    ]

    return (
        <div>
            
            <Card style={styles.card}
                title={`${data.personWithCars.firstName} ${data.personWithCars.lastName}`}
                >
                    <Divider>Owned Cars</Divider>
                    <Table dataSource={data.personWithCars.cars} columns={columns} />
                    <Link to={`/`}>Go back home</Link>
            </Card>
            
            
        </div>
    )
    
}

export default PersonDetails