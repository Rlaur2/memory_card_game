import './App.css';
import { Header } from './components/Header';
import {Card} from './components/Card'
import { images } from './components/images';
import { Rules } from './components/Rules';
import {useState, useEffect} from 'react'
import {shuffleArray} from './components/shuffleArray'


function App() {
  //Score state is simply set to 0
  const [score, setScore] = useState(0);
  //Best score is initially set to 0 but will be stored in local storage and after it's been stored Best score will be set to that local storage value
  const [bestScore, setBestScore] = useState(!localStorage.bestScore ? 0 : JSON.parse(localStorage.getItem('bestScore'))); 
  //creating the list of images state with .map() makes for cleaner code and also allows for more images to be added without breaking any functionality
  //setting a key within each object is extremely important here as it's critical in finding the exact object when needed
  const [listOfImages, setListOfImages] = useState(images.map((item, index) => {
    return {src: item, clickedOn: false, key: index};
  }));
  //Shown cards is initially empty but will be set when the component mounts and the useEffect code triggers
  const [shownCards, setShownCards] = useState([]);
  //This useEffect is triggered when Score changes and when component initally mounts
  useEffect(() => {
    //indexesOfImage is an array of indexes for each image in the listOfImages state
    //it's needed for reference to the images in the listOfImages state
    const indexesOfImage = []; 
    listOfImages.forEach((item, index) => {
      indexesOfImage.push(index);
    })
    //unClickedImages will filter through the listOfImages state and filter out all the images that have been clicked on
    //this array is needed to ensure that at least one image displayed is a valid image that's never been clicked on 
    let unClickedImages = listOfImages.filter(item => {
      if (!item.clickedOn) return item;
    })
    //if the unClickedImages array is empty(meaning all images have been clicked on) then the game will congratulate the user and reset all images back to being unclicked
    if (!unClickedImages.length) {
      alert('Congratulations. You\'ve gone through all the images! The score will remain but the images have been reset and you can click on all of them again. Keep going!');
      const theImages = listOfImages.map(item => {
        return {...item, clickedOn: false}
      });
      //resetting unClickedImages is required for the game to not crash
      unClickedImages = theImages;
      setListOfImages(theImages);
    }
    //randomUnclicked is a randomly chosen number based off the length of the unClickedImages array that will be used to pick a random image from the unClickedImages array
    const randomUnclicked = Math.floor(Math.random() * unClickedImages.length);
    //displayedCards is the array of images that will be shown to the user. Here, the first item in the displayedCards array is guaranteed to be an unclicked image
    const displayedCards = [unClickedImages[randomUnclicked]]
    //So here we splice out the index of the image that's already going to be shown so that it does not appear again in the array
    indexesOfImage.splice(displayedCards[0].key, 1);
    //Using a For loop we receive a random number based off the current length of indexesOfImage. We use that random number to splice out its' corresponding number in the
    //indexesOfImage array. That splice then returns a number which is used as the index for an image in listOfImages state. This number that is spliced out
    //is unique so displayedCards should never show two or more of the same image. 
    for (let i = 0; i < 9; i++) {
      let rng = Math.floor(Math.random() * indexesOfImage.length);
      displayedCards.push(listOfImages[indexesOfImage.splice(rng,1)]);
    }
    //the shuffleArray function is needed because the first item in the array will always be an unclicked one. Turning this off makes it so you can continously click
    //the first item and always be correct
    shuffleArray(displayedCards);
    setShownCards(displayedCards);
  }, [score])

  const handleSelection = (item) => {
    //After clicking on an image that's already been clicked on, a new array is created with all the clickedOn properties on the items set to false, thus resetting the game.
    if(item.clickedOn) {
      alert('You lose!');
      const theImages = listOfImages.map(item => {
        return {...item,clickedOn: false}
      })
      setListOfImages(theImages);
      setScore(0);
    } else {
      //Using the key we set that item's clickedOn property to true and increase our score by one, and best score if the score matches it.
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
          return <div onClick={(e) => handleSelection(item)} key={item.key}><Card img={item.src}/></div>
        })}
      </div>
     {score < 3 ? <div className='rules'>
        <Rules />
      </div> : null}
    </div>
  );
}

export default App;
