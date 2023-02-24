import {v4 as uuidv4} from 'uuid'
import {Button, Form, Input, Select} from 'antd'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_CAR, GET_PEOPLE, GET_PERSON_CARS, GET_PERSON_WITH_CARS } from '../../queries'
import Subtitle from '../layout/Subtitle'

const AddCar = () => {
    let [id] = useState(uuidv4())
    const [addCar] = useMutation(ADD_CAR)
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()

    useEffect(() => {
        forceUpdate([])
    }, [])

    const onFinish = values => {
        const { year, make, model, price, personId } = values
        id = uuidv4()

        addCar({
            variables:{
                id,
                year,
                make,
                model,
                price,
                personId
            },
            update: (cache, {data: {addCar}}) => {
                let data = cache.readQuery({query: GET_PERSON_CARS, variables: { personId: personId }})
                cache.writeQuery({
                    query: GET_PERSON_CARS,
                    variables: { personId },
                    data: {
                        ...data,
                        personCars: [...data.personCars, addCar]
                    }
                })

                //update the data for the detailed section
                data = cache.readQuery({query: GET_PERSON_WITH_CARS, variables: { id: personId }})
                if(data && data.personWithCars){
                    cache.writeQuery({
                    query: GET_PERSON_WITH_CARS,
                    variables: { id: personId },
                    data: {
                        ...data,
                        personWithCars: {
                            ...data.personWithCars,
                            cars: [...data.personWithCars.cars, addCar]
                        }
                        
                    }
                    })
                }
            }
        })

        window.alert(`${year} ${make} ${model} was added`)
        form.resetFields()

    }

    const {loading, error, data } = useQuery(GET_PEOPLE)

    if(loading) return 'Loading...'
    if(error) return `Error! ${error.message}`

    if(!data.people || data.people.length<=0){
        return (<></>)
    }

    return (
        <div className='add-car-container'>
            <Subtitle msg='Add Car' />
            <Form name='add-car-form' form={form} layout='inline' size='large' style={{ marginBottom: '40px', gap: '0.5rem'}} 
            onFinish= { onFinish }
            initialValues={{ price: '$ '}}
            >
                <Form.Item name='year' label='Year'
                rules={[{ required: true, message: 'Please input the year'}]}>
                    <Input placeholder='Year' />
                </Form.Item>
                <Form.Item name='make' label='Make'
                rules={[{ required: true, message: 'Please input the make'}]}>
                    <Input placeholder='Make' />
                </Form.Item>
                <Form.Item name='model' label='Model'
                rules={[{ required: true, message: 'Please input the model'}]}>
                    <Input placeholder='Model' />
                </Form.Item>
                <Form.Item name='price' label='Price'
                rules={[{ required: true, message: 'Please input the price'}]}>
                    <Input placeholder='Price' />
                </Form.Item>
                <Form.Item name='personId' label='Person'
                rules={[{ required: true, message: 'Please select a person'}]}>
                    <Select placeholder='Select a person'>
                        {data.people.map(({id, firstName, lastName}) => (
                            <Select.Option key={id} value={id}>{firstName} {lastName}</Select.Option>
                        ))}  
                    </Select>
                </Form.Item>
                <Form.Item shouldUpdate= {true}>
                    {() => (
                        <Button type='primary' htmlType='submit' 
                        disabled={!form.isFieldsTouched(true) || form.getFieldsError().filter(({errors}) => errors.length).length}>
                            Add Car
                        </Button>
                    )}
                </Form.Item>

            </Form>
        </div>
    )
}

export default AddCar