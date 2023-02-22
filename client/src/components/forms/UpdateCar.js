import { useMutation, useQuery } from "@apollo/client"
import { Button, Form, Input, Select } from "antd"
import filter from "lodash.filter"
import { useEffect, useState } from "react"
import { GET_PEOPLE, GET_PERSON_CARS, GET_PERSON_WITH_CARS, UPDATE_CAR } from "../../queries"

const UpdateCar = props => {
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()
    const [ id ] = useState(props.id)
    const [year, setYear] = useState(props.year)
    const [make, setMake] = useState(props.make)
    const [model, setModel] = useState(props.model)
    const [price, setPrice] = useState(props.price)
    const [personId, setPersonId] = useState(props.personId)
    const [originalPersonId, setOPersonId] = useState(props.personId)

    const [updateCar] = useMutation(UPDATE_CAR)

    useEffect(() => {
        forceUpdate()
    }, [])

    const onFinish = values => {
        const { year, make, model, price, personId } = values

        updateCar({
            variables: {
                id,
                year,
                make,
                model,
                price,
                personId
            },
            update: (cache, {data: {updateCar}}) => {
                //update the data on the owner section
                let data = cache.readQuery({query: GET_PERSON_CARS, variables: { personId: personId }})
                cache.writeQuery({
                    query: GET_PERSON_CARS,
                    variables: { personId: personId },
                    data: {
                        ...data,
                        personCars: [...data.personCars, updateCar]
                    }
                })

                //update the data for the detailed section
                data = cache.readQuery({query: GET_PERSON_WITH_CARS, variables: { id: personId }})
                if(data){
                    cache.writeQuery({
                    query: GET_PERSON_WITH_CARS,
                    variables: { id: personId },
                    data: {
                        ...data,
                        personWithCars: {
                            ...data.personWithCars,
                            cars: [...data.personWithCars.cars, updateCar]
                        }
                        
                    }
                    })
                }
                
                //delete the car from the original person section if it changed the owner
                if(personId!==originalPersonId){
                    data = cache.readQuery({query: GET_PERSON_CARS, variables: { personId: originalPersonId }})
                    cache.writeQuery({
                        query: GET_PERSON_CARS,
                        variables: { personId: originalPersonId },
                        data: {
                            ...data,
                            personCars: filter(data.personCars, c => {
                                return c.id !== updateCar.id
                            })
                        }
                    })
                }

                //delete the car from the detailed person section if it changed the owner
                if(personId!==originalPersonId){
                    data = cache.readQuery({query: GET_PERSON_WITH_CARS, variables: { id: originalPersonId }})
                    cache.writeQuery({
                        query: GET_PERSON_WITH_CARS,
                        variables: { id: originalPersonId },
                        data: {
                            ...data,
                            personWithCars: {
                                cars: filter(data.personWithCars.cars, c => {
                                    return c.id !== updateCar.id
                                })
                            }
                        }
                    })
                }
                
            }
        })
        props.onButtonClick()
    }

    const updateStateVariable = (variable, value) => {
        props.updateStateVariable(variable, value)
        switch(variable){
            case 'year':
                setYear(value)
                break;
            case 'make':
                setMake(value)
                break;
            case 'model':
                setModel(value)
                break;
            case 'price':
                setPrice(value)
                break;
            case 'personId':
                setPersonId(value)
                break;
            default:
                break;
        }
    }

    const {loading, error, data } = useQuery(GET_PEOPLE)

    if(loading) return 'Loading...'
    if(error) return `Error! ${error.message}`

    return (
        <Form form={form} name='update-car-form' layout='inline' size='large'
        onFinish={onFinish}
        initialValues={{
            year: year,
            make: make,
            model: model,
            price: price,
            personId: personId
        }}
        >
            <Form.Item name='year' label='Year'
                rules={[{ required: true, message: 'Please input the year'}]}>
                <Input placeholder='Year' onChange={e => updateStateVariable('year', e.target.value)} />
            </Form.Item>
            <Form.Item name='make' label='Make'
                rules={[{ required: true, message: 'Please input the make'}]}>
                <Input placeholder='Make' onChange={e => updateStateVariable('make', e.target.value)} />
            </Form.Item>
            <Form.Item name='model' label='Model'
                rules={[{ required: true, message: 'Please input the model'}]}>
                <Input placeholder='Model' onChange={e => updateStateVariable('model', e.target.value)} />
            </Form.Item>
            <Form.Item name='price' label='Price'
                rules={[{ required: true, message: 'Please input the price'}]}>
                <Input placeholder='Price' onChange={e => updateStateVariable('price', e.target.value)} />
            </Form.Item>
            <Form.Item name='personId' label='Person'
                rules={[{ required: true, message: 'Please select a person'}]}>
                    <Select placeholder='Select a person'
                    onChange={value => updateStateVariable('personId', value)}
                    >
                        {data.people.map(({id, firstName, lastName}) => (
                            <Select.Option key={id} value={id}>{firstName} {lastName}</Select.Option>
                        ))}  
                    </Select>
                </Form.Item>
            <Form.Item shouldUpdate={true}>
            {() => (
                <Button type="primary" htmlType="submit" 
                disabled={
                    (!form.isFieldTouched('year') && !form.isFieldTouched('make') 
                    && !form.isFieldTouched('model') && !form.isFieldTouched('price') && !form.isFieldTouched('personId'))
                    || form.getFieldError().filter(({errors}) => errors.length).length
                }
                >
                    Update Car
                </Button>
            )}
            </Form.Item>
            <Button onClick={props.onButtonClick}>
                Cancel
            </Button>
        </Form>
    )
}

export default UpdateCar