import React, { Component } from "react";
import { Link } from "react-router-dom";

import { graphql, compose, withApollo } from "react-apollo";
import QueryAllOptions from "../GraphQL/QueryAllOptions";
import MutationDeleteOption from "../GraphQL/MutationDeleteOption";

// import moment from "moment";

class AllOptions extends Component {

    state = {
        busy: false,
    }

    static defaultProps = {
        options: [],
        deleteOption: () => null,
    }

    async handleDeleteClick(option, e) {
        e.preventDefault();

        if (window.confirm(`Are you sure you want to delete option ${option.id}`)) {
            const { deleteOption } = this.props;
            console.log('option - ', option);
            console.log('deleteOption - ', deleteOption);
            await deleteOption(option);
        }
    }

    handleSync = async () => {
        const { client } = this.props;
        const query = QueryAllOptions;

        this.setState({ busy: true });

        await client.query({
            query,
            fetchPolicy: 'network-only',
        });

        this.setState({ busy: false });
    }

    renderOption = (option) => (
        <Link to={`/option/${option.id}`} className="card" key={option.id}>
            <div className="content">
                <div className="header">{option.status}</div>
            </div>
            <div className="content">
                <div className="description"><i className="icon info circle"></i>{option.price}</div>
            </div>
            <div className="extra content">
                <i className="icon comment"></i> {option.rating} stars
            </div>
            <button className="ui bottom attached button" onClick={this.handleDeleteClick.bind(this, option)}>
                <i className="trash icon"></i>
                Delete
            </button>
        </Link>
    );

    render() {
        const { busy } = this.state;
        const { options } = this.props;

        return (
            <div>
                <div className="ui clearing basic segment">
                    <h1 className="ui header left floated">All Options</h1>
                    <button className="ui icon left basic button" onClick={this.handleSync} disabled={busy}>
                        <i aria-hidden="true" className={`refresh icon ${busy && "loading"}`}></i>
                        Sync with Server
                    </button>
                </div>
                <div className="ui link cards">
                    <div className="card blue">
                        <Link to="/newOption" className="new-event content center aligned">
                            <i className="icon add massive"></i>
                            <p>Create new option</p>
                        </Link>
                    </div>
                    {options && [].concat(options).sort((a, b) => a.status.localeCompare(b.status)).map(this.renderOption)}
                </div>
            </div>
        );
    }

}

export default withApollo(compose(
    graphql(
        QueryAllOptions,
        {
            options: {
                fetchPolicy: 'cache-first',
            },
            props: ({ data: { listOptions = { items: [] } } }) => ({
                options: listOptions.items
            })
        }
    ),
    graphql(
        MutationDeleteOption,
        {
            options: {
                update: (proxy, { data: { deleteOption } }) => {
                    const query = QueryAllOptions;
                    const data = proxy.readQuery({ query });

                    data.listOptions.items = data.listOptions.items.filter(option => option.id !== deleteOption.id);

                    proxy.writeQuery({ query, data });
                }
            },
            props: (props) => ({
                deleteOption: (option) => {
                    return props.mutate({
                        variables: { id: option.id },
                        optimisticResponse: () => ({
                            deleteOption: {
                                ...option, __typename: 'option', comments: { __typename: 'CommentConnection', items: [] }
                            }
                        }),
                    });
                }
            })
        }
    )
)(AllOptions));
