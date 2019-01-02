import React, { Component } from "react";
import { Link } from "react-router-dom";

import { v4 as uuid } from "uuid";
import { graphql } from "react-apollo";
import QueryAllOptions from "../GraphQL/QueryAllOptions";
import QueryGetOption from "../GraphQL/QueryGetOption";
import MutationCreateOption from "../GraphQL/MutationCreateOption";

// import DatePicker from 'react-datepicker';
// import moment from 'moment';

// import { nearest15min } from "../Utils";
// import DateTimePickerCustomInput from "./DateTimePickerCustomInput";

class NewOption extends Component {

    static defaultProps = {
        createOption: () => null,
    }

    state = {
        option: {
            status: '',
            price: 0,
            rating: 0,
        }
    };

    handleChange(field, { target: { value } }) {
        const { option } = this.state;

        option[field] = value;

        this.setState({ option });
    }

    // handleDateChange(field, value) {
    //     this.handleChange(field, { target: { value: value.format() } });
    // }

    handleSave = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const { createOption, history } = this.props;
        const { option } = this.state;

        await createOption({ ...option });

        history.push('/options');
    }

    render() {
        const { option } = this.state;

        return (
            <div className="ui container raised very padded segment">
                <h1 className="ui header">Create an option</h1>
                <div className="ui form">
                    <div className="field required eight wide">
                        <label htmlFor="name">Status</label>
                        <input type="text" id="status" value={option.status} onChange={this.handleChange.bind(this, 'status')} />
                    </div>

                    <div className="field required eight wide">
                        <label htmlFor="where">Price</label>
                        <input type="number" id="price" value={option.price} onChange={this.handleChange.bind(this, 'price')} />
                    </div>
                    <div className="field required eight wide">
                        <label htmlFor="description">Rating</label>
                        <input type="number" id="rating" value={option.rating} onChange={this.handleChange.bind(this, 'rating')} />
                    </div>
                    <div className="ui buttons">
                        <Link to="/options" className="ui button">Cancel</Link>
                        <div className="or"></div>
                        <button className="ui positive button" onClick={this.handleSave}>Save</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default graphql(
    MutationCreateOption,
    {
        props: (props) => ({
            createOption: (option) => {
                return props.mutate({
                    update: (proxy, { data: { createOption } }) => {
                        // Update QueryAllOptions
                        const query = QueryAllOptions;
                        const data = proxy.readQuery({ query });

                        data.listOptions.items = [...data.listOptions.items.filter(e => e.id !== createOption.id), createOption];

                        proxy.writeQuery({ query, data });

                        // Create cache entry for QueryGetOption
                        const query2 = QueryGetOption;
                        const variables = { id: createOption.id };
                        const data2 = { getOption: { ...createOption } };

                        proxy.writeQuery({ query: query2, variables, data: data2 });
                    },
                    variables: option,
                    optimisticResponse: () => ({
                        createOption: {
                            ...option, id: uuid(), __typename: 'Option', comments: { __typename: 'CommentConnection', items: [] }
                        }
                    }),
                })
            }
        })
    }
)(NewOption);
