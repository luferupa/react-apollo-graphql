import { useQuery } from "@apollo/client"
import { List } from "antd"
import { GET_PEOPLE } from "../../queries"
import Subtitle from "../layout/Subtitle"
import PersonCard from "../listItems/PersonCard"

const getStyles = () => ({
    list: {
        display: 'flex',
        justifyContent: 'center'
    }
})

const People = () => {
    const styles = getStyles()

    const {loading, error, data } = useQuery(GET_PEOPLE)

    if(loading) return 'Loading...'
    if(error) return `Error! ${error.message}`

    return (
        <div className="people-list-container">
            <Subtitle msg='Records' />
            <List grid={{ gutter: 20, column: 1 }} style={ styles.list }>
                {data.people.map(({ id, firstName, lastName }) => (
                <List.Item key={id}>
                    <PersonCard key={id} id={id} firstName={firstName} lastName={lastName} />
                </List.Item>
                ) )}
                
            </List>
        </div>
    )
}

export default People