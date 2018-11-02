import React from 'react';


const Home = (props) => {
  const {loading, error, data} = props.loadedData;
  return (
    <div>
      <h2>Apollo app for Books</h2>
      {
        (loading) && (<p>Loading...</p>)
      }
      {
        (error) && (<p>Error :(</p>)
      }
      {
        data && data.books.map(({title, author}) => (
          <div key={title}>
            <p>{`${title}: ${author}`}</p>
          </div>
        ))
      }

      <hr />
    </div>
  );
};

export default Home;
