import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

// import moment from 'moment';

import QueryGetOption from "../GraphQL/QueryGetOption";
// import OptionComments from "./OptionComments";

class ViewOption extends Component {

    render() {
        const { option, loading } = this.props;

        return (
            <div className={`ui container raised very padded segment ${loading ? 'loading' : ''}`}>
                <Link to="/options" className="ui button">Back to options</Link>
                <div className="ui items">
                    <div className="item">
                        {option && <div className="content">
                            <div className="header">{option.status}</div>
                            <div className="extra"><i className="icon calendar"></i>{option.price}</div>
                            <div className="extra"><i className="icon clock"></i>{option.rating}</div>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}

const ViewOptionWithData = graphql(
    QueryGetOption,
    {
        options: ({ match: { params: { id } } }) => ({
            variables: { id },
            fetchPolicy: 'cache-and-network',
        }),
        props: ({ data: { getOption: option, loading} }) => ({
            option,
            loading,
        }),
    },
)(ViewOption);

export default ViewOptionWithData;