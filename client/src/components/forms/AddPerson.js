import {v4 as uuidv4} from 'uuid'
import {Button, Form, Input} from 'antd'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_PERSON, GET_PEOPLE } from '../../queries'
import Subtitle from '../layout/Subtitle'

const AddPerson = () => {
    const [id] = useState(uuidv4())
    const [addPerson] = useMutation(ADD_PERSON)
    const [form] = Form.useForm()
    const [, forceUpdate] = useState()

    useEffect(() => {
        forceUpdate([])
    }, [])

    const onFinish = values => {
        const { firstName, lastName } = values

        addPerson({
            variables:{
                id,
                firstName,
                lastName
            },
            update: (cache, {data: {addPerson}}) => {
                const data = cache.readQuery({query: GET_PEOPLE})
                cache.writeQuery({
                    query: GET_PEOPLE,
                    data: {
                        ...data,
                        people: [...data.people, addPerson]
                    }
                })
            }
        })

    }

    return (
        <div className='add-person-container'>
            <Subtitle msg='Add Person' />
            <Form name='add-person-form' form={form} layout='inline' size='large' style={{ marginBottom: '40px'}} onFinish= { onFinish }>
                <Form.Item name='firstName' label='First Name'
                rules={[{ required: true, message: 'Please input the firstname'}]}>
                    <Input placeholder='First Name' />
                </Form.Item>
                <Form.Item name='lastName' label='Last Name'
                rules={[{ required: true, message: 'Please input the lastname'}]}>
                    <Input placeholder='Last Name' />
                </Form.Item>
                <Form.Item shouldUpdate= {true}>
                    {() => (
                        <Button type='primary' htmlType='submit' 
                        disabled={!form.isFieldsTouched(true) || form.getFieldsError().filter(({errors}) => errors.length).length}>
                            Add Person
                        </Button>
                    )}
                </Form.Item>

            </Form>
        </div>
    )
}

export default AddPerson