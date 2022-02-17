import React, { useContext, useEffect, useState } from 'react';
import { API } from '../../utils/API';
import ReactPaginate from 'react-paginate';

function Home() {
  const [listOfUrls, setListOfUrls] = useState([]);
  // const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [scrapedData, setScrapedData] = useState([]);

  const addNewInputUrl = (e) => {
    let values = [...listOfUrls];
    values.push('');
    setListOfUrls(values);
  }

  const getNewList = async (event) => {
    const skip = (event.selected) * limit;
    const { data: { items, count } } = await API.get('/url', {
      params: {
        skip,
        limit,
        urls: listOfUrls
      }
    });
    setScrapedData(items);
    setPageCount(Math.ceil(count / limit));
  }

  const startScrape = async () => {
    await API.post('/url', {
      urls: listOfUrls
    })

    const { data: { items, count } } = await API.get('/url', {
      params: {
        skip: 0,
        limit,
        urls: listOfUrls
      }
    })
    setScrapedData(items);
    setPageCount(Math.ceil(count / limit));
  }

  const removeSpecificUrl = (index) => {
    let values = [...listOfUrls];
    values.splice(index, 1);
    setListOfUrls(values);
  }

  const inputList = listOfUrls.map((v, i) => {
    return (
      <>
        <input
          key={i}
          value={listOfUrls[i]}
          onChange={(e) => {
            let values = [...listOfUrls];
            values[i] = e.target.value;
            setListOfUrls(values);
          }}
        /> <span> <button onClick={() => {
          removeSpecificUrl(i)
        }}> - </button></span>
        <br /><br />
      </>
    );
  });

  const tableItems = scrapedData.map((v, i) => {
    return (
      <tr>
        <td>{v.url}</td>
        <td>{v.type}</td>
        {v.type === 'image' &&
          <td><img width="150" height="150" key={i} src={v.subUrl}></img></td>
        }
        {v.type === 'video' &&
          <td>
            <video width="200" height="200" key={i} controls={true}>
              <source source={v.subUrl} type="video/mp4" />
            </video>
          </td>
        }
      </tr>
    );
  });

  return (
    <div className='home'>
      <div className='head-title'>
        <h1>Please add the urls below</h1>
        <span className='add-new'>
          <button onClick={(e) => addNewInputUrl(e)}>+</button>
        </span>
      </div>
      <br /><br />
      {inputList}
      {listOfUrls.length > 0
        &&
        <button
          onClick={startScrape}
        >
          Start Scraping
        </button>}
      <div className='table'>
        {scrapedData.length > 0 &&
          <>
            <div className='title'>Table</div>
            <table>
              <thead>
                <tr>
                  <th> Url </th>
                  <th> Type </th>
                  <th> Image / Video </th>
                </tr>
              </thead>
              <tbody>
                {tableItems}
              </tbody>
            </table>
          </>
        }
      </div>
      {scrapedData.length > 0 && <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={getNewList}
        pageRange={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName={'pagination-container'}
        previousLinkClassName={'page'}
					breakClassName={'page'}
					nextLinkClassName={'page'}
					pageClassName={'page'}
          disabledClassName={'disabled'}
          activeClassName={'active'}
      />}

    </div>
  );
}

export default Home;
