import { DeleteOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { GET_PEOPLE, REMOVE_PERSON, REMOVE_PERSON_CARS } from "../../queries"

import filter from 'lodash.filter'

const RemovePerson = ({ id }) => {
    const [removePerson] = useMutation(REMOVE_PERSON,{
        update(cache, {data: {removePerson}}){
            const {people} = cache.readQuery({ query: GET_PEOPLE })
            cache.writeQuery({
                query: GET_PEOPLE,
                data: {
                    people: filter(people, p => {
                        return p.id !== removePerson.id
                    })
                }
            })
        }
    })

    const [removePersonCars] = useMutation(REMOVE_PERSON_CARS)

    const handleButtonClick= () => {
        let result = window.confirm('Are you sure you want to delete this person?')

        if(result){
            removePerson({
                variables: {
                    id
                }
            })
            removePersonCars({
                variables: {
                    personId: id
                }
            })
        }
    }

    return <DeleteOutlined key='delete' style={{ color: 'red' }} onClick={handleButtonClick} />
}

export default RemovePerson