/**
 * Created by ankushtiwari on 14/11/18.
 */
import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { withApollo } from 'react-apollo';

// import custom CSS
import styles from './home.css';


class Home extends React.Component {static propTypes = {
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
      fromValue: 1,
      updatingRates: false,
      currencyData: props.loadedData,
      conversionFrom: 'USD',
      conversionTo: 'EUR',
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
    const {
      conversionFrom, conversionTo, fromValue, updatingRates, currencyData,
    } = this.state;
    const { loading, error, data } = currencyData;

    return (
      <div className={styles.container}>
        <div className={styles.mw500}>
          <h1 className={styles.title}>Currency converter</h1>

          {(loading || updatingRates) && <p>Loading...</p>}
          {(error) && <p>Error :(</p>}

          <div className={classNames(styles.row, styles.mt)}>
            <label className={styles.col4}>
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
                  className={styles.col4}
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
            <input
              value={fromValue}
              type="number"
              onChange={(e) => {
                if (e && e.preventDefault) e.preventDefault();
                this.setState({
                  fromValue: e.target.value,
                });
              }}
              className={styles.col4}
            />
          </div>

          <div className={styles.row}>
            <label className={classNames(styles.col4, styles.mt2)}>
              To currency:
            </label>
            {
              data && data.rates
              && (
                <select
                  value={conversionTo}
                  onChange={(e) => {
                    this.setState({
                      conversionTo: e.target.value,
                    });
                  }}
                  className={classNames(styles.col4, styles.mt2)}
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

            <input
              value={
                fromValue * (data.rates.find(
                  record => record.currency.toUpperCase() === conversionTo.toUpperCase(),
                ).rate || 1)}
              readOnly
              className={classNames(styles.col4, styles.mt2)}
            />
          </div>

          <div>
            <Link to="/rates">
              View rate list
            </Link>
          </div>

          <div className={styles.mt}>
            <a
              href="https://github.com/Atyantik/example-pawjs-apollo.git"
              className={classNames(styles.btn, styles.black)}
            >
              View source code
            </a>
          </div>
        </div>

        <div className={classNames(styles.mw800, styles['border-top'])}>
          <div className={styles.row}>
            <div className={styles.col8}>
              <div className={styles.p2}>
                <div>
                  This is an example project of implementing Redux with&nbsp;
                  <a
                    href="https://www.reactpwa.com"
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                    className={styles.link}
                  >
                    ReactPWA boilerplate
                  </a>
                  &nbsp;along with&nbsp;
                  <a
                    href="https://github.com/atyantik/pawjs"
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                    className={styles.link}
                  >
                    PawJS
                  </a>
                </div>
                <div className={styles.p1}>
                  If you wish to contribute more to the project please visit us at&nbsp;
                  <a
                    href="https://www.opencollective.com/react-pwa"
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                    className={styles.link}
                  >
                    https://www.opencollective.com/react-pwa
                  </a>
                </div>
                <div className={styles.p1}>
                  <a
                    href="https://opencollective.com/react-pwa/donate"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <img alt="open-collective" src="https://opencollective.com/react-pwa/contribute/button@2x.png?color=blue" width="250" />
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.col4}>
              <div className={styles.p2}>
                <script src="https://codefund.io/scripts/fefc6de5-a0ce-46e8-a15d-f43733b5b454/embed.js" />
                <div id="codefund_ad" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(Home);
