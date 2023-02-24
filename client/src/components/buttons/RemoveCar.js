import { DeleteOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { GET_PERSON_CARS, GET_PERSON_WITH_CARS, REMOVE_CAR } from "../../queries"

import filter from 'lodash.filter'

const RemoveCar = ({ id, personId }) => {
    const [removeCar] = useMutation(REMOVE_CAR,{
        update(cache, {data: {removeCar}}){
            let data = cache.readQuery({ query: GET_PERSON_CARS, variables: { personId: personId } })
            cache.writeQuery({
                query: GET_PERSON_CARS,
                variables: { personId },
                data: {
                    ...data,
                    personCars: filter(data.personCars, c => {
                        return c.id !== removeCar.id
                    })
                }
            })

            //delete the car from the detailed person section if it changed the owner
            data = cache.readQuery({query: GET_PERSON_WITH_CARS, variables: { id: personId }})
            if(data && data.personWithCars){
                cache.writeQuery({
                    query: GET_PERSON_WITH_CARS,
                    variables: { id: personId },
                    data: {
                        ...data,
                        personWithCars: {
                            cars: filter(data.personWithCars.cars, c => {
                                return c.id !== removeCar.id
                            })
                        }
                    }
                })
            }
            
        }
    })

    const handleButtonClick= () => {
        let result = window.confirm('Are you sure you want to delete this car?')

        if(result){
            removeCar({
                variables: {
                    id
                }
            })
        }
    }

    return <DeleteOutlined key='delete' style={{ color: 'red' }} onClick={handleButtonClick} />
}

export default RemoveCar