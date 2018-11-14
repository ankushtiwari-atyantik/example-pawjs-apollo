/**
 * Created by ankushtiwari on 14/11/18.
 */
import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withApollo } from 'react-apollo';

class Rates extends React.Component {
  static propTypes = {
    client: PropTypes.shape({}),
    loadedData: PropTypes.shape({}),
  };

  static defaultProps = {
    client: {},
    loadedData: {},
  };

  constructor(props) {
    super(props);
    const { data } = props.loadedData || {};

    this.state = {
      updatingRates: false,
      currencyData: props.loadedData,
      conversionFrom: 'EUR',
    };

    if (data && data.rates) {
      this.setCurrencies(data.rates);
    }
  }

  setCurrencies(rates) {
    this.currencies = rates.map(record => record.currency);
  }

  updateRates(e) {
    if (e && e.preventDefault) e.preventDefault();

    const { client } = this.props;
    this.setState({
      updatingRates: true,
    });
    client
      .query({
        query: gql`
          {
           rates(currency: "${e.target.value}") {
              currency
              rate
            }
          }
        `,
      }).then((updatedRates) => {
        this.setState({
          updatingRates: false,
          currencyData: updatedRates,
        });
      }).catch(() => {
        this.setState({
          updatingRates: false,
        });
      });
  }

  render() {
    const { conversionFrom, updatingRates, currencyData } = this.state;
    const { loading, error, data } = currencyData;

    return (
      <div>
        <h2>Currency rates</h2>

        {(loading || updatingRates) && <p>Loading...</p>}
        {(error) && <p>Error :(</p>}


        <div>
          <label>
            From currency:
          </label>
          {
            data && data.rates
            && (
              <select
                value={conversionFrom}
                onChange={(e) => {
                  this.updateRates(e);
                  this.setState({
                    conversionFrom: e.target.value,
                  });
                }}
              >
                {data.rates.map(({ currency }) => (
                  <option
                    key={`from_${currency}`}
                    value={currency}
                  >
                    {currency}
                  </option>
                ))}
              </select>
            )
          }
        </div>

        {data && data.rates && data.rates.map(({ currency, rate }) => (
          <div key={currency}>
            <p>{`${currency}: ${rate}`}</p>
          </div>
        ))}

        <div>
          <Link to="/">
            Currency converter
          </Link>
        </div>

      </div>
    );
  }
}

export default withApollo(Rates);
