import './App.css';
import { Header } from './components/Header';
import {Card} from './components/Card'
import { images } from './components/images';
import { Rules } from './components/Rules';
import {useState, useEffect} from 'react'
import {shuffleArray} from './components/shuffleArray'


function App() {
  
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(!localStorage.length ? 0 : JSON.parse(localStorage.getItem('bestScore'))); 

  const [listOfImages, setListOfImages] = useState(images.map((item, index) => {
    return {src: item, clickedOn: false, key: index};
  }));
  const [shownCards, setShownCards] = useState([]);
  
  useEffect(() => {
    const indexesOfImage = []; 
    listOfImages.forEach((item, index) => {
      indexesOfImage.push(index);
    }) 
    let unClickedImage = listOfImages.filter(item => {
      if (!item.clickedOn) return item;
    })
    if (!unClickedImage.length) {
      alert('Congratulations. You\'ve gone through all the images! The score will remain but the images have been reset and you can click on all of them again. Keep going!');
      const theImages = listOfImages.map(item => {
        return {...item, clickedOn: false}
      });
      setListOfImages(theImages);
      unClickedImage = theImages.filter(item => {
        if (!item.clickedOn) return item;
      })
    }
    const randomUnclicked = Math.floor(Math.random() * unClickedImage.length);
    const displayedCards = [unClickedImage[randomUnclicked]]
    indexesOfImage.splice(displayedCards[0].key, 1);
    for (let i = 0; i < 9; i++) {
      let rng = Math.floor(Math.random() * indexesOfImage.length);
      displayedCards.push(listOfImages[indexesOfImage.splice(rng,1)]);
    }
    shuffleArray(displayedCards);
    setShownCards(displayedCards);
  }, [score])

  const handleSelection = (item) => {
    if(item.clickedOn) {
      alert('You lose!');
      const theImages = listOfImages.map(item => {
        return {...item,clickedOn: false}
      })
      setListOfImages(theImages);
      setScore(0);
    } else {
      const theImages = [...listOfImages];
      theImages[item.key].clickedOn = true;
      setListOfImages(theImages);
      setScore(score + 1);
      if (score >= bestScore) {
        setBestScore(score + 1);
        localStorage.setItem('bestScore', JSON.stringify(score + 1))
      }
    }
  }

 
  return (
    <div>
      <Header 
        score={score} 
        bestScore={bestScore}
      />
      <div className="card-display">
        {shownCards.map(item => {
          return <div onClick={(e) => handleSelection(item)}><Card img={item.src} key={item.key} /></div>
        })}
      </div>
     {score < 3 ? <div className='rules'>
        <Rules />
      </div> : null}
    </div>
  );
}

export default App;
