import { Card } from "antd"
import { EditOutlined } from '@ant-design/icons'
import RemovePerson from "../buttons/RemovePerson"
import { useState } from "react"
import UpdatePerson from "../forms/UpdatePerson"
import Cars from "../lists/Cars"

const getStyles = () => ({
    card: {
        width: '900px'
    }
})

const PersonCard = props => {
    const [ id ] = useState(props.id)
    const [firstName, setFirstName] = useState(props.firstName)
    const [lastName, setLastName] = useState(props.lastName)
    const [editMode, setEditMode] = useState(false)

    const styles = getStyles()
    const handleButtonClick = () => {
        setEditMode(!editMode)
    }

    const updateStateVariable = (variable, value) => {
        switch(variable){
            case 'firstName':
                setFirstName(value)
                break;
            case 'lastName':
                setLastName(value)
                break;
            default:
                break;
        }
    }

    return (
        <div>
            {editMode? 
            (<UpdatePerson 
                id={props.id}
                firstName={firstName}
                lastName={lastName}
                onButtonClick={handleButtonClick} 
                updateStateVariable={updateStateVariable}
            />)
            : (
                <Card style={styles.card}
                actions= {[
                    <EditOutlined key='edit' onClick={handleButtonClick} />,
                    <RemovePerson id={id} />
                ]}
                title={`${firstName} ${lastName}`}
                >
                    <Cars personId={id} />
                </Card>
            )}
            
        </div>
    )
}

export default PersonCard