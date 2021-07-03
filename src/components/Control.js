import Form from 'react-bootstrap/Form'
import { InputGroup } from 'react-bootstrap'
import React from 'react';

export default class Control extends React.Component {

    constructor(props) {
        super(props)
        this.ref = React.createRef();
    }

    focus = () => {
        this.ref.current.focus()
    }

    render() {
        const { label, children, ...rest } = this.props
        return <Form.Group>
            <Form.Label>{label}</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>{children}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control {...rest} ref={this.ref} />
            </InputGroup>
        </Form.Group>
    }
}