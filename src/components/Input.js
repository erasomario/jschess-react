import Form from 'react-bootstrap/Form'
import { InputGroup } from 'react-bootstrap'
import React from 'react';

export default class Input extends React.Component {

    constructor(props) {
        super(props)
        this.ref = React.createRef();
        if (!props.id) {
            throw Error('id is missing')
        }
    }

    focus = () => {
        this.ref.current.focus()
    }

    render() {
        const { label, children, id, name, ...rest } = this.props
        return <Form.Group controlId={id}>
            {label && <Form.Label>{label}</Form.Label>}
            <InputGroup className="mb-2">
                {children && <InputGroup.Prepend>
                    <InputGroup.Text>{children}</InputGroup.Text>
                </InputGroup.Prepend>}
                <Form.Control {...rest} ref={this.ref} />
            </InputGroup>
        </Form.Group>
    }
}