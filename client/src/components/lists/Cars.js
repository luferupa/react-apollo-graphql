import { useQuery } from "@apollo/client"
import { List } from "antd"
import { GET_PERSON_CARS } from "../../queries"
import CarCard from "../listItems/CarCard"

const getStyles = () => ({
    list: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '2rem'
    }
})

const Cars = ({ personId }) => {
    const styles = getStyles()

    const {loading, error, data } = useQuery(GET_PERSON_CARS, {variables: { personId }})

    if(loading) return 'Loading...'
    if(error) return `Error! ${error.message}`

    return (
        <div className="cars-list-container">
            <List grid={{ gutter: 20, column: 1 }} style={ styles.list }>
                {data.personCars.map(({ id, year, make, model, price, personId }) => (
                <List.Item key={id}>
                    <CarCard key={id} id={id} year={year} make={make} model={model} price={price} personId={personId} />
                </List.Item>
                ) )}
                
            </List>
        </div>
    )
}

export default Cars