import { useState } from 'react';
import { InputGroup, FormControl, Button, Card } from 'react-bootstrap';
import Loader from './components/Loader';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [keywords, setKeywords] = useState('');
  // data - saved articles by keywords on submit
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  // Spinner loader
  const [isLoaded, setIsLoaded] = useState(false);

  const TOKEN = '89310d38bca3a44d50a4be896cc6a2e2';
  const ENDPOINT = `https://gnews.io/api/v4/search?q=${keywords}&token=${TOKEN}`;

  // Searching articles on submit
  const handleSubmit = async () => {
    // Regex for input validation
    let regex = /^[a-z\d\-_\s]+$/i.test(keywords);
    if (!regex || keywords.length <= 0) {
      setErrorMessage(
        'Queries must contain the following: letters, numbers, white space'
      );
    } else if (keywords.length > 40) {
      setErrorMessage(
        'Please make sure your input contains less than 40 symbols'
      );
    } else {
      setErrorMessage('');
      try {
        let response = await fetch(ENDPOINT);
        let data = await response.json();
        let newArray = data.articles.slice(0, 9);
        setData(newArray);
        setIsLoaded(true);
      } catch (e) {
        return e;
      }
      // Saving keywords to server
      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywords,
        }),
      };
      try {
        const response = await fetch(
          'https://search-news-app.herokuapp.com/api/keywords',
          settings
        );
        await response.json();
      } catch (e) {
        return e;
      }
    }
  };
  // Saving article info to server
  const handleArticles = async (index) => {
    window.open(data[index].url, '_blank');
    let article = data[index];

    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: article.title,
        description: article.description,
        image: article.image,
        date: article.publishedAt,
        url: article.url,
      }),
    };
    try {
      const response = await fetch(
        'https://search-news-app.herokuapp.com/api/articles',
        settings
      );
      await response.json();
    } catch (e) {
      return e;
    }
  };
  return (
    <div className="App">
      <div className="container">
        <div className="logo">NEWS FROM GOOGLE NEWS</div>
        <div className="errorMessage">{errorMessage}</div>
        <InputGroup className="mb-3 mt-3 custom_input">
          <FormControl
            placeholder="Place the keywords.."
            variant="success"
            onChange={(e) => setKeywords(e.target.value)}
            value={keywords}
          />
          <Button
            variant="outline-success"
            id="button-addon2"
            onClick={handleSubmit}
          >
            SEARCH
          </Button>
        </InputGroup>
      </div>
      <div className="articles_container">
        {isLoaded ? (
          data.map((e, index) => (
            <Card
              style={{ cursor: 'pointer' }}
              key={index}
              className="container_card"
              onClick={() => handleArticles(index)}
            >
              <Card.Img variant="top" src={e.image} className="card_image" />
              <Card.Body>
                <Card.Title className="card_title">{e.title}</Card.Title>
                <Card.Text className="card_description">
                  {e.description.substr(0, 100)}...
                </Card.Text>
                <Card.Text className="card_date">{e.publishedAt}</Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : data.length !== 0 ? (
          <Loader />
        ) : null}
      </div>
    </div>
  );
}

export default App;
